export type SignatureDesign =
  | 'gryffindor'   // Flagship Dark Academia: Obsidian, Burgundy, Scarlet, Antique Gold
  | 'marijana'     // Marijana Pavlinić (marijanapav.com): Pantone Swatch Grid, Sneak Peek, Camera Roll
  | 'aritro'       // Aritro Paul (aritro.xyz): Satoshi typography, Telemetry HUD, Tactile Action Rows
  | 'eyeballs'     // Eyeballs (eyeballs.co): Electric Lime #d5ff7a, Figtree, High-voltage Contrast
  | 'fudali'       // Fudali Studio (fudali.studio): Before/After Slider, Swiss Momentum, Kinetic Metrics
  | 'bradley'      // Bradley Ziffer (bradleyziffer.com): Quiet Architectural Whitespace & Coordinates
  | 'dani'         // Hello Dani (hellodani.co): Playful Warm Sand, Sticker Badges, Tactile Elevation
  | 'yukiasakura'; // Yuki Asakura (yukiasakura.com): Transit Stations, Guided Corridor

export interface DesignPresetMeta {
  id: SignatureDesign;
  name: string;
  sourceRef: string;
  folderNum: string;
  accentColor: string;
  bgPreview: string;
  description: string;
  tagline: string;
  fontBadge: string;
}

export const DESIGN_PRESETS: DesignPresetMeta[] = [
  {
    id: 'gryffindor',
    name: 'Gryffindor Flagship',
    sourceRef: 'The Common Room (Master Direction)',
    folderNum: 'HQ',
    accentColor: '#D3A625',
    bgPreview: '#0B0B0C',
    description: 'Dark Academia luxury with deep burgundy, obsidian black, and antique gold.',
    tagline: 'Courage, Craft & Intellectual Depth',
    fontBadge: 'Cinzel / Inter / Monospace',
  },
  {
    id: 'marijana',
    name: 'Marijana Pavlinić Garden',
    sourceRef: 'marijanapav.com',
    folderNum: '02',
    accentColor: '#FF6B6B',
    bgPreview: '#121214',
    description: 'Bento digital garden with interactive Pantone RGB swatches, sneak-peek blur cards, and camera rolls.',
    tagline: 'Personal Digital Garden & Pantone Spectrum',
    fontBadge: 'IBM Plex Mono / Archivo',
  },
  {
    id: 'aritro',
    name: 'Aritro Paul Telemetry',
    sourceRef: 'aritro.xyz',
    folderNum: '17',
    accentColor: '#10B981',
    bgPreview: '#0C0D0E',
    description: 'Minimalist product designer telemetry, tabular numerals, hardware HUD, and tactile action rows.',
    tagline: 'Precision Hardware Telemetry & Satoshi Type',
    fontBadge: 'Satoshi / Pecita Script',
  },
  {
    id: 'eyeballs',
    name: 'Eyeballs Broadcast Reel',
    sourceRef: 'eyeballs.co',
    folderNum: '01',
    accentColor: '#D5FF7A',
    bgPreview: '#000000',
    description: 'Electric lime high-voltage broadcast media library, infinite marquee ticker, and bold Figtree typography.',
    tagline: 'High-Voltage Contrast & Broadcast Presence',
    fontBadge: 'Figtree / Serif Light',
  },
  {
    id: 'fudali',
    name: 'Fudali Momentum Studio',
    sourceRef: 'fudali.studio',
    folderNum: '16',
    accentColor: '#3B82F6',
    bgPreview: '#0E0F12',
    description: 'Kinetic startup design with interactive Before/After sliders and live momentum metric counters.',
    tagline: 'Before/After Evolution & Swiss Grid',
    fontBadge: 'Albert Sans / Monospace',
  },
  {
    id: 'bradley',
    name: 'Bradley Ziffer Architectural',
    sourceRef: 'bradleyziffer.com',
    folderNum: '15',
    accentColor: '#95E78E',
    bgPreview: '#0D0E0E',
    description: 'Ultra-quiet architectural whitespace, monospaced coordinate marks, and intentional case study traces.',
    tagline: 'Making Things With More Intention',
    fontBadge: 'Crimson Pro / Hairline Mono',
  },
  {
    id: 'dani',
    name: 'Hello Dani Playful Bento',
    sourceRef: 'hellodani.co',
    folderNum: '06',
    accentColor: '#F59E0B',
    bgPreview: '#181512',
    description: 'Warm sand and peach bento cards, tactile sticker badges, and candid product narratives.',
    tagline: 'Handcrafted With Love & Playful Depth',
    fontBadge: 'Plus Jakarta / Editorial Italic',
  },
  {
    id: 'yukiasakura',
    name: 'Yuki Asakura Transit Corridor',
    sourceRef: 'yukiasakura.com',
    folderNum: '05',
    accentColor: '#38BDF8',
    bgPreview: '#0A0E14',
    description: 'Station-by-station guided transit line with route progress trackers and spatial mobility systems.',
    tagline: 'Mobility Systems & Spatial Wayfinding',
    fontBadge: 'Mobitec Mono / Neo-Grotesk',
  },
];
