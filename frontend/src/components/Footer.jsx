import { Link } from 'react-router-dom'
import logo from '../assets/Tata Hitachi Logo.jpg'

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
      <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
      <path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57-.35-.11-.74-.03-1.02.24l-2.2 2.2a15.05 15.05 0 0 1-6.59-6.59l2.2-2.2c.27-.27.36-.66.24-1.02A11.36 11.36 0 0 1 8.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1z" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
      <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
    </svg>
  )
}

export default function Footer() {
  return (
    <footer className="bg-black text-gray-400">
      <div className="mx-auto max-w-7xl px-6 pt-20 pb-12">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          {/* Brand column */}
          <div>
            <Link to="/" className="mb-5 inline-flex h-6 items-center overflow-hidden">
              <img
                src={logo}
                alt="Tata Hitachi Construction Machinery"
                className="h-10 w-auto max-w-none"
                style={{ filter: 'invert(1) grayscale(1) brightness(2) contrast(1.2)' }}
              />
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-gray-400">
              Authorised Tata Hitachi distributor in Nepal — serving contractors,
              fleet owners, and operators with construction and mining equipment,
              certified service, and genuine spare parts.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-5 text-xs font-bold uppercase tracking-[0.25em] text-white">
              Quick Links
            </h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/" className="transition-colors hover:text-[#f37022]">Home</Link></li>
              <li><Link to="/products" className="transition-colors hover:text-[#f37022]">Products</Link></li>
              <li><Link to="/about" className="transition-colors hover:text-[#f37022]">About Us</Link></li>
              <li><Link to="/contact" className="transition-colors hover:text-[#f37022]">Contact Us</Link></li>
            </ul>
          </div>

          {/* Equipment */}
          <div>
            <h4 className="mb-5 text-xs font-bold uppercase tracking-[0.25em] text-white">
              Equipment
            </h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/products#excavators" className="transition-colors hover:text-[#f37022]">Excavators</Link></li>
              <li><Link to="/products#backhoes" className="transition-colors hover:text-[#f37022]">Backhoe Loaders</Link></li>
              <li><Link to="/products#mining" className="transition-colors hover:text-[#f37022]">Mining Equipment</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-5 text-xs font-bold uppercase tracking-[0.25em] text-white">
              Contact
            </h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 text-[#f37022]"><PinIcon /></span>
                <span>Kathmandu, Nepal</span>
              </li>
              <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="text-[#f37022]"><PhoneIcon /></span>
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-500">Sales</span>
                <span>
                  +977{' '}
                  <a href="tel:+9779801007228" className="transition-colors hover:text-[#f37022]">9801007228</a>
                  {' / '}
                  <a href="tel:+9779712010558" className="transition-colors hover:text-[#f37022]">9712010558</a>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 text-[#f37022]"><MailIcon /></span>
                <a
                  href="mailto:sales.tatahitachinp@gmail.com"
                  className="break-all transition-colors hover:text-[#f37022]"
                >
                  sales.tatahitachinp@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-5 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Dugar Earthmovers P. Ltd — Authorised Tata Hitachi distributor in Nepal. All rights reserved.
          </p>
          <p className="font-mono text-[10px] font-bold uppercase tabular-nums tracking-[0.25em] text-gray-500">
            <span className="font-serif text-xs normal-case text-gray-500">Developed by</span>
            <span className="mx-2 text-[#f37022]">·</span>
            <a
              href="https://swachhalportfolio.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-[#f37022]"
            >
              Swachhal Lamsal
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
