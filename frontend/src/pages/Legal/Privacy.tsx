import { motion } from 'framer-motion'
import { Shield, Mail } from 'lucide-react'

const lastUpdated = '4 de agosto de 2026'

export default function Privacy() {
  return (
    <div className="py-12">
      <div className="container-main max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div className="bg-gradient-to-br from-primary to-secondary rounded-3xl p-8 text-white mb-10">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-8 h-8" />
              <h1 className="text-3xl md:text-4xl font-display font-black">
                Política de Tratamiento de Datos Personales
              </h1>
            </div>
            <p className="text-white/80">
              Conforme a la Ley 1581 de 2012 y el Decreto 1377 de 2013 — República de Colombia
            </p>
            <p className="text-white/60 text-sm mt-2">Última actualización: {lastUpdated}</p>
          </div>

          {/* Contenido */}
          <div className="bg-white rounded-3xl shadow-card p-8 space-y-8 font-body text-gray-700 leading-relaxed">

            <section aria-labelledby="section-1">
              <h2 id="section-1" className="text-2xl font-display font-black text-dark mb-4">1. Identificación del Responsable del Tratamiento</h2>
              <p>
                El responsable del tratamiento de los datos personales recopilados a través de esta plataforma es
                la docente titular de <strong>Aprendiendo y explorando</strong>, con domicilio en la República de Colombia.
              </p>
              <div className="bg-primary-50 rounded-2xl p-4 mt-4">
                <p className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-primary" />
                  Contacto del responsable: <a href="mailto:contacto@juegoseducativos.com" className="text-primary font-bold">contacto@juegoseducativos.com</a>
                </p>
              </div>
            </section>

            <section aria-labelledby="section-2">
              <h2 id="section-2" className="text-2xl font-display font-black text-dark mb-4">2. Marco Legal</h2>
              <p>Esta política se fundamenta en las siguientes normas colombianas:</p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li><strong>Ley 1581 de 2012</strong> — Régimen General de Protección de Datos Personales</li>
                <li><strong>Decreto 1377 de 2013</strong> — Reglamentación parcial de la Ley 1581 de 2012</li>
                <li><strong>Decreto 1074 de 2015</strong> — Decreto Único Reglamentario del Sector Comercio</li>
                <li><strong>Artículo 15 de la Constitución Política</strong> — Derecho a la intimidad y habeas data</li>
              </ul>
            </section>

            <section aria-labelledby="section-3">
              <h2 id="section-3" className="text-2xl font-display font-black text-dark mb-4">3. Datos Personales Recopilados</h2>
              <p className="mb-3">Recopilamos los siguientes datos personales según el servicio utilizado:</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-primary-50">
                      <th className="text-left p-3 rounded-tl-xl font-display font-bold text-dark">Dato</th>
                      <th className="text-left p-3 font-display font-bold text-dark">Finalidad</th>
                      <th className="text-left p-3 rounded-tr-xl font-display font-bold text-dark">Base Legal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {[
                      ['Nombre completo', 'Identificación del usuario en la plataforma', 'Consentimiento del titular'],
                      ['Correo electrónico', 'Autenticación, comunicaciones y notificaciones', 'Ejecución de contrato'],
                      ['Contraseña (cifrada)', 'Seguridad de la cuenta', 'Ejecución de contrato'],
                      ['Tipo de perfil', 'Personalización de contenido', 'Consentimiento del titular'],
                      ['Dirección IP', 'Seguridad, detección de fraude y registros legales', 'Interés legítimo'],
                      ['Progreso en juegos', 'Seguimiento de aprendizaje', 'Ejecución de contrato'],
                      ['Datos de pago (referencia)', 'Gestión de suscripciones', 'Ejecución de contrato'],
                    ].map(([dato, finalidad, base]) => (
                      <tr key={dato} className="hover:bg-gray-50">
                        <td className="p-3 font-semibold">{dato}</td>
                        <td className="p-3">{finalidad}</td>
                        <td className="p-3 text-primary text-xs font-bold">{base}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-sm bg-yellow-50 p-3 rounded-xl border border-yellow-200">
                ⚠️ <strong>Importante:</strong> No recopilamos datos de tarjetas de crédito ni información bancaria completa. Los pagos se realizan de forma manual y los comprobantes se gestionan externamente.
              </p>
            </section>

            <section aria-labelledby="section-4">
              <h2 id="section-4" className="text-2xl font-display font-black text-dark mb-4">4. Finalidades del Tratamiento</h2>
              <p className="mb-3">Sus datos personales serán utilizados para:</p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Crear y gestionar su cuenta de usuario en la plataforma.</li>
                <li>Prestar los servicios contratados (acceso a juegos, videos y artículos).</li>
                <li>Gestionar el proceso de suscripción y pagos.</li>
                <li>Enviar comunicaciones relacionadas con el servicio (confirmaciones, actualizaciones, nuevos contenidos).</li>
                <li>Personalizar la experiencia de aprendizaje según el perfil del usuario.</li>
                <li>Garantizar la seguridad de la plataforma y prevenir fraudes.</li>
                <li>Cumplir con obligaciones legales y requerimientos de autoridades competentes.</li>
                <li>Mejorar nuestros servicios a través del análisis de uso (datos anonimizados).</li>
              </ol>
            </section>

            <section aria-labelledby="section-5">
              <h2 id="section-5" className="text-2xl font-display font-black text-dark mb-4">5. Derechos de los Titulares</h2>
              <p className="mb-3">Conforme al artículo 8 de la Ley 1581 de 2012, el titular de los datos tiene derecho a:</p>
              <ul className="space-y-3">
                {[
                  ['🔍 Acceso', 'Conocer los datos personales que tenemos sobre usted y la forma en que son tratados.'],
                  ['✏️ Actualización', 'Solicitar la actualización o corrección de sus datos cuando sean incorrectos o incompletos.'],
                  ['🗑️ Supresión', 'Solicitar la eliminación de sus datos cuando no sean necesarios para las finalidades del tratamiento.'],
                  ['✋ Revocación', 'Revocar el consentimiento otorgado para el tratamiento de sus datos.'],
                  ['⚠️ Queja', 'Presentar quejas ante la Superintendencia de Industria y Comercio (SIC) por incumplimiento de la normativa.'],
                ].map(([title, desc]) => (
                  <li key={title as string} className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl">
                    <span className="font-display font-bold text-dark min-w-[100px]">{title}</span>
                    <span className="text-sm">{desc}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm">
                Para ejercer estos derechos, envíe su solicitud a:{' '}
                <a href="mailto:contacto@juegoseducativos.com" className="text-primary font-bold">
                  contacto@juegoseducativos.com
                </a>
                {' '}con el asunto "Derechos ARCO". Responderemos en un plazo máximo de 15 días hábiles.
              </p>
            </section>

            <section aria-labelledby="section-6">
              <h2 id="section-6" className="text-2xl font-display font-black text-dark mb-4">6. Transferencias y Transmisiones de Datos</h2>
              <p>
                No vendemos, alquilamos ni compartimos sus datos personales con terceros con fines comerciales.
                Podemos compartir datos con proveedores tecnológicos (alojamiento, correo electrónico) que actúan
                como encargados del tratamiento bajo acuerdos de confidencialidad y con las mismas garantías de
                seguridad que aplicamos internamente.
              </p>
              <p className="mt-3">
                Algunos de estos proveedores pueden estar ubicados fuera de Colombia. En tales casos,
                garantizamos que cuenten con niveles de protección equivalentes a los exigidos por la legislación colombiana.
              </p>
            </section>

            <section aria-labelledby="section-7">
              <h2 id="section-7" className="text-2xl font-display font-black text-dark mb-4">7. Seguridad de los Datos</h2>
              <p className="mb-3">Implementamos medidas técnicas y organizativas para proteger sus datos:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Cifrado de contraseñas mediante algoritmos de hashing seguros (Argon2id).</li>
                <li>Transmisión de datos exclusivamente mediante HTTPS/TLS.</li>
                <li>Control de acceso basado en roles (solo personal autorizado accede a los datos).</li>
                <li>Base de datos con cifrado en reposo y acceso restringido.</li>
                <li>Copias de seguridad automáticas diarias.</li>
                <li>Tokens de sesión con tiempo de expiración.</li>
              </ul>
            </section>

            <section aria-labelledby="section-8">
              <h2 id="section-8" className="text-2xl font-display font-black text-dark mb-4">8. Cookies y Tecnologías de Rastreo</h2>
              <p className="mb-3">Utilizamos los siguientes tipos de cookies:</p>
              <ul className="space-y-2">
                {[
                  ['Cookies esenciales', 'Necesarias para el funcionamiento de la plataforma (autenticación, seguridad). No pueden desactivarse.'],
                  ['Cookies de funcionalidad', 'Guardan el progreso de formularios para mejorar la experiencia del usuario.'],
                ].map(([name, desc]) => (
                  <li key={name as string} className="p-3 bg-gray-50 rounded-xl text-sm">
                    <strong className="text-dark">{name}:</strong> {desc}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-sm">
                Puede gestionar sus preferencias de cookies en el banner que aparece al visitar la plataforma por primera vez.
              </p>
            </section>

            <section aria-labelledby="section-9">
              <h2 id="section-9" className="text-2xl font-display font-black text-dark mb-4">9. Menores de Edad</h2>
              <p>
                Esta plataforma está dirigida a niños en edad escolar. Cuando el usuario sea menor de 18 años,
                el registro y la aceptación de esta política debe realizarse por parte de sus padres o tutores legales.
                No recopilamos datos de menores de manera directa sin la autorización explícita de sus representantes legales.
              </p>
            </section>

            <section aria-labelledby="section-10">
              <h2 id="section-10" className="text-2xl font-display font-black text-dark mb-4">10. Vigencia y Actualización</h2>
              <p>
                Esta política entra en vigencia a partir del {lastUpdated} y se actualizará cuando sea necesario.
                Los cambios significativos serán comunicados a los usuarios registrados por correo electrónico.
                La versión más reciente siempre estará disponible en esta página.
              </p>
            </section>

            <div className="bg-primary-50 rounded-2xl p-6 border border-primary-100 mt-8">
              <h3 className="font-display font-black text-dark text-lg mb-2">¿Preguntas sobre privacidad?</h3>
              <p className="text-sm text-gray-600 mb-3">
                Si tiene preguntas sobre esta política o desea ejercer sus derechos, contáctenos:
              </p>
              <a href="mailto:contacto@juegoseducativos.com" className="btn-primary inline-flex">
                <Mail className="w-4 h-4" />
                contacto@juegoseducativos.com
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
