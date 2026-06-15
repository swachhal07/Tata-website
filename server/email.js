import nodemailer from 'nodemailer'

/* Shared branded email renderers (used by /api/send-mail). */

const SANS  = "'Helvetica Neue', Helvetica, Arial, sans-serif"
const SERIF = "Georgia, 'Times New Roman', Times, serif"
const MONO  = "ui-monospace, Consolas, 'Courier New', monospace"

const C = {
  brand: '#f37022',
  brandDeep: '#a4360c',
  pillBg: '#fdecdf',
  paper: '#f7f5f0',
  card: '#ffffff',
  ink: '#0e0d0b',
  body: '#1c1a17',
  sub: '#5d574c',
  caption: '#908a7c',
  border: '#eae4d4',
  cream: '#fdf5ec',
  darkMute: '#b8b2a3',
}

export const escapeHtml = (s = '') =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

function detailRow(label, value, last = false) {
  if (!value) return ''
  const b = last ? '' : `border-bottom:1px solid ${C.border};`
  return `<tr><td width="120" valign="top" style="${b}padding:16px 18px 16px 0;font:700 10px/1.4 ${MONO};color:${C.caption};letter-spacing:0.26em;text-transform:uppercase;white-space:nowrap;">${escapeHtml(label)}</td><td valign="top" style="${b}padding:16px 0;font:500 15px/1.55 ${SANS};color:${C.body};word-break:break-word;">${escapeHtml(value)}</td></tr>`
}

function pillRow(label, value, last = false) {
  if (!value) return ''
  const b = last ? '' : `border-bottom:1px solid ${C.border};`
  return `<tr><td width="120" valign="top" style="${b}padding:16px 18px 16px 0;font:700 10px/1.4 ${MONO};color:${C.caption};letter-spacing:0.26em;text-transform:uppercase;white-space:nowrap;">${escapeHtml(label)}</td><td valign="top" style="${b}padding:14px 0;"><span style="display:inline-block;border:1px solid ${C.brand};background-color:${C.pillBg};padding:6px 11px 5px;font:700 11px/1 ${MONO};color:${C.brandDeep};letter-spacing:0.18em;text-transform:uppercase;">${escapeHtml(value)}</span></td></tr>`
}

function messageBlock(message) {
  if (!message) return ''
  return `<tr><td colspan="2" style="padding:18px 0 0 0;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-top:1px dashed ${C.border};padding:18px 0 12px 0;"><p style="margin:0;font:700 10px/1.4 ${MONO};color:${C.caption};letter-spacing:0.26em;text-transform:uppercase;">In their words</p></td></tr><tr><td><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td width="4" valign="top" style="width:4px;background-color:${C.brand};line-height:0;font-size:0;">&nbsp;</td><td valign="top" style="background-color:${C.cream};padding:20px 24px;"><p style="margin:0;font:400 italic 17px/1.55 ${SERIF};color:${C.body};">&ldquo;${escapeHtml(message)}&rdquo;</p></td></tr></table></td></tr></table></td></tr>`
}

function shell({ preheader, caption, headTop, headItalic, intro, sectionLabel, bodyHtml, badgeHtml = '' }) {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml" lang="en"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="x-apple-disable-message-reformatting"><title>${escapeHtml(caption.replace(/^\/\s*/, ''))}</title></head><body style="margin:0;padding:0;background-color:${C.paper};"><div style="display:none;font-size:1px;color:${C.paper};line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${escapeHtml(preheader)}</div><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${C.paper};"><tr><td align="center" style="padding:44px 16px 52px 16px;"><table role="presentation" width="620" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:620px;"><tr><td align="center" style="padding-bottom:14px;"><p style="margin:0;font:700 10px/1.4 ${MONO};color:${C.caption};letter-spacing:0.32em;text-transform:uppercase;">Tata Hitachi &middot; Dugar Earthmovers &middot; Nepal</p></td></tr></table><table role="presentation" width="620" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:620px;background-color:${C.card};border:1px solid ${C.border};"><tr><td style="padding:0;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td width="6" valign="top" style="width:6px;background-color:${C.brand};line-height:0;font-size:0;">&nbsp;</td><td valign="top" style="padding:42px 32px 32px 26px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td valign="top"><p style="margin:0;font:700 10px/1.4 ${MONO};color:${C.brand};letter-spacing:0.32em;text-transform:uppercase;">${caption}</p></td>${badgeHtml ? `<td align="right" valign="top">${badgeHtml}</td>` : ''}</tr></table><h1 style="margin:18px 0 0 0;font:900 34px/0.98 ${SANS};color:${C.ink};letter-spacing:-0.028em;text-transform:uppercase;">${headTop}<br><span style="font:400 italic 33px/1 ${SERIF};color:${C.brand};text-transform:none;letter-spacing:-0.005em;">${headItalic}</span></h1>${intro ? `<p style="margin:22px 0 0 0;font:400 14px/1.65 ${SANS};color:${C.sub};max-width:470px;">${intro}</p>` : ''}</td></tr></table></td></tr><tr><td style="padding:14px 30px 0 30px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-top:2px solid ${C.ink};padding:10px 0 0 0;"><p style="margin:0;font:700 10px/1.4 ${MONO};color:${C.ink};letter-spacing:0.32em;text-transform:uppercase;">${sectionLabel}</p></td></tr></table></td></tr><tr><td style="padding:0 30px 30px 30px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">${bodyHtml}</table></td></tr><tr><td style="background-color:${C.ink};padding:22px 30px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td valign="middle" style="vertical-align:middle;"><p style="margin:0;font:700 10px/1.4 ${MONO};color:${C.brand};letter-spacing:0.32em;text-transform:uppercase;">/ Dugar Earthmovers</p><p style="margin:6px 0 0 0;font:500 12px/1.5 ${SANS};color:${C.darkMute};">Authorised Tata Hitachi distributor &middot; Est. 1995 &middot; Kathmandu</p></td><td align="right" valign="middle" style="vertical-align:middle;"><p style="margin:0;font:900 14px/1 ${SANS};color:#ffffff;letter-spacing:0.04em;text-transform:uppercase;">Tata <span style="color:${C.brand};">Hitachi</span></p></td></tr></table></td></tr></table><table role="presentation" width="620" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:620px;"><tr><td align="center" style="padding:18px 0 0 0;"><p style="margin:0;font:600 10px/1.4 ${MONO};color:${C.caption};letter-spacing:0.32em;text-transform:uppercase;">Auto-generated &middot; Reply goes to the sender</p></td></tr></table></td></tr></table></body></html>`
}

export function renderContact(b) {
  const rows =
    detailRow('Name', b.name) +
    detailRow('Company', b.company) +
    detailRow('Phone', b.phone) +
    detailRow('Email', b.email) +
    pillRow('Interest', b.interest, !b.message) +
    messageBlock(b.message)

  return shell({
    preheader: `${b.name || 'A contractor'} just sent an enquiry from the website.`,
    caption: '/ New contact enquiry',
    headTop: 'A buyer just',
    headItalic: 'reached out.',
    intro: 'Reply within four working hours &mdash; that&rsquo;s the promise on the website. Phone first if the project sounds urgent.',
    sectionLabel: 'Lead detail',
    bodyHtml: rows,
  })
}

export function renderBrochure(b) {
  const product = escapeHtml(b.product || 'Machine')
  const code = escapeHtml(b.code || 'MODEL')

  const badge = `<span style="display:inline-block;border:1px solid ${C.ink};background-color:#ffffff;padding:8px 13px 7px;font:700 10px/1 ${MONO};color:${C.ink};letter-spacing:0.22em;text-transform:uppercase;">${code}</span>`

  const rows =
    detailRow('Name', b.name) +
    detailRow('Phone', b.phone) +
    detailRow('Company', b.company) +
    detailRow('Location', b.location, true)

  return shell({
    preheader: `${b.name || 'A contractor'} downloaded the ${b.product || 'brochure'} brochure.`,
    caption: '/ Brochure download',
    headTop: product,
    headItalic: 'lead captured.',
    intro: `Someone just pulled the ${product} brochure from the catalogue. The interest is hot &mdash; phone or email them today.`,
    sectionLabel: 'Requester',
    bodyHtml: rows,
    badgeHtml: badge,
  })
}

export function buildTransporter() {
  const { SMTP_USER, SMTP_PASS } = process.env
  if (!SMTP_USER || !SMTP_PASS) return null
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  })
}
