/**
 * Destination data used by the itinerary generator and the "Best time to visit" widget.
 *
 * Season fields use month numbers (1 = January ... 12 = December):
 *   best: dry, peak-season months
 *   wet:  monsoon / heavy-rain months (or park closures) to plan around
 *   any month not listed in either array is treated as "good" (shoulder season)
 *
 * Sri Lanka has two main monsoons:
 *   - Southwest (Yala) monsoon, roughly May to September: wet on the west and south coasts
 *     and the western hill country; dry on the east coast and in the north.
 *   - Northeast (Maha) monsoon, roughly December to February: wet in the north and east;
 *     dry on the west and south coasts.
 *   - October and November are inter-monsoon months with afternoon storms island-wide.
 *
 * terrain affects travel-time estimates: "hill" roads are slow and winding.
 */

const AIRPORT = {
  id: 'airport',
  name: 'Bandaranaike International Airport (Colombo)',
  lat: 7.18,
  lng: 79.88,
  terrain: 'low'
};

const INTERESTS = [
  'beaches',
  'wildlife',
  'culture',
  'food',
  'adventure',
  'wellness',
  'tea',
  'cities'
];

const DESTINATIONS = [
  {
    id: 'negombo',
    name: 'Negombo',
    region: 'West Coast',
    lat: 7.21, lng: 79.84, terrain: 'low',
    interests: ['beaches', 'food'],
    best: [11, 12, 1, 2, 3, 4], wet: [5, 6, 10],
    hidden: false,
    summary: 'Relaxed lagoon town minutes from the airport, ideal for the first or last night.',
    activities: [
      'Sunset walk along Negombo beach',
      'Early-morning visit to the Lellama fish market',
      'Boat ride through the Muthurajawela wetlands'
    ]
  },
  {
    id: 'colombo',
    name: 'Colombo',
    region: 'West Coast',
    lat: 6.93, lng: 79.85, terrain: 'low',
    interests: ['cities', 'food', 'culture'],
    best: [12, 1, 2, 3], wet: [5, 6, 10, 11],
    hidden: false,
    summary: 'The commercial capital, with colonial architecture, galleries and a lively food scene.',
    activities: [
      'Tuk-tuk tour of Pettah market and the Red Mosque',
      'Gangaramaya Temple and Beira Lake',
      'Street food evening at Galle Face Green'
    ]
  },
  {
    id: 'galle',
    name: 'Galle',
    region: 'South Coast',
    lat: 6.03, lng: 80.22, terrain: 'low',
    interests: ['culture', 'beaches', 'food'],
    best: [12, 1, 2, 3, 4], wet: [5, 6, 7],
    hidden: false,
    summary: 'A UNESCO-listed Dutch fort town with boutique cafes and ramparts over the Indian Ocean.',
    activities: [
      'Walk the Galle Fort ramparts at golden hour',
      'Cooking class with a local family',
      'Swim and snorkel at Jungle Beach'
    ]
  },
  {
    id: 'mirissa',
    name: 'Mirissa',
    region: 'South Coast',
    lat: 5.95, lng: 80.46, terrain: 'low',
    interests: ['beaches', 'wildlife'],
    best: [12, 1, 2, 3, 4], wet: [5, 6, 7, 8],
    hidden: false,
    summary: 'Palm-fringed bay known for blue whale watching and laid-back beach evenings.',
    activities: [
      'Early-morning responsible whale-watching cruise',
      'Climb Coconut Tree Hill for the view',
      'Seafood dinner on the beach'
    ]
  },
  {
    id: 'tangalle',
    name: 'Tangalle',
    region: 'South Coast',
    lat: 6.02, lng: 80.8, terrain: 'low',
    interests: ['beaches', 'wellness'],
    best: [12, 1, 2, 3, 4], wet: [5, 6, 7],
    hidden: true,
    summary: 'Quiet, uncrowded beaches and turtle nesting sites on the deep south coast.',
    activities: [
      'Night visit to the Rekawa turtle conservation beach',
      'Yoga session and a slow beach day',
      'Mulkirigala rock temple hike'
    ]
  },
  {
    id: 'yala',
    name: 'Yala and Tissamaharama',
    region: 'Deep South',
    lat: 6.28, lng: 81.29, terrain: 'low',
    interests: ['wildlife', 'adventure'],
    best: [2, 3, 4, 5, 6, 7], wet: [9, 10, 11, 12],
    hidden: false,
    summary: 'Leopard country. Note that the main block of the park usually closes in September and October.',
    activities: [
      'Dawn jeep safari in Yala National Park',
      'Birdwatching at Tissa Wewa lake',
      'Visit the Kirinda temple on the coast'
    ]
  },
  {
    id: 'udawalawe',
    name: 'Udawalawe',
    region: 'Southern Plains',
    lat: 6.47, lng: 80.89, terrain: 'low',
    interests: ['wildlife'],
    best: [1, 2, 3, 4, 6, 7, 8], wet: [10, 11],
    hidden: false,
    summary: 'One of the most reliable places in Asia to see wild elephant herds, year-round.',
    activities: [
      'Afternoon elephant safari',
      'Elephant Transit Home feeding time',
      'Sunset at the Udawalawe reservoir'
    ]
  },
  {
    id: 'sinharaja',
    name: 'Sinharaja Rainforest',
    region: 'Southwest Lowlands',
    lat: 6.4, lng: 80.5, terrain: 'hill',
    interests: ['wildlife', 'adventure'],
    best: [1, 2, 3, 4, 8, 9], wet: [5, 6, 10, 11],
    hidden: true,
    summary: 'A UNESCO rainforest full of endemic birds, with guided treks from small eco-lodges.',
    activities: [
      'Guided rainforest trek with a local naturalist',
      'Endemic bird walk at dawn',
      'Waterfall swim near the forest edge'
    ]
  },
  {
    id: 'ella',
    name: 'Ella',
    region: 'Hill Country',
    lat: 6.87, lng: 81.05, terrain: 'hill',
    interests: ['tea', 'adventure'],
    best: [1, 2, 3, 4, 8, 9], wet: [10, 11, 12],
    hidden: false,
    summary: 'A mountain village surrounded by tea estates, waterfalls and easy hikes.',
    activities: [
      'Sunrise hike up Little Adam\'s Peak',
      'Watch the train cross the Nine Arch Bridge',
      'Ella Rock trek and a tea factory visit'
    ]
  },
  {
    id: 'haputale',
    name: 'Haputale',
    region: 'Hill Country',
    lat: 6.77, lng: 80.96, terrain: 'hill',
    interests: ['tea', 'adventure', 'wellness'],
    best: [1, 2, 3, 4, 8], wet: [5, 6, 10, 11, 12],
    hidden: true,
    summary: 'Misty ridges with sweeping views over tea estates, without the Ella crowds.',
    activities: [
      'Sunrise at Lipton\'s Seat',
      'Walk through the Dambatenne tea estate',
      'Visit Adisham Bungalow and its gardens'
    ]
  },
  {
    id: 'nuwara-eliya',
    name: 'Nuwara Eliya',
    region: 'Hill Country',
    lat: 6.97, lng: 80.78, terrain: 'hill',
    interests: ['tea', 'wellness'],
    best: [1, 2, 3, 4], wet: [5, 6, 7, 10, 11],
    hidden: false,
    summary: 'Cool-climate "Little England": colonial bungalows, tea tasting and Horton Plains.',
    activities: [
      'Early hike at Horton Plains to World\'s End',
      'Tea tasting at a heritage tea factory',
      'Stroll around Gregory Lake'
    ]
  },
  {
    id: 'kandy',
    name: 'Kandy',
    region: 'Central Highlands',
    lat: 7.29, lng: 80.63, terrain: 'mid',
    interests: ['culture', 'food', 'cities'],
    best: [1, 2, 3, 4], wet: [10, 11, 12],
    hidden: false,
    summary: 'The last royal capital and home of the Temple of the Sacred Tooth Relic.',
    activities: [
      'Temple of the Sacred Tooth Relic and the evening puja',
      'Peradeniya Royal Botanical Gardens',
      'Kandyan dance performance'
    ]
  },
  {
    id: 'knuckles',
    name: 'Knuckles Range',
    region: 'Central Highlands',
    lat: 7.4, lng: 80.8, terrain: 'hill',
    interests: ['adventure', 'wellness'],
    best: [1, 2, 3, 4, 7, 8], wet: [5, 6, 10, 11, 12],
    hidden: true,
    summary: 'Remote cloud forest and traditional villages such as Meemure, far off the tourist trail.',
    activities: [
      'Guided trek to the Knuckles mini World\'s End',
      'Village homestay lunch in Meemure',
      'River swim at a natural pool'
    ]
  },
  {
    id: 'sigiriya',
    name: 'Sigiriya and Dambulla',
    region: 'Cultural Triangle',
    lat: 7.96, lng: 80.76, terrain: 'low',
    interests: ['culture', 'adventure', 'wildlife'],
    best: [1, 2, 3, 4, 6, 7, 8, 9], wet: [11, 12],
    hidden: false,
    summary: 'The Lion Rock fortress, the Dambulla cave temples and elephant safaris in Minneriya.',
    activities: [
      'Climb Sigiriya Lion Rock early to beat the heat',
      'Dambulla Cave Temple',
      'Minneriya or Kaudulla elephant gathering safari'
    ]
  },
  {
    id: 'ritigala',
    name: 'Ritigala',
    region: 'Cultural Triangle',
    lat: 8.1, lng: 80.65, terrain: 'low',
    interests: ['culture', 'adventure'],
    best: [1, 2, 3, 4, 6, 7, 8, 9], wet: [11, 12],
    hidden: true,
    summary: 'Jungle-covered ruins of an ancient forest monastery that few visitors ever see.',
    activities: [
      'Explore the Ritigala forest monastery ruins',
      'Picnic beside the ancient stone baths',
      'Village bicycle ride through the paddy fields'
    ]
  },
  {
    id: 'anuradhapura',
    name: 'Anuradhapura',
    region: 'Cultural Triangle',
    lat: 8.31, lng: 80.4, terrain: 'low',
    interests: ['culture'],
    best: [1, 2, 3, 5, 6, 7, 8, 9], wet: [10, 11, 12],
    hidden: false,
    summary: 'Sri Lanka\'s first capital, with giant dagobas and the sacred Bodhi tree.',
    activities: [
      'Cycle between the ancient dagobas',
      'Sri Maha Bodhi sacred fig tree',
      'Mihintale at sunset'
    ]
  },
  {
    id: 'wilpattu',
    name: 'Wilpattu',
    region: 'Northwest',
    lat: 8.43, lng: 80.04, terrain: 'low',
    interests: ['wildlife', 'adventure'],
    best: [2, 3, 4, 5, 6, 7, 8, 9], wet: [10, 11, 12],
    hidden: true,
    summary: 'The island\'s largest national park: quiet leopard safaris among natural lakes.',
    activities: [
      'Full-day leopard and sloth bear safari',
      'Birdwatching around the villus (natural lakes)',
      'Evening by the campfire at a tented camp'
    ]
  },
  {
    id: 'kalpitiya',
    name: 'Kalpitiya',
    region: 'Northwest Coast',
    lat: 8.23, lng: 79.76, terrain: 'low',
    interests: ['beaches', 'wildlife', 'adventure'],
    best: [12, 1, 2, 3, 4, 6, 7, 8], wet: [10, 11],
    hidden: true,
    summary: 'A lagoon peninsula famous for dolphin pods in winter and kitesurfing in summer.',
    activities: [
      'Dolphin-watching boat trip (December to April)',
      'Kitesurfing lesson on the lagoon (May to October)',
      'Snorkel the Bar Reef'
    ]
  },
  {
    id: 'jaffna',
    name: 'Jaffna',
    region: 'North',
    lat: 9.66, lng: 80.02, terrain: 'low',
    interests: ['culture', 'food'],
    best: [2, 3, 4, 5, 6, 7, 8, 9], wet: [10, 11, 12],
    hidden: true,
    summary: 'Tamil culture, Hindu kovils, island hopping and the best crab curry in the country.',
    activities: [
      'Nallur Kandaswamy Kovil and Jaffna Fort',
      'Day trip to Delft island',
      'Jaffna crab curry cooking experience'
    ]
  },
  {
    id: 'trincomalee',
    name: 'Trincomalee',
    region: 'East Coast',
    lat: 8.57, lng: 81.23, terrain: 'low',
    interests: ['beaches', 'wildlife', 'culture'],
    best: [4, 5, 6, 7, 8, 9], wet: [11, 12, 1],
    hidden: false,
    summary: 'A deep natural harbour with white-sand beaches, Pigeon Island and Koneswaram Temple.',
    activities: [
      'Snorkel with reef sharks at Pigeon Island',
      'Koneswaram Temple on Swami Rock',
      'Relax at Nilaveli beach'
    ]
  },
  {
    id: 'pasikudah',
    name: 'Pasikudah',
    region: 'East Coast',
    lat: 7.93, lng: 81.56, terrain: 'low',
    interests: ['beaches', 'wellness'],
    best: [4, 5, 6, 7, 8, 9], wet: [11, 12, 1],
    hidden: true,
    summary: 'A shallow, calm bay that stays knee-deep far from shore, perfect for families.',
    activities: [
      'Swim in the calm lagoon-like bay',
      'Spa afternoon at a beach resort',
      'Batticaloa lagoon and Dutch fort visit'
    ]
  },
  {
    id: 'arugam-bay',
    name: 'Arugam Bay',
    region: 'East Coast',
    lat: 6.84, lng: 81.83, terrain: 'low',
    interests: ['beaches', 'adventure'],
    best: [5, 6, 7, 8, 9], wet: [11, 12, 1, 2],
    hidden: false,
    summary: 'A world-class surf town with laid-back cafes and nearby elephant-filled lagoons.',
    activities: [
      'Surf lesson at Whiskey Point or Main Point',
      'Kumana National Park birding safari',
      'Sunset at Elephant Rock'
    ]
  }
];

/**
 * Returns "best", "good" or "wet" for a destination in a given month (1-12).
 */
function seasonFor(destination, month) {
  if (destination.best.includes(month)) return 'best';
  if (destination.wet.includes(month)) return 'wet';
  return 'good';
}

module.exports = { AIRPORT, INTERESTS, DESTINATIONS, seasonFor };
