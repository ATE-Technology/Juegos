import { motion } from 'framer-motion'
import { FileText } from 'lucide-react'

export default function Terms() {
  return (
    <div className="py-12">
      <div className="container-main max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="bg-dark rounded-3xl p-8 text-white mb-10">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-8 h-8" />
              <h1 className="text-3xl md:text-4xl font-display font-black">Términos y Condiciones</h1>
            </div>
            <p className="text-white/70">Última actualización: 4 de agosto de 2026</p>
          </div>

          <div className="bg-white rounded-3xl shadow-card p-8 space-y-8 font-body text-gray-700 leading-relaxed">

            <section>
              <h2 className="text-2xl font-display font-black text-dark mb-4">1. Aceptación de los términos</h2>
              <p>
                Al acceder y usar la plataforma Aprendiendo y explorando, aceptas estos Términos y Condiciones.
                Si no estás de acuerdo, no podrás usar la plataforma. Los padres o tutores deben aceptar
                estos términos en nombre de los menores de edad.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-display font-black text-dark mb-4">2. Descripción del servicio</h2>
              <p>
                Aprendiendo y explorando es una plataforma web que ofrece juegos educativos interactivos, videos
                y artículos pedagógicos en modalidad freemium. El acceso gratuito incluye demos y contenido
                seleccionado; el acceso premium requiere suscripción paga.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-display font-black text-dark mb-4">3. Cuentas de usuario</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Debes proporcionar información veraz y actualizada al registrarte.</li>
                <li>Eres responsable de mantener la seguridad de tu contraseña.</li>
                <li>Una cuenta es para uso personal e intransferible.</li>
                <li>Nos reservamos el derecho de suspender cuentas que violen estos términos.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-display font-black text-dark mb-4">4. Suscripción premium</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>La suscripción se activa manualmente tras la confirmación del pago.</li>
                <li>Los precios están expresados en pesos colombianos (COP) e incluyen IVA cuando aplique.</li>
                <li>No se realizan devoluciones de períodos ya iniciados, salvo falla técnica imputable a la plataforma.</li>
                <li>La suscripción no se renueva automáticamente; debes solicitar la renovación.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-display font-black text-dark mb-4">5. Propiedad intelectual</h2>
              <p>
                Todo el contenido de la plataforma (juegos, videos, artículos, diseño, marca) es propiedad
                de Aprendiendo y explorando o sus licenciantes y está protegido por la legislación colombiana de
                propiedad intelectual (Ley 23 de 1982, Decisión Andina 351 de 1993).
              </p>
              <p className="mt-3">
                Queda prohibida la reproducción, distribución, modificación o uso comercial del contenido
                sin autorización expresa por escrito.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-display font-black text-dark mb-4">6. Uso aceptable</h2>
              <p className="mb-3">Está prohibido:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Compartir credenciales de acceso con terceros.</li>
                <li>Intentar acceder a contenido premium sin suscripción válida.</li>
                <li>Usar la plataforma para actividades ilegales o que vulneren derechos de terceros.</li>
                <li>Publicar contenido ofensivo, discriminatorio o inapropiado.</li>
                <li>Realizar ingeniería inversa sobre los juegos o el software de la plataforma.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-display font-black text-dark mb-4">7. Limitación de responsabilidad</h2>
              <p>
                La plataforma se ofrece "tal como está". No garantizamos disponibilidad ininterrumpida.
                No somos responsables de daños indirectos derivados del uso o imposibilidad de uso
                de la plataforma.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-display font-black text-dark mb-4">8. Ley aplicable y jurisdicción</h2>
              <p>
                Estos términos se rigen por la legislación colombiana. Cualquier controversia se someterá
                a la jurisdicción de los tribunales competentes de Colombia, sin perjuicio de los mecanismos
                de resolución alternativa de conflictos previstos en la ley.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-display font-black text-dark mb-4">9. Modificaciones</h2>
              <p>
                Nos reservamos el derecho de modificar estos términos. Los cambios sustanciales serán
                notificados por correo electrónico con al menos 15 días de anticipación. El uso
                continuado de la plataforma tras los cambios implica la aceptación de los nuevos términos.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-display font-black text-dark mb-4">10. Contacto</h2>
              <p>
                Para consultas sobre estos términos:{' '}
                <a href="mailto:contacto@juegoseducativos.com" className="text-primary font-bold hover:underline">
                  contacto@juegoseducativos.com
                </a>
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
