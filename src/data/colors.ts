export type BikeColor = {
  id: string
  nameHe: string
  nameEn: string
  hex: string
  src: string
}

export const BIKE_COLORS: BikeColor[] = [
  { id: 'red',     nameHe: 'אדום',           nameEn: 'Red',              hex: '#CC3333', src: '/colors/red.png'     },
  { id: 'gray',    nameHe: 'כסוף',           nameEn: 'Silver',           hex: '#888888', src: '/colors/gray.png'    },
  { id: 'navy',    nameHe: 'כחול כהה',       nameEn: 'Dark Blue',        hex: '#1E3A6E', src: '/colors/navy.png'    },
  { id: 'olive',   nameHe: 'ירוק זית',       nameEn: 'Olive',            hex: '#8A9B6A', src: '/colors/olive.png'   },
  { id: 'terra',   nameHe: 'טרקוטה',         nameEn: 'Terracotta',       hex: '#B05030', src: '/colors/terra.png'   },
  { id: 'purple',  nameHe: 'סגול',           nameEn: 'Purple',           hex: '#8A6BAA', src: '/colors/purple.png'  },
  { id: 'ltblue',  nameHe: 'תכלת',           nameEn: 'Light Blue',       hex: '#6BB5D5', src: '/colors/ltblue.png'  },
  { id: 'teal',    nameHe: 'טורקיז',         nameEn: 'Turquoise',        hex: '#2AB89A', src: '/colors/teal.png'    },
  { id: 'mblack',  nameHe: 'שחור מט',        nameEn: 'Matte Black',      hex: '#2A2A2A', src: '/colors/mblack.png'  },
  { id: 'wblack',  nameHe: 'שחור לוגו לבן',  nameEn: 'Black White Logo', hex: '#1C1C1C', src: '/colors/wblack.png'  },
  { id: 'orange',  nameHe: 'כתום',           nameEn: 'Orange',           hex: '#E8621A', src: '/colors/orange.png'  },
  { id: 'beige',   nameHe: "בז'",            nameEn: 'Beige',            hex: '#D4B896', src: '/colors/beige.png'   },
]
