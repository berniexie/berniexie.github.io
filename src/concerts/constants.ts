// Genre Colors for consistent styling across charts (balanced taupe-friendly palette)
export const GENRE_COLORS: Record<string, string> = {
  'k-pop': '#D4918F', // Soft Rose
  'k-hip-hop': '#C9A067', // Warm Caramel
  'k-rnb': '#D4B8A8', // Warm Blush
  'k-rock': '#B85A5A', // Dusty Red
  house: '#5BA88E', // Jade
  techno: '#6B5B8A', // Soft Purple
  trap: '#C07040', // Burnt Orange
  dubstep: '#8B6B9E', // Soft Violet
  'future-bass': '#4A9E9E', // Teal
  'electro-pop': '#B87A98', // Rose Pink
  downtempo: '#7AAA8A', // Seafoam
  'progressive-house': '#5A8AB0', // Steel Blue
  midtempo: '#9E5A7A', // Mauve
  'hip-hop': '#D4A050', // Golden
  rnb: '#B8A080', // Tan
  'alt-rnb': '#C9B8A0', // Light Tan
  rock: '#A05858', // Brick
  'alt-rock': '#B87070', // Coral Red
  'indie-pop': '#70B888', // Mint
  'indie-rock': '#5AA868', // Green
  pop: '#D0909A', // Blush
  'alt-pop': '#D4A8B0', // Light Blush
  country: '#C9A050', // Mustard
  latin: '#C87058', // Terracotta
  afrobeats: '#98B860', // Lime Olive
  'j-pop': '#C87098', // Magenta Rose
  'c-pop': '#B88888', // Dusty Rose
  bass: '#6A7AB0', // Periwinkle
  'melodic-bass': '#5A5A98', // Slate Blue
  electronic: '#58A8A8', // Aqua
  other: '#909090', // Grey
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

// Colors for treemap (balanced taupe-friendly palette)
export const TREEMAP_COLORS = {
  festival: '#5AAA78', // Jade Green
  venue: '#5A7AB0', // Steel Blue
}

