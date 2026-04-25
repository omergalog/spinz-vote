export type BikeColor = {
  id: string
  name: string
  hex: string
  image: number // 1 or 2 (which placeholder image)
}

export const BIKE_COLORS: BikeColor[] = [
  { id: 'gust',    name: 'SPINZ GUST',    hex: '#D4B896', image: 1 },
  { id: 'echo',    name: 'SPINZ ECHO',    hex: '#F5820D', image: 1 },
  { id: 'zest',    name: 'SPINZ ZEST',    hex: '#1A7A6E', image: 1 },
  { id: 'onyx',    name: 'SPINZ ONYX',    hex: '#1C1C1C', image: 1 },
  { id: 'skye',    name: 'SPINZ SKYE',    hex: '#7BB8D4', image: 1 },
  { id: 'color-6', name: 'צבע 6',         hex: '#8B3A3A', image: 2 },
  { id: 'color-7', name: 'צבע 7',         hex: '#3A5C8B', image: 2 },
  { id: 'color-8', name: 'צבע 8',         hex: '#4A7C3F', image: 2 },
  { id: 'color-9', name: 'צבע 9',         hex: '#7A6A3A', image: 2 },
  { id: 'color-10',name: 'צבע 10',        hex: '#5A3A7A', image: 2 },
]
