import boardMotiLal from '../assets/af0b8ecf-4ddc-41f9-9dd1-ba5c0df1b212.webp'
import boardVivek from '../assets/ae68fbad-4028-45aa-81d5-44d526f4f5af.webp'
import boardShubham from '../assets/af5ea000-e8c5-4f03-ac64-9fd3a8bb8009.webp'
import boardNaman from '../assets/eb7eb529-8d15-4359-8ac0-df51b7393d00.webp'
import mgmtNiraj from '../assets/_MG_7984.jpg.jpeg'
import mgmtDipu from '../assets/IMG_5717.JPG.jpeg'

/* Portraits that ship with the build. The seeded roster has no uploaded
 * photo, so the Leadership page falls back to these by id until someone
 * uploads a replacement from the admin console. */
export const bundledPhotos = {
  'board-moti-lal': boardMotiLal,
  'board-vivek': boardVivek,
  'board-shubham': boardShubham,
  'board-naman': boardNaman,
  'mgmt-niraj': mgmtNiraj,
  'mgmt-dipu': mgmtDipu,
}

/* Fallback roster, used only when `GET /api/people` fails. Keep in sync
 * with backend/data/people.json - that file seeds the database. */
export const seedPeople = [
  { id: 'board-moti-lal', kind: 'board', name: 'Moti Lal Dugar', role: 'Chairman', photo: null, order: 0 },
  { id: 'board-vivek', kind: 'board', name: 'Vivek Dugar', role: 'Vice Chairman', photo: null, order: 1 },
  { id: 'board-shubham', kind: 'board', name: 'Shubham Dugar', role: 'Director', photo: null, order: 2 },
  { id: 'board-naman', kind: 'board', name: 'Naman Dugar', role: 'Director', photo: null, order: 3 },
  { id: 'mgmt-niraj', kind: 'management', name: 'Niraj Sapkota', role: 'Business Head', photo: null, order: 4 },
  { id: 'mgmt-dipu', kind: 'management', name: 'Dipu Kumar Singh', role: 'Head of After Sales', photo: null, order: 5 },
]

/** Resolve the portrait to render: uploaded first, bundled second. */
export function photoFor(person) {
  return person?.photo || bundledPhotos[person?.id] || null
}
