import { motion } from 'framer-motion'
import { BookOpen, Award, Heart, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'

// Este contenido se actualizará desde el panel admin cuando esté disponible
const teacher = {
  name: 'Diana Torres Suárez',
  title: 'Docente en pedagogía infantil - Especialista en diseño de ambientes de aprendizaje',
  bio: 'Me apasiona acompañar a los niños en sus procesos educativos y crear experiencias que les permitan aprender de una manera amena, creativa y divertida.',
  bio2: 'Considero que cada niño tiene habilidades, intereses y ritmos de aprendizaje diferentes. Por eso, mi trabajo busca brindar un acompañamiento personalizado, respetuoso y cercano.',
  bio3: 'Mi propósito es ayudar a cada niño a fortalecer sus conocimientos, desarrollar nuevas habilidades y descubrir que aprender puede ser divertido.',
  specialties: [
    'Matemáticas para educación inicial',
    'Desarrollo del lenguaje y lecto-escritura',
    'Aprendizaje basado en el juego',
    'Uso pedagógico de tecnología',
  ],
  achievements: [
    { icon: '🎓', text: 'Licenciatura en Educación Básica Primaria' },
    { icon: '📚', text: 'Especialización en Pedagogía Infantil' },
    { icon: '🏆', text: 'Más de 5 años de experiencia docente' },
    { icon: '🎮', text: 'Creadora de materiales educativos digitales' },
  ],
}

export default function TeacherProfile() {
  return (
    <div className="py-12">
      <div className="container-main">
        {/* Hero del perfil */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-primary to-secondary rounded-4xl p-8 md:p-12 mb-12 text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10" aria-hidden="true">
            {['📚', '🎮', '✏️', '🌟', '🎯'].map((e, i) => (
              <span key={i} className="absolute text-5xl" style={{ left: `${15 + i * 18}%`, top: `${20 + (i % 3) * 20}%` }}>
                {e}
              </span>
            ))}
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            {/* Avatar */}
            <div className="w-40 h-40 rounded-full bg-white/20 flex items-center justify-center 
                            text-7xl flex-shrink-0 border-4 border-white/30 shadow-2xl"
                 aria-label="Foto de la docente">
              👩‍🏫
            </div>
            <div>
              <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-sm font-bold mb-3">
                <BookOpen className="w-4 h-4" /> Perfil de la docente
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-black mb-2">{teacher.name}</h1>
              <p className="text-white/80 text-xl">{teacher.title}</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Biografía */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="bg-white rounded-3xl shadow-card p-8">
              <h2 className="text-2xl font-display font-black text-dark mb-5 flex items-center gap-2">
                <Heart className="w-6 h-6 text-secondary" /> Sobre mí
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">{teacher.bio}</p>
              <p className="text-gray-600 leading-relaxed mb-4">{teacher.bio2}</p>
              <p className="text-gray-600 leading-relaxed">{teacher.bio3}</p>
            </div>

            {/* Especialidades */}
            <div className="bg-white rounded-3xl shadow-card p-8">
              <h2 className="text-2xl font-display font-black text-dark mb-5 flex items-center gap-2">
                <Award className="w-6 h-6 text-primary" /> Especialidades
              </h2>
              <ul className="space-y-3" aria-label="Especialidades de la docente">
                {teacher.specialties.map((spec) => (
                  <li key={spec} className="flex items-start gap-3 text-gray-700">
                    <span className="w-6 h-6 bg-primary-50 text-primary rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5" aria-hidden="true">✓</span>
                    {spec}
                  </li>
                ))}
              </ul>
            </div>

            {/* Metodología */}
            <div className="bg-white rounded-3xl shadow-card p-8">
              <h2 className="text-2xl font-display font-black text-dark mb-3">
                🌱 Nuestra metodología
              </h2>
              <h3 className="text-lg font-display font-bold text-primary mb-3">
                Aprender a través del juego
              </h3>
              <p className="text-gray-600 leading-relaxed mb-5">
                Nuestra metodología combina <strong>pedagogía, creatividad, juego y herramientas digitales</strong> para hacer que cada encuentro sea una oportunidad para aprender.
              </p>
              <p className="text-gray-700 font-semibold mb-3">Trabajamos teniendo en cuenta:</p>
              <ul className="space-y-3 mb-5" aria-label="Principios de nuestra metodología">
                <li className="flex items-start gap-3 text-gray-700"><span aria-hidden="true">💛</span> Las necesidades de cada niño.</li>
                <li className="flex items-start gap-3 text-gray-700"><span aria-hidden="true">🌱</span> Su ritmo de aprendizaje.</li>
                <li className="flex items-start gap-3 text-gray-700"><span aria-hidden="true">🎯</span> Sus objetivos de aprendizaje.</li>
                <li className="flex items-start gap-3 text-gray-700"><span aria-hidden="true">🎨</span> Sus intereses.</li>
                <li className="flex items-start gap-3 text-gray-700"><span aria-hidden="true">🧩</span> Sus habilidades y fortalezas.</li>
              </ul>
              <p className="text-gray-600 leading-relaxed">
                Buscamos que los niños sean protagonistas de su propio aprendizaje.
              </p>
            </div>
          </motion.div>

          {/* Logros y contacto */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-3xl shadow-card p-6">
              <h2 className="text-xl font-display font-black text-dark mb-4">Formación y logros</h2>
              <ul className="space-y-4" aria-label="Logros y formación de la docente">
                {teacher.achievements.map((item) => (
                  <li key={item.text} className="flex items-start gap-3">
                    <span className="text-2xl flex-shrink-0" aria-hidden="true">{item.icon}</span>
                    <p className="text-gray-700 text-sm leading-relaxed">{item.text}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-br from-primary-50 to-secondary/10 rounded-3xl p-6 border border-primary-100">
              <h3 className="font-display font-black text-dark text-lg mb-3">¿Tienes preguntas?</h3>
              <p className="text-gray-600 text-sm mb-4">
                Si tienes dudas sobre los juegos, el contenido educativo o quieres saber más, contáctame.
              </p>
              <Link to="/contacto" className="btn-primary w-full text-sm">
                <Mail className="w-4 h-4" /> Contactar
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
