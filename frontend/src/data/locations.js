/* Branch network fallback.
 *
 * The live list is served by the backend (`GET /api/locations`) and is
 * managed from the admin console at /admin/locations. This copy is only
 * used when that request fails, so the Contact page never renders an
 * empty network. Keep it in sync with backend/data/locations.json - that
 * file is what seeds the database on first boot.
 */
export const seedLocations = [
  { id: 'svc-jeetpur',    kind: 'service', city: 'Jeetpur',    label: 'Service & Parts', contact: 'Sahzad Ansari',   phone: '9802919537', lat: 27.2167, lng: 84.9667, mapUrl: 'https://www.google.com/maps?q=27.2167,84.9667', labelOffset: 'down',  showOnMap: true, order: 0 },
  { id: 'svc-biratnagar', kind: 'service', city: 'Biratnagar', label: 'Service & Parts', contact: 'Jakir Hussain',   phone: '9801558692', lat: 26.4525, lng: 87.2718, mapUrl: 'https://www.google.com/maps?q=26.4525,87.2718', labelOffset: 'right', showOnMap: true, order: 1 },
  { id: 'svc-bardibaas',  kind: 'service', city: 'Bardibaas',  label: 'Service',         contact: 'Jakir Hussain',   phone: '9801558692', lat: 26.9833, lng: 85.9000, mapUrl: 'https://www.google.com/maps?q=26.9833,85.9000', labelOffset: 'down',  showOnMap: true, order: 2 },
  { id: 'svc-kathmandu',  kind: 'service', city: 'Kathmandu',  label: 'Service & Parts', contact: 'Rupesh Mahato',   phone: '9800018809', lat: 27.7172, lng: 85.3240, mapUrl: 'https://www.google.com/maps?q=27.7172,85.3240', labelOffset: 'up',    showOnMap: true, order: 3 },
  { id: 'svc-nepalgunj',  kind: 'service', city: 'Nepalgunj',  label: 'Service & Parts', contact: 'Rahul Kumar Jha', phone: '9802573217', lat: 28.0500, lng: 81.6167, mapUrl: 'https://www.google.com/maps?q=28.0500,81.6167', labelOffset: 'left',  showOnMap: true, order: 4 },
  { id: 'svc-dhangadi',   kind: 'service', city: 'Dhangadi',   label: 'Service',         contact: 'Rahul Kumar Jha', phone: '9802573217', lat: 28.6953, lng: 80.5898, mapUrl: 'https://www.google.com/maps?q=28.6953,80.5898', labelOffset: 'down',  showOnMap: true, order: 5 },
  { id: 'svc-surkhet',    kind: 'service', city: 'Surkhet',    label: 'Service',         contact: 'Rahul Kumar Jha', phone: '9802573217', lat: 28.6000, lng: 81.6333, mapUrl: 'https://www.google.com/maps?q=28.6000,81.6333', labelOffset: 'up',    showOnMap: true, order: 6 },
  { id: 'svc-dang',       kind: 'service', city: 'Dang',       label: 'Service',         contact: 'Rahul Kumar Jha', phone: '9802573217', lat: 28.0333, lng: 82.4833, mapUrl: 'https://www.google.com/maps?q=28.0333,82.4833', labelOffset: 'down',  showOnMap: true, order: 7 },
  { id: 'svc-pokhara',    kind: 'service', city: 'Pokhara',    label: 'Service & Parts', contact: 'Dipendra Paudel', phone: '9802773245', lat: 28.2096, lng: 83.9856, mapUrl: 'https://www.google.com/maps?q=28.2096,83.9856', labelOffset: 'up',    showOnMap: true, order: 8 },
  { id: 'svc-butwal',     kind: 'service', city: 'Butwal',     label: 'Service',         contact: 'Dipendra Paudel', phone: '9802773245', lat: 27.7000, lng: 83.4486, mapUrl: 'https://www.google.com/maps?q=27.7000,83.4486', labelOffset: 'down',  showOnMap: true, order: 9 },

  { id: 'sal-biratnagar-jagarnath', kind: 'sales', city: 'Biratnagar', label: 'Sales', contact: 'Jagarnath Sah',   phone: '9801500928', lat: 26.4525, lng: 87.2718, mapUrl: 'https://www.google.com/maps?q=26.4525,87.2718', labelOffset: 'right', showOnMap: false, order: 10 },
  { id: 'sal-birgunj-binod',        kind: 'sales', city: 'Birgunj',    label: 'Sales', contact: 'Binod Manandhar', phone: '9705475443', lat: 27.0104, lng: 84.8770, mapUrl: 'https://www.google.com/maps?q=27.0104,84.8770', labelOffset: 'down',  showOnMap: false, order: 11 },
  { id: 'sal-birgunj-bikendra',     kind: 'sales', city: 'Birgunj',    label: 'Sales', contact: 'Bikendra Subedi', phone: '9802058089', lat: 27.0104, lng: 84.8770, mapUrl: 'https://www.google.com/maps?q=27.0104,84.8770', labelOffset: 'down',  showOnMap: false, order: 12 },
  { id: 'sal-pokhara-amrit',        kind: 'sales', city: 'Pokhara',    label: 'Sales', contact: 'Amrit Bhujel',    phone: '9802855225', lat: 28.2096, lng: 83.9856, mapUrl: 'https://www.google.com/maps?q=28.2096,83.9856', labelOffset: 'up',    showOnMap: false, order: 13 },
  { id: 'sal-nepalgunj-aman',       kind: 'sales', city: 'Nepalgunj',  label: 'Sales', contact: 'Aman Raj Sidiqi', phone: '9704589586', lat: 28.0500, lng: 81.6167, mapUrl: 'https://www.google.com/maps?q=28.0500,81.6167', labelOffset: 'left',  showOnMap: false, order: 14 },
  { id: 'sal-kathmandu-prem',       kind: 'sales', city: 'Kathmandu',  label: 'Sales', contact: 'Prem Lama',       phone: '9801007228', lat: 27.7172, lng: 85.3240, mapUrl: 'https://www.google.com/maps?q=27.7172,85.3240', labelOffset: 'up',    showOnMap: false, order: 15 },
  { id: 'sal-kathmandu-suman',      kind: 'sales', city: 'Kathmandu',  label: 'Sales', contact: 'Suman Pujari',    phone: '9812010556', lat: 27.7172, lng: 85.3240, mapUrl: 'https://www.google.com/maps?q=27.7172,85.3240', labelOffset: 'up',    showOnMap: false, order: 16 },
]

/** Split a flat location list into the three views the Contact page renders. */
export function splitLocations(list) {
  const all = Array.isArray(list) && list.length ? list : seedLocations
  return {
    salesTeam: all.filter((l) => l.kind === 'sales'),
    offices: all.filter((l) => l.kind === 'service'),
    mapPins: all.filter(
      (l) => l.showOnMap && typeof l.lat === 'number' && typeof l.lng === 'number',
    ),
  }
}
