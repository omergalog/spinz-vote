export type BikeColor = {
  id: string
  nameHe: string
  nameEn: string
  hex: string
  image: 1 | 2
}

export const BIKE_COLORS: BikeColor[] = [
  // survey-1.jpeg — 6 colors (8-13)
  { id: 'ltblue',  nameHe: 'תכלת',             nameEn: 'Light Blue',       hex: '#6BB5D5', image: 1 },
  { id: 'teal',    nameHe: 'טורקיז',           nameEn: 'Turquoise',        hex: '#2AB89A', image: 1 },
  { id: 'mblack',  nameHe: 'שחור מט',          nameEn: 'Matte Black',      hex: '#2A2A2A', image: 1 },
  { id: 'wblack',  nameHe: 'שחור לוגו לבן',    nameEn: 'Black White Logo', hex: '#1C1C1C', image: 1 },
  { id: 'orange',  nameHe: 'כתום',             nameEn: 'Orange',           hex: '#E8621A', image: 1 },
  { id: 'beige',   nameHe: "בז'",              nameEn: 'Beige',            hex: '#D4B896', image: 1 },
  // survey-2.jpeg — 7 colors (1-7)
  { id: 'red',     nameHe: 'אדום',             nameEn: 'Red',              hex: '#CC3333', image: 2 },
  { id: 'gray',    nameHe: 'אפור',             nameEn: 'Gray',             hex: '#888888', image: 2 },
  { id: 'navy',    nameHe: 'כחול כהה',         nameEn: 'Dark Blue',        hex: '#1E3A6E', image: 2 },
  { id: 'olive',   nameHe: 'ירוק זית',         nameEn: 'Olive',            hex: '#8A9B6A', image: 2 },
  { id: 'dkgreen', nameHe: 'ירוק כהה',         nameEn: 'Dark Green',       hex: '#1E4D2B', image: 2 },
  { id: 'terra',   nameHe: 'טרקוטה',           nameEn: 'Terracotta',       hex: '#B05030', image: 2 },
  { id: 'purple',  nameHe: 'סגול',             nameEn: 'Purple',           hex: '#8A6BAA', image: 2 },
]
