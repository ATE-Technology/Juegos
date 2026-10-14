import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Mail, MessageSquare, Send, CheckCircle, Phone, MapPin, Facebook, Instagram, Youtube } from 'lucide-react'
import { contactService } from '../../services/contactService'
import { useCookieForm } from '../../hooks/useCookieForm'
import { contactSchema, type ContactFormValues } from '../../utils/validators'

export default function Contact() {
  const [sent, setSent] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const { register, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitting } } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  })

  const { saveDraft, clearDraft } = useCookieForm(
    'contact_draft',
    { name: '', email: '', subject: '', message: '' } as Record<string, unknown>,
    setValue as (name: string, value: unknown) => void
  )

  const handleChange = () => {
    const values = watch()
    saveDraft({ name: values.name, email: values.email, subject: values.subject })
  }

  const onSubmit = async (data: ContactFormValues) => {
    setServerError(null)
    try {
      await contactService.sendMessage(data)
      clearDraft()
      setSent(true)
      reset()
    } catch {
      setServerError('Error al enviar el mensaje. Por favor, inténtalo de nuevo.')
    }
  }

  return (
    <div className="py-12">
      <div className="container-main">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary-50 text-primary px-4 py-2 
                          rounded-full text-sm font-display font-bold mb-4">
            <Mail className="w-4 h-4" /> Contáctenos
          </div>
          <h1 className="section-title mb-3">¿Cómo podemos ayudarte?</h1>
          <p className="section-subtitle mx-auto">
            Escríbenos con tus preguntas, sugerencias o comentarios.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Formulario */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3"
          >
            <div className="bg-white rounded-3xl shadow-card p-8">
              {sent ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
                  <CheckCircle className="w-20 h-20 text-accent mx-auto mb-4" />
                  <h2 className="text-2xl font-display font-black text-dark mb-3">¡Mensaje enviado!</h2>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    Gracias por escribirnos. Te responderemos en un plazo de 24–48 horas hábiles.
                  </p>
                  <button onClick={() => setSent(false)} className="btn-outline">
                    Enviar otro mensaje
                  </button>
                </motion.div>
              ) : (
                <>
                  <h2 className="text-xl font-display font-black text-dark mb-6 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-primary" />
                    Envíanos un mensaje
                  </h2>

                  {serverError && (
                    <div role="alert" className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 mb-6 text-sm">
                      {serverError}
                    </div>
                  )}

                  <form onSubmit={handleSubmit(onSubmit)} onChange={handleChange} noValidate className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="contact-name" className="label">Nombre</label>
                        <input
                          id="contact-name"
                          type="text"
                          autoComplete="name"
                          className={`input-field ${errors.name ? 'border-red-400' : ''}`}
                          placeholder="Tu nombre completo"
                          {...register('name')}
                          aria-invalid={!!errors.name}
                        />
                        {errors.name && <p role="alert" className="text-red-500 text-xs mt-1.5">{errors.name.message}</p>}
                      </div>
                      <div>
                        <label htmlFor="contact-email" className="label">Correo electrónico</label>
                        <input
                          id="contact-email"
                          type="email"
                          autoComplete="email"
                          className={`input-field ${errors.email ? 'border-red-400' : ''}`}
                          placeholder="tu@correo.com"
                          {...register('email')}
                          aria-invalid={!!errors.email}
                        />
                        {errors.email && <p role="alert" className="text-red-500 text-xs mt-1.5">{errors.email.message}</p>}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="contact-subject" className="label">Asunto</label>
                      <input
                        id="contact-subject"
                        type="text"
                        className={`input-field ${errors.subject ? 'border-red-400' : ''}`}
                        placeholder="¿Sobre qué nos escribes?"
                        {...register('subject')}
                        aria-invalid={!!errors.subject}
                      />
                      {errors.subject && <p role="alert" className="text-red-500 text-xs mt-1.5">{errors.subject.message}</p>}
                    </div>

                    <div>
                      <label htmlFor="contact-message" className="label">Mensaje</label>
                      <textarea
                        id="contact-message"
                        rows={5}
                        className={`input-field resize-none ${errors.message ? 'border-red-400' : ''}`}
                        placeholder="Escribe tu mensaje aquí... (mínimo 20 caracteres)"
                        {...register('message')}
                        aria-invalid={!!errors.message}
                      />
                      {errors.message && <p role="alert" className="text-red-500 text-xs mt-1.5">{errors.message.message}</p>}
                    </div>

                    <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-3.5">
                      {isSubmitting
                        ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        : <Send className="w-5 h-5" />
                      }
                      {isSubmitting ? 'Enviando...' : 'Enviar mensaje'}
                    </button>
                  </form>
                </>
              )}
            </div>
          </motion.div>

          {/* Info de contacto */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="bg-white rounded-3xl shadow-card p-6">
              <h2 className="text-xl font-display font-black text-dark mb-5">Información de contacto</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-primary" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-display font-bold text-dark text-sm">Correo electrónico</p>
                    <a href="mailto:explorandoyaprendiendo.bog@gmail.com" className="text-primary text-sm hover:underline">
                      explorandoyaprendiendo.bog@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-secondary" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-display font-bold text-dark text-sm">WhatsApp</p>
                    <a href="https://wa.me/573134017532" target="_blank" rel="noopener noreferrer" className="text-secondary text-sm hover:underline">
                      +57 313 401 7532
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-accent" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-display font-bold text-dark text-sm">Ubicación</p>
                    <p className="text-gray-600 text-sm">Colombia</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Redes sociales */}
            <div className="bg-gradient-to-br from-primary-50 to-secondary/10 rounded-3xl p-6 border border-primary-100">
              <h3 className="font-display font-black text-dark text-lg mb-4">Síguenos en redes</h3>
              <div className="space-y-3">
                {[
                  { href: '#', icon: <Facebook className="w-5 h-5" />, label: 'Facebook', color: 'bg-blue-500' },
                  { href: '#', icon: <Instagram className="w-5 h-5" />, label: 'Instagram', color: 'bg-pink-500' },
                  { href: '#', icon: <Youtube className="w-5 h-5" />, label: 'YouTube', color: 'bg-red-500' },
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-white rounded-xl hover:shadow-sm transition-all hover:-translate-y-0.5"
                    aria-label={`Seguir en ${social.label}`}
                  >
                    <div className={`w-8 h-8 ${social.color} text-white rounded-lg flex items-center justify-center`} aria-hidden="true">
                      {social.icon}
                    </div>
                    <span className="font-display font-semibold text-dark text-sm">{social.label}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Horario */}
            <div className="bg-white rounded-3xl shadow-card p-6">
              <h3 className="font-display font-black text-dark text-lg mb-3">Tiempo de respuesta</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Respondemos todos los mensajes en un plazo de <strong>24 a 48 horas hábiles</strong>.
                Para consultas urgentes, escríbenos por WhatsApp.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
