// Genre Colors for consistent styling across charts
export const GENRE_COLORS: Record<string, string> = {
  'k-pop': '#FF6B9D', // Pink
  'k-hip-hop': '#FF9F6B', // Coral
  'k-rnb': '#FFB6C1', // Light Pink
  'k-rock': '#DC143C', // Crimson
  house: '#00BFFF', // Deep Sky Blue
  techno: '#4B0082', // Indigo
  trap: '#FF4500', // Orange Red
  dubstep: '#9400D3', // Dark Violet
  'future-bass': '#00CED1', // Dark Turquoise
  'electro-pop': '#DA70D6', // Orchid
  downtempo: '#5F9EA0', // Cadet Blue
  'progressive-house': '#1E90FF', // Dodger Blue
  midtempo: '#8B008B', // Dark Magenta
  'hip-hop': '#FFA500', // Orange
  rnb: '#DDA0DD', // Plum
  'alt-rnb': '#E6B8D9', // Lighter Plum
  rock: '#B22222', // Fire Brick
  'alt-rock': '#CD5C5C', // Indian Red
  'indie-pop': '#98FB98', // Pale Green
  'indie-rock': '#32CD32', // Lime Green
  pop: '#FF69B4', // Hot Pink
  'alt-pop': '#FF85C1', // Lighter Hot Pink
  country: '#DAA520', // Goldenrod
  latin: '#FF6347', // Tomato
  afrobeats: '#9ACD32', // Yellow Green
  'j-pop': '#FF1493', // Deep Pink
  'c-pop': '#DB7093', // Pale Violet Red
  bass: '#7B68EE', // Medium Slate Blue
  'melodic-bass': '#6A5ACD', // Slate Blue
  electronic: '#00FFFF', // Cyan
  other: '#808080', // Gray
}

// Meta tags to ignore for genre classification
export const META_TAGS = new Set([
  'solo',
  'group',
  'band',
  'duo',
  'dj',
  'dj-duo',
  'dj-group',
  'collab',
  'producer',
  'english',
  'korean',
  'japanese',
  'french',
  'spanish',
  'mandarin',
  'bilingual',
  'instrumental',
  'us',
  'uk',
  'south-korea',
  'japan',
  'china',
  'france',
  'canada',
  'australia',
  'sweden',
  'germany',
  'belgium',
  'norway',
  'haiti',
  'indonesia',
  'nigeria',
  'colombia',
  'spain',
  'puerto-rico',
  'new-zealand',
  'hong-kong',
  'lebanon',
  'bangladesh',
  'multi-national',
  'korean-american',
  'vietnamese-american',
  'festival',
  'electronic',
  'edm',
  'girl-group',
  'boy-group',
])

// Genre hierarchy - first match wins (order matters!)
export const GENRE_PRIORITY: string[] = [
  // Korean Specific (highest priority)
  'k-pop',
  'k-hip-hop',
  'k-rnb',
  'k-rock',
  // Specific Electronic
  'techno',
  'house',
  'trap',
  'dubstep',
  'future-bass',
  'hardstyle',
  'midtempo',
  'downtempo',
  'electro-pop',
  'progressive-house',
  'uk-garage',
  'disco-house',
  'electro-house',
  'melodic-house',
  'melodic-bass',
  'bass',
  'indietronica',
  'live-electronic',
  'future-funk',
  'nu-jazz',
  'synth-pop',
  'dancehall',
  // General Genres
  'hip-hop',
  'rnb',
  'alt-rnb',
  'rock',
  'alt-rock',
  'pop-rock',
  'pop-punk',
  'emo',
  'metalcore',
  'indie-pop',
  'indie-rock',
  'pop',
  'alt-pop',
  'country',
  'soul',
  'soul-pop',
  'funk',
  'afrobeats',
  'latin',
  'reggaeton',
  'j-pop',
  'c-pop',
]

// Colors for treemap
export const TREEMAP_COLORS = {
  festival: '#82ca9d',
  venue: '#8884d8',
}
