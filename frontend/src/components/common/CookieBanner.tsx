import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Cookies from 'js-cookie'
import { Cookie, X, Settings } from 'lucide-react'

const COOKIE_CONSENT_KEY = 'cookie_consent'

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    const consent = Cookies.get(COOKIE_CONSENT_KEY)
    if (!consent) {
      // Pequeño delay para que no aparezca inmediatamente al cargar
      const timer = setTimeout(() => setIsVisible(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAcceptAll = () => {
    Cookies.set(COOKIE_CONSENT_KEY, 'all', {
      expires: 365,
      sameSite: 'strict',
      secure: window.location.protocol === 'https:',
    })
    setIsVisible(false)
  }

  const handleEssentialOnly = () => {
    Cookies.set(COOKIE_CONSENT_KEY, 'essential', {
      expires: 365,
      sameSite: 'strict',
      secure: window.location.protocol === 'https:',
    })
    setIsVisible(false)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 
                     md:max-w-lg z-50"
          role="dialog"
          aria-label="Aviso de cookies"
          aria-modal="false"
        >
          <div className="bg-dark text-white rounded-3xl p-6 shadow-2xl border border-white/10">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <Cookie className="w-5 h-5 text-warning flex-shrink-0" />
                <h3 className="font-display font-bold text-lg">Cookies</h3>
              </div>
              <button
                onClick={handleEssentialOnly}
                className="text-white/60 hover:text-white transition-colors flex-shrink-0"
                aria-label="Cerrar y usar solo cookies esenciales"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-white/80 text-sm leading-relaxed mb-4">
              Usamos cookies para mejorar tu experiencia y guardar el progreso de tus formularios.
              Al continuar, aceptas nuestra{' '}
              <a href="/privacidad" className="text-primary-300 underline hover:text-primary-200">
                política de datos personales
              </a>{' '}
              conforme a la Ley 1581 de 2012.
            </p>

            {showDetails && (
              <div className="mb-4 space-y-2 text-sm text-white/70">
                <div className="flex justify-between items-center">
                  <span>🔒 Cookies esenciales (sesión, seguridad)</span>
                  <span className="text-accent font-bold text-xs">Siempre activas</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>📋 Cookies de formulario (guardar borrador)</span>
                  <span className="text-warning text-xs">Opcionales</span>
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleAcceptAll}
                className="flex-1 bg-primary hover:bg-primary-600 text-white font-display 
                           font-bold py-2.5 px-4 rounded-xl text-sm transition-colors"
              >
                Aceptar todas
              </button>
              <button
                onClick={handleEssentialOnly}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white font-display 
                           font-bold py-2.5 px-4 rounded-xl text-sm transition-colors"
              >
                Solo esenciales
              </button>
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center gap-1 text-white/60 hover:text-white 
                           text-sm transition-colors px-2"
                aria-label="Configurar cookies"
              >
                <Settings className="w-4 h-4" />
                <span>Configurar</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
