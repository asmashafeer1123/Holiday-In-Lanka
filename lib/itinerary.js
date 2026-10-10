/**
 * Monsoon-aware itinerary generator.
 *
 * How it works:
 *   1. Every destination is scored against the traveller's interests, the season in
 *      the month of travel, and any "must-see" places they typed in.
 *   2. The best destinations are picked one at a time, preferring places close to ones
 *      already chosen, so the route stays geographically sensible.
 *   3. The chosen stops are put in a sensible driving order, starting from the airport.
 *   4. Nights are shared out according to the travel pace, and each day gets
 *      activities, realistic travel times (with buffer) and a weather note.
 *   5. A transparent cost estimate is calculated from the budget level.
 */

const { AIRPORT, INTERESTS, DESTINATIONS, seasonFor } = require('../data/destinations');

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const PACE_NIGHTS = { relaxed: 3, balanced: 2, fast: 1 };

// Daily cost per person (USD) for stays, food and activities, by budget level.
const DAILY_COST = {
  budget: { low: 40, high: 75, label: 'Budget' },
  mid: { low: 90, high: 180, label: 'Mid-range' },
  luxury: { low: 250, high: 500, label: 'Luxury' }
};

// Transport cost per hour of travel (USD).
// Budget travellers use trains and buses (priced per person);
// mid-range and luxury use a private car with a driver (priced per vehicle, up to 4 people).
const TRANSPORT_RATE = {
  budget: { perPerson: 3 },
  mid: { perVehicle: 14 },
  luxury: { perVehicle: 24 }
};

const SEASON_NOTES = {
  best: 'Peak season: mostly dry and sunny. Book stays early.',
  good: 'Shoulder season: generally good weather with occasional showers.',
  wet: 'Monsoon season: expect heavy rain. Keep this stop short and plans flexible.'
};

const ALIASES = {
  sigiriya: ['sigiriya', 'lion rock', 'dambulla', 'minneriya'],
  ella: ['ella', 'nine arch', 'nine arches', 'little adam'],
  'nuwara-eliya': ['nuwara eliya', 'horton plains', 'worlds end', "world's end"],
  kandy: ['kandy', 'tooth relic', 'temple of the tooth', 'peradeniya'],
  galle: ['galle', 'unawatuna'],
  mirissa: ['mirissa', 'whale'],
  yala: ['yala', 'leopard', 'tissa'],
  'arugam-bay': ['arugam', 'surf'],
  trincomalee: ['trincomalee', 'trinco', 'pigeon island', 'nilaveli'],
  knuckles: ['knuckles', 'meemure']
};

function haversineKm(a, b) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(h));
}

/**
 * Realistic road travel time in hours (rounded to the nearest half hour).
 * Straight-line distance is converted to road distance, divided by a typical
 * average speed for the terrain, then a 20% buffer plus 15 minutes is added
 * for traffic, rest stops and photo breaks.
 */
function travelHours(a, b) {
  const terrains = [a.terrain, b.terrain];
  const hillCount = terrains.filter((t) => t === 'hill').length;
  const midland = terrains.includes('mid');
  // Hill to hill (or hill to Kandy) is slow mountain road; hill to lowland is partly mountain road.
  const mountain = hillCount === 2 || (hillCount === 1 && midland);
  const roadFactor = mountain ? 1.5 : hillCount ? 1.4 : 1.35;
  const speed = mountain ? 28 : hillCount ? 36 : midland ? 38 : 48;
  const roadKm = haversineKm(a, b) * roadFactor;
  const hours = (roadKm / speed) * 1.2 + 0.25;
  return Math.max(0.5, Math.round(hours * 2) / 2);
}

function formatHours(hours) {
  const whole = Math.floor(hours);
  const half = hours - whole >= 0.5;
  if (whole === 0) return '30 minutes';
  return `${whole}${half ? '.5' : ''} hour${hours === 1 ? '' : 's'}`;
}

function addDays(date, days) {
  const copy = new Date(date.getTime());
  copy.setUTCDate(copy.getUTCDate() + days);
  return copy;
}

function isoDate(date) {
  return date.toISOString().slice(0, 10);
}

/**
 * Checks the request body and returns { errors, input }.
 */
function validate(body = {}) {
  const errors = [];
  const start = new Date(`${body.startDate}T00:00:00Z`);
  const end = new Date(`${body.endDate}T00:00:00Z`);

  if (Number.isNaN(start.getTime())) errors.push('Please choose a valid start date.');
  if (Number.isNaN(end.getTime())) errors.push('Please choose a valid end date.');

  let days = 0;
  if (!errors.length) {
    days = Math.round((end - start) / 86400000) + 1;
    if (days < 1) errors.push('The end date must be on or after the start date.');
    if (days > 30) errors.push('Trips can be up to 30 days long.');
  }

  const travelers = Number.parseInt(body.travelers, 10);
  if (!Number.isInteger(travelers) || travelers < 1 || travelers > 20) {
    errors.push('Number of travellers must be between 1 and 20.');
  }

  const budget = body.budget;
  if (!DAILY_COST[budget]) errors.push('Please choose a budget range.');

  const pace = body.pace || 'balanced';
  if (!PACE_NIGHTS[pace]) errors.push('Please choose a travel style.');

  const rawInterests = Array.isArray(body.interests) ? body.interests : [];
  const interests = rawInterests.filter((i) => INTERESTS.includes(i));

  const mustSee = String(body.mustSee || '').slice(0, 300);

  return {
    errors,
    input: { start, end, days, travelers, budget, pace, interests, mustSee }
  };
}

function mustSeeMatches(destination, mustSee) {
  if (!mustSee) return false;
  const text = mustSee.toLowerCase();
  const names = ALIASES[destination.id] && ALIASES[destination.id].length
    ? ALIASES[destination.id]
    : [destination.name.toLowerCase().split(' ')[0]];
  return names.some((name) => text.includes(name));
}

function scoreDestination(destination, { month, interests, mustSee }) {
  const season = seasonFor(destination, month);
  let score = { best: 4, good: 1, wet: -6 }[season];

  const matches = destination.interests.filter((i) => interests.includes(i)).length;
  score += interests.length ? matches * 3 : 1;

  // Slight preference for lesser-known places, to help spread tourism around the island.
  if (destination.hidden) score += 0.5;

  const mustSeeHit = mustSeeMatches(destination, mustSee);
  if (mustSeeHit) score += 12;

  return { destination, score, season, mustSeeHit };
}

/**
 * Picks stops one at a time, penalising places far from those already chosen.
 */
function pickStops(scored, count) {
  const pool = scored.filter((s) => s.score > 0 || s.mustSeeHit);
  const chosen = [];

  while (chosen.length < count && pool.length) {
    let bestIndex = 0;
    let bestValue = -Infinity;
    pool.forEach((candidate, index) => {
      const anchors = chosen.length ? chosen.map((c) => c.destination) : [AIRPORT];
      const nearestKm = Math.min(...anchors.map((a) => haversineKm(a, candidate.destination)));
      // Must-see places are always kept, regardless of distance.
      const penalty = candidate.mustSeeHit ? 0 : nearestKm / 40;
      const value = candidate.score - penalty;
      if (value > bestValue) {
        bestValue = value;
        bestIndex = index;
      }
    });
    chosen.push(pool.splice(bestIndex, 1)[0]);
  }
  return chosen;
}

/**
 * Orders stops by "nearest next stop", starting from the airport.
 */
function orderStops(stops) {
  const remaining = [...stops];
  const ordered = [];
  let current = AIRPORT;
  while (remaining.length) {
    let nearest = 0;
    remaining.forEach((s, i) => {
      if (haversineKm(current, s.destination) < haversineKm(current, remaining[nearest].destination)) {
        nearest = i;
      }
    });
    const next = remaining.splice(nearest, 1)[0];
    ordered.push(next);
    current = next.destination;
  }
  return ordered;
}

function regionAdvice(month) {
  if ([12, 1, 2, 3].includes(month)) {
    return 'The west and south coasts and the hill country are at their best. The east coast and the north are in their wet season.';
  }
  if (month === 4) {
    return 'April is a transition month: most of the island is good, with rising heat and some afternoon showers. Sinhala and Tamil New Year falls mid-month.';
  }
  if ([5, 6, 7, 8, 9].includes(month)) {
    return 'The southwest monsoon brings rain to the west, south and western hills. The east coast, the north and the Cultural Triangle are at their best.';
  }
  return 'October and November are inter-monsoon months, with afternoon storms in most regions. The Cultural Triangle and the deep south usually stay the most manageable.';
}

function generateItinerary(input) {
  const { start, days, travelers, budget, pace, interests, mustSee } = input;

  // Use the month in the middle of the trip to decide on seasons.
  const midDate = addDays(start, Math.floor((days - 1) / 2));
  const month = midDate.getUTCMonth() + 1;

  const scored = DESTINATIONS
    .filter((d) => d.id !== 'negombo')
    .map((d) => scoreDestination(d, { month, interests, mustSee }))
    .sort((a, b) => b.score - a.score);

  // Night 1 is always near the airport. The final day is the departure day.
  const flexibleNights = Math.max(0, days - 2);
  const nightsPerStop = PACE_NIGHTS[pace];
  const stopCount = flexibleNights === 0 ? 0 : Math.min(8, Math.max(1, Math.floor(flexibleNights / nightsPerStop)));

  const stops = orderStops(pickStops(scored, stopCount));

  // Share nights between stops. Spare nights go to the highest-scoring stops.
  const nights = stops.map(() => (stops.length ? Math.floor(flexibleNights / stops.length) : 0));
  let spare = flexibleNights - nights.reduce((a, b) => a + b, 0);
  const byScore = stops
    .map((s, i) => ({ i, score: s.score }))
    .sort((a, b) => b.score - a.score);
  for (let k = 0; spare > 0; k = (k + 1) % byScore.length, spare -= 1) {
    nights[byScore[k].i] += 1;
  }

  const negombo = DESTINATIONS.find((d) => d.id === 'negombo');
  const plan = [];
  let dayNumber = 1;
  let totalTravelHours = 0;

  const pushDay = (fields) => {
    plan.push({ day: dayNumber, date: isoDate(addDays(start, dayNumber - 1)), ...fields });
    dayNumber += 1;
  };

  const arrivalTransfer = travelHours(AIRPORT, negombo);
  totalTravelHours += arrivalTransfer;

  if (days === 1) {
    pushDay({
      title: 'Arrival and departure',
      location: negombo.name,
      travel: null,
      activities: ['A one-day stopover: relax in Negombo and return to the airport in the evening.'],
      weather: SEASON_NOTES[seasonFor(negombo, month)]
    });
  } else {
    pushDay({
      title: 'Arrive in Sri Lanka',
      location: negombo.name,
      travel: { from: 'Airport', to: negombo.name, hours: arrivalTransfer, label: formatHours(arrivalTransfer) },
      activities: [
        'Meet your verified driver or take a fixed-price airport taxi.',
        'Check in, rest and adjust to the time zone.',
        negombo.activities[0]
      ],
      weather: SEASON_NOTES[seasonFor(negombo, month)]
    });
  }

  let previous = negombo;
  stops.forEach((stop, index) => {
    const d = stop.destination;
    const hours = travelHours(previous, d);
    totalTravelHours += hours;
    const stayDays = nights[index];

    const freeDay = 'Free day: relax, revisit a favourite spot or book an optional experience.';
    for (let n = 0; n < stayDays; n += 1) {
      const isTravelDay = n === 0;
      let activities;
      if (isTravelDay) {
        let after;
        if (hours >= 5) after = 'A long travel day: check in and keep the evening easy.';
        else if (stayDays === 1) after = `After check-in: ${d.activities[0]}`; // one-night stop, fit in the highlight
        else after = `After check-in: settle in and take an easy first look around ${d.name}.`;
        activities = [`Travel from ${previous.name} to ${d.name} (about ${formatHours(hours)} including rest stops).`, after];
      } else {
        activities = [d.activities[n - 1] || freeDay];
      }

      pushDay({
        title: isTravelDay ? `${previous.name} to ${d.name}` : `${d.name}: ${d.region}`,
        location: d.name,
        travel: isTravelDay
          ? { from: previous.name, to: d.name, hours, label: formatHours(hours) }
          : null,
        activities,
        weather: SEASON_NOTES[stop.season]
      });
    }
    previous = d;
  });

  if (days > 1) {
    const departure = travelHours(previous, AIRPORT);
    totalTravelHours += departure;
    pushDay({
      title: 'Departure',
      location: 'Airport',
      travel: { from: previous.name, to: 'Airport', hours: departure, label: formatHours(departure) },
      activities: [
        `Transfer from ${previous.name} to the airport (about ${formatHours(departure)}).`,
        departure >= 4
          ? 'Choose an afternoon or evening flight, and leave at least 3 hours before departure.'
          : 'Allow at least 3 hours at the airport before your flight.'
      ],
      weather: null
    });
  }

  // Costs.
  const daily = DAILY_COST[budget];
  const rate = TRANSPORT_RATE[budget];
  const nightsTotal = Math.max(days - 1, 1);
  const vehicles = Math.ceil(travelers / 4);
  const transportGroup = rate.perPerson
    ? rate.perPerson * totalTravelHours * travelers
    : rate.perVehicle * totalTravelHours * vehicles;

  const groupLow = Math.round(daily.low * nightsTotal * travelers + transportGroup);
  const groupHigh = Math.round(daily.high * nightsTotal * travelers + transportGroup * 1.25);

  const notes = [];
  const wetStops = stops.filter((s) => s.season === 'wet').map((s) => s.destination.name);
  if (wetStops.length) {
    notes.push(`${wetStops.join(', ')} ${wetStops.length > 1 ? 'are' : 'is'} in the wet season during your trip. ${wetStops.length > 1 ? 'They were' : 'It was'} kept because you asked for ${wetStops.length > 1 ? 'them' : 'it'}.`);
  }
  if (interests.length === 0) {
    notes.push('You did not pick any interests, so we built a balanced mix. Choose interests for a more personal plan.');
  }
  notes.push('Travel times include a buffer for traffic, winding roads and rest stops.');
  notes.push('Prices are estimates in US dollars and will be confirmed with verified providers before booking.');

  return {
    summary: {
      days,
      travelers,
      pace,
      budget: daily.label,
      month: MONTH_NAMES[month - 1],
      regionAdvice: regionAdvice(month),
      route: ['Negombo', ...stops.map((s) => s.destination.name)],
      totalTravelHours
    },
    days: plan,
    costs: {
      currency: 'USD',
      perPerson: {
        low: Math.round(groupLow / travelers),
        high: Math.round(groupHigh / travelers)
      },
      group: { low: groupLow, high: groupHigh },
      breakdown: {
        dailyPerPerson: { low: daily.low, high: daily.high },
        transportGroup: Math.round(transportGroup),
        transportMode: rate.perPerson ? 'Trains, buses and shared transfers' : 'Private car with driver'
      }
    },
    notes
  };
}

module.exports = { validate, generateItinerary, travelHours, MONTH_NAMES };
