/* Per-machine narrative. The catalogue data carries specs and a one-line
 * intro; these sentences give each page enough substance to stand on its own
 * in search results instead of reading as a spec dump. Keyed by model code so
 * an admin-added machine simply falls back to the generic copy.
 *
 * Kept in its own asset-import-free module so `scripts/prerender.mjs` can
 * import it under plain Node — the prerendered HTML and the React page must
 * say the same thing, and duplicating the copy would let them drift.
 */

export const NOTES = {
  'ZAXIS-650H':
    'The ZAXIS 650 H is the largest machine we place in Nepal, and it goes almost exclusively to mining contracts, major hydropower cut-and-fill, and quarry operators running continuous duty cycles. At 58.3 tonnes with 400 HP on tap, it is specified where a 30-tonne class machine would simply take too long. Bring us the cycle times you need and we will tell you honestly whether this is the right machine or whether two smaller ones will move more material per rupee.',
  'ZAXIS-370LCH':
    'Built for the pit. The 370 LCH Ultra carries a reinforced structure and duty-cycle hydraulics rated for continuous extraction, which is what separates it from a general-purpose machine of similar weight. Most of the units we have delivered are working limestone and aggregate in the Terai, where the combination of abrasive material and long shifts kills undercarriages on machines not built for it.',
  'ZAXIS-220LC':
    'The most-deployed Tata Hitachi machine on infrastructure contracts across Nepal, and the one we stock the deepest parts inventory for. The long-crawler undercarriage is the reason — it holds position on the uneven, freshly-cut ground that road and hydropower work constantly produces. If you are buying your first machine in the 20-tonne class, this is the safe answer.',
  'ZAXIS-140H':
    'The versatile mid-class machine. Narrow enough to work a road alignment without closing both lanes, capable enough to handle site development and utility trenching without a second machine on hire. Popular with contractors who need one excavator to cover a broad range of jobs.',
  'EX-350-LCPRIME':
    'A heavy-class machine for major earthworks where reach matters as much as breakout force. The LC Prime undercarriage gives it stability on rough ground without shortening the working envelope, which is why it turns up on hydropower access roads and large-fill contracts.',
  'EX-215':
    'The 22-tonne infrastructure workhorse. Balanced reach, sensible fuel burn, and an undercarriage rated for the daily punishment of road and site work. This is the machine contractors buy when the job is not exotic — it just has to run, every day, for years.',
  'EX-210-LCPRIME':
    'The Prime series answer in the 20-tonne class. Reinforced boom and stick, sharper hydraulic response than the standard series, and the LC Prime undercarriage. Specified where a contractor is running long hours and wants the structure to outlast the finance term.',
  'EX-130':
    'A 13-tonne machine that earns its place through reliability rather than headline numbers. Fuel-efficient, simple to maintain, and well matched to the everyday earthworks, drainage and utility work that makes up the bulk of contracts in Nepal.',
  'EX-70-SUPER':
    'The compact specialist. Narrow enough for urban trenching and confined municipal sites, with enough breakout to outwork most machines in its weight class. Frequently the second machine on a fleet, handling the work a 20-tonne excavator cannot reach.',
  'SHINRAI-POWER':
    'Built narrow deliberately, for Nepali urban sites where a full-size backhoe cannot turn. The Shinrai Power is the workhorse for municipal contracts, drainage schemes and utility infrastructure — loader on the front, backhoe on the rear, and the manoeuvrability to use both on a live street.',
}

export const GENERIC_NOTE =
  'Supplied, commissioned and serviced by Dugar Earthmovers, the authorised Tata Hitachi distributor for Nepal. Every machine handover includes structured operator training, and our factory-trained technicians can be on a project site within 24 hours from any of our ten branches.'

/** The narrative for a machine, falling back to the generic distributor copy. */
export function noteFor(product) {
  return NOTES[product?.code] || GENERIC_NOTE
}
