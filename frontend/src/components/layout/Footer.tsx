import { Link } from 'react-router-dom'
import { Facebook, Instagram, Youtube, Mail, Heart } from 'lucide-react'

const currentYear = new Date().getFullYear()

const footerLinks = {
  plataforma: [
    { to: '/juegos', label: 'Juegos' },
    { to: '/videos', label: 'Videos' },
    { to: '/articulos', label: 'Artículos' },
    { to: '/docente', label: 'La Docente' },
    { to: '/precios', label: 'Precios' },
  ],
  legal: [
    { to: '/privacidad', label: 'Política de Datos Personales' },
    { to: '/terminos', label: 'Términos y Condiciones' },
    { to: '/contacto', label: 'Contáctenos' },
  ],
}

const socialLinks = [
  { href: '#', label: 'Facebook', icon: <Facebook className="w-5 h-5" /> },
  { href: '#', label: 'Instagram', icon: <Instagram className="w-5 h-5" /> },
  { href: '#', label: 'YouTube', icon: <Youtube className="w-5 h-5" /> },
  { href: 'mailto:contacto@juegoseducativos.com', label: 'Correo', icon: <Mail className="w-5 h-5" /> },
]

export default function Footer() {
  return (
    <footer className="bg-dark text-white" aria-label="Pie de página">
      <div className="container-main py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Marca */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 font-display font-black text-xl text-white mb-4">
              <span className="text-2xl" aria-hidden="true">🎮</span>
              Aprendiendo y explorando
            </Link>
            <p className="text-white/70 text-sm leading-relaxed max-w-xs">
              Plataforma educativa con juegos interactivos para niños. Aprende jugando con
              contenido diseñado por docentes especializados.
            </p>
            <div className="flex items-center gap-3 mt-5">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  aria-label={link.label}
                  className="w-10 h-10 rounded-xl bg-white/10 hover:bg-primary flex items-center justify-center
                             transition-all duration-200 hover:-translate-y-0.5"
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links plataforma */}
          <div>
            <h3 className="font-display font-bold text-sm uppercase tracking-wider text-white/50 mb-4">
              Plataforma
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.plataforma.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-white/70 hover:text-white text-sm transition-colors
                               font-body hover:translate-x-1 inline-block transition-transform duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links legales */}
          <div>
            <h3 className="font-display font-bold text-sm uppercase tracking-wider text-white/50 mb-4">
              Legal
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.legal.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-white/70 hover:text-white text-sm transition-colors
                               font-body hover:translate-x-1 inline-block transition-transform duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-5 p-3 bg-white/5 rounded-xl border border-white/10">
              <p className="text-white/50 text-xs leading-relaxed">
                🇨🇴 Protección de datos conforme a la{' '}
                <Link to="/privacidad" className="text-primary-300 hover:text-primary-200 underline">
                  Ley 1581 de 2012
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row 
                        items-center justify-between gap-4">
          <p className="text-white/50 text-sm">
            © {currentYear} Aprendiendo y explorando. Todos los derechos reservados.
          </p>
          <p className="text-white/50 text-sm flex items-center gap-1">
            Hecho con <Heart className="w-3.5 h-3.5 text-secondary fill-secondary" aria-hidden="true" /> en Colombia
            <span className="mx-1" aria-hidden="true">·</span>
            Desarrollado por{' '}
            <a
              href="https://ate-technology.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-300 hover:text-primary-200 underline"
            >
              ATE Technology
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
