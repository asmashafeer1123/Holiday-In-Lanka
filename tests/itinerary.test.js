const test = require('node:test');
const assert = require('node:assert');

const { validate, generateItinerary, travelHours } = require('../lib/itinerary');
const { DESTINATIONS, seasonFor } = require('../data/destinations');

const byId = (id) => DESTINATIONS.find((d) => d.id === id);

function build(overrides) {
  const { errors, input } = validate({
    startDate: '2026-01-10',
    endDate: '2026-01-19',
    travelers: 2,
    budget: 'mid',
    pace: 'balanced',
    interests: ['beaches', 'culture'],
    mustSee: '',
    ...overrides
  });
  assert.deepStrictEqual(errors, []);
  return generateItinerary(input);
}

test('creates one entry per day of the trip', () => {
  const result = build();
  assert.strictEqual(result.days.length, 10);
  assert.strictEqual(result.days[0].title, 'Arrive in Sri Lanka');
  assert.strictEqual(result.days[9].title, 'Departure');
});

test('avoids the east coast in January and the south coast in July', () => {
  const january = build({ interests: ['beaches'] });
  const julyStops = build({ startDate: '2026-07-05', endDate: '2026-07-14', interests: ['beaches'] });

  assert.ok(!january.summary.route.includes('Arugam Bay'));
  assert.ok(!julyStops.summary.route.includes('Mirissa'));
  assert.ok(julyStops.summary.route.some((n) => ['Trincomalee', 'Pasikudah', 'Arugam Bay'].includes(n)));
});

test('includes must-see places even in the wet season', () => {
  const result = build({ startDate: '2026-06-01', endDate: '2026-06-10', mustSee: 'Mirissa whale watching' });
  assert.ok(result.summary.route.includes('Mirissa'));
  assert.ok(result.notes.some((n) => n.includes('Mirissa')));
});

test('hill country travel times are realistic', () => {
  const hours = travelHours(byId('kandy'), byId('ella'));
  assert.ok(hours >= 4 && hours <= 6, `Kandy to Ella took ${hours}h`);
});

test('rejects invalid input', () => {
  const { errors } = validate({ startDate: '2026-02-10', endDate: '2026-02-01', travelers: 0, budget: 'x' });
  assert.ok(errors.length >= 3);
});

test('season lookup', () => {
  assert.strictEqual(seasonFor(byId('trincomalee'), 7), 'best');
  assert.strictEqual(seasonFor(byId('trincomalee'), 12), 'wet');
  assert.strictEqual(seasonFor(byId('kandy'), 6), 'good');
});
