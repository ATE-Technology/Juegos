import { motion } from 'framer-motion'
import { BookOpen, Award, Heart, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'

// Este contenido se actualizará desde el panel admin cuando esté disponible
const teacher = {
  name: 'Nombre de la Docente',
  title: 'Docente Especialista en Educación Primaria',
  bio: 'Soy una docente apasionada por la innovación educativa con más de 10 años de experiencia trabajando con niños de preescolar y primaria. Creo firmemente que cada niño tiene un potencial único que florece cuando se le brinda el ambiente y las herramientas adecuadas para aprender.',
  bio2: 'Mi enfoque pedagógico combina el juego como herramienta de aprendizaje con estrategias basadas en evidencia para garantizar que cada niño no solo aprenda los contenidos académicos, sino que también desarrolle habilidades del siglo XXI como el pensamiento crítico, la creatividad y la colaboración.',
  specialties: [
    'Matemáticas para educación inicial y primaria',
    'Desarrollo del lenguaje y lecto-escritura',
    'Aprendizaje basado en el juego',
    'Educación inclusiva',
    'Uso pedagógico de tecnología',
  ],
  achievements: [
    { icon: '🎓', text: 'Licenciatura en Educación Básica Primaria' },
    { icon: '📚', text: 'Especialización en Pedagogía Infantil' },
    { icon: '🏆', text: 'Más de 10 años de experiencia docente' },
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
                <Heart className="w-6 h-6 text-secondary" /> Mi historia
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">{teacher.bio}</p>
              <p className="text-gray-600 leading-relaxed">{teacher.bio2}</p>
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
