import type { ItineraryDay } from './types'

export type TripPhoto = {
  id: 'polignano' | 'lecce' | 'salento' | 'matera' | 'naples'
  place: string
  alt: string
  author: string
  license: string
  licenseUrl: string
  sourceUrl: string
  width: number
  height: number
  position: string
}

export const tripPhotos: Record<TripPhoto['id'], TripPhoto> = {
  polignano: {
    id: 'polignano',
    place: 'Lama Monachile, Polignano a Mare',
    alt: 'Lama Monachile cove between the limestone cliffs and white buildings of Polignano a Mare',
    author: 'ParisTaras',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Polignano_a_mare_-Lama_Monachile.jpg',
    width: 1920,
    height: 1333,
    position: '50% 52%',
  },
  lecce: {
    id: 'lecce',
    place: 'Basilica di Santa Croce, Lecce',
    alt: 'The carved Baroque stone facade of Basilica di Santa Croce under a pale blue sky in Lecce',
    author: 'acediscovery',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Basilica-di-Santa-Croce_Lecce.jpg',
    width: 1920,
    height: 1179,
    position: '50% 45%',
  },
  salento: {
    id: 'salento',
    place: 'Faraglioni di Sant’Andrea, Salento',
    alt: 'Turquoise Adriatic water around the limestone sea stacks and cliffs of Sant’Andrea in Salento',
    author: 'Sailko',
    license: 'CC BY 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/3.0/',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Faraglioni_di_sant%27andrea_a_melendugno_03.jpg',
    width: 1920,
    height: 715,
    position: '50% 50%',
  },
  matera: {
    id: 'matera',
    place: 'Sassi di Matera',
    alt: 'A wide view across the pale stone homes, churches, and lanes of the Sassi di Matera',
    author: 'Camelia.boban',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Panorama_Sassi_di_Matera.jpg',
    width: 1920,
    height: 618,
    position: '50% 50%',
  },
  naples: {
    id: 'naples',
    place: 'Naples from Posillipo',
    alt: 'Naples and its waterfront seen from Posillipo as warm light breaks through dark clouds',
    author: 'Maurizio Moro5153',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Panorama_Napoli_da_Posillipo.jpg',
    width: 1920,
    height: 1206,
    position: '50% 55%',
  },
}

export const photoList = Object.values(tripPhotos)

export function photoForDay(day: ItineraryDay): TripPhoto {
  if (day.date === '2026-09-20' || day.date === '2026-09-21') return tripPhotos.salento
  if (day.base.includes('Polignano')) return tripPhotos.polignano
  if (day.base.includes('Lecce')) return tripPhotos.lecce
  if (day.base.includes('Matera')) return tripPhotos.matera
  return tripPhotos.naples
}
