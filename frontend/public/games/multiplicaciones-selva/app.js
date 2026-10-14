/* ==========================================================================
   AVENTURA DE MULTIPLICACIONES EN LA SELVA - MOTOR DE JUEGO (VANILLA JAVASCRIPT)
   - 5 TABLEROS TEMÁTICOS CON PAISAJES INTERNOS Y OBSTÁCULOS FÍSICOS
   - FÍSICA 2D, CÁMARA DE SCROLL SUAVE Y SPRITE SHEET (explorer_walk.png)
   - GENERADOR DIDÁCTICO DE MULTIPLICACIONES CON PISTAS Y APOYO VISUAL
   - CONTROLES PARA COMPUTADOR Y CELULAR (MULTI-TOUCH ROBUSTO)
   - SINTETIZADOR DE AUDIO NATIVO Y AUTOGUARDADO EN LOCALSTORAGE
   ========================================================================== */

(function () {
  'use strict';

  // ==========================================================================
  // 1. SINTETIZADOR DE EFECTOS DE SONIDO (WEB AUDIO API - CERO ARCHIVOS EXTERNOS)
  // ==========================================================================
  class SoundFx {
    constructor() {
      this.ctx = null;
      this.enabled = true;
    }

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    playJump() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(180, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(520, this.ctx.currentTime + 0.16);
      gain.gain.setValueAtTime(0.28, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.16);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.16);
    }

    playCorrect() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // Acorde mayor brillante (Do - Mi - Sol - Do)
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = freq;
        const startTime = this.ctx.currentTime + idx * 0.07;
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.26, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.28);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.28);
      });
    }

    playWrong() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(240, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(85, this.ctx.currentTime + 0.26);
      gain.gain.setValueAtTime(0.32, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.26);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.26);
    }

    playWin() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      const fanfare = [523.25, 659.25, 783.99, 1046.50, 1318.51];
      fanfare.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.value = freq;
        const t = this.ctx.currentTime + i * 0.09;
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.32);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.32);
      });
    }

    playClick() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(620, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    }

    playOrbTouch() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    }
  }

  const audio = new SoundFx();

  // ==========================================================================
  // 2. SISTEMA DE AUTOGUARDADO EN LOCALSTORAGE
  // ==========================================================================
  const SAVE_KEY = 'MULTIPLICATION_JUNGLE_QUEST_SAVE_V1';

  const defaultData = {
    score: 0,
    highScore: 0,
    unlockedLevel: 1,
    levelStars: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    mapPlayerX: 140
  };

  function loadGameData() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (raw) return Object.assign({}, defaultData, JSON.parse(raw));
    } catch (e) {
      console.warn('No se pudo cargar datos guardados:', e);
    }
    return Object.assign({}, defaultData);
  }

  function saveGameData(data) {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('No se pudo guardar datos:', e);
    }
  }

  let gameData = loadGameData();

  // ==========================================================================
  // 3. GENERADOR DE MULTIPLICACIONES DIDÁCTICAS (5 NIVELES PROGRESIVOS)
  // ==========================================================================
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function shuffleArray(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  /**
   * Genera una pregunta pedagógica adaptada a cada uno de los 5 tableros.
   * Incluye la expresión, la pista pedagógica y datos visuales de apoyo.
   */
  function generateLevelQuestion(levelId) {
    let factorA = 2;
    let factorB = 2;
    let answer = 4;
    let qText = "";
    let qHint = "";
    let visualType = "seeds"; // seeds, vines, crystals, glyphs, golden_orbs

    if (levelId === 1) {
      // TABLERO 1: El Valle de las Semillas (Tablas del 2, 3 y 4)
      factorA = getRandomInt(2, 4);
      factorB = getRandomInt(2, 6);
      answer = factorA * factorB;
      qText = `${factorA} × ${factorB} = ?`;
      qHint = `Imagina ${factorA} grupos con ${factorB} semillas cada uno (suma: ${Array(factorA).fill(factorB).join(' + ')}).`;
      visualType = "seeds";

    } else if (levelId === 2) {
      // TABLERO 2: El Puente de las Lianas (Tablas del 5, 6 y 7)
      factorA = getRandomInt(5, 7);
      factorB = getRandomInt(3, 8);
      answer = factorA * factorB;
      qText = `${factorA} × ${factorB} = ?`;
      qHint = `Pista: Puedes descomponerlo, por ejemplo ${factorA} × 5 = ${factorA * 5} y sumar lo que falte.`;
      visualType = "vines";

    } else if (levelId === 3) {
      // TABLERO 3: La Gruta de la Cascada (Tablas del 8, 9 y 10)
      const tablePick = getRandomInt(8, 10);
      factorA = tablePick;
      factorB = getRandomInt(4, 9);
      answer = factorA * factorB;
      qText = `${factorA} × ${factorB} = ?`;
      if (factorA === 9) {
        qHint = `Truco del 9: ${10} × ${factorB} = ${10 * factorB}, luego resta ${factorB} (${10 * factorB} - ${factorB} = ${answer}).`;
      } else if (factorA === 10) {
        qHint = `Multiplicar por 10: Solo agrega un cero al número ${factorB}.`;
      } else {
        qHint = `Pista: El doble de 4 × ${factorB} es 8 × ${factorB}.`;
      }
      visualType = "crystals";

    } else if (levelId === 4) {
      // TABLERO 4: Las Ruinas del Templo Perdido (Tablas del 11 y 12, y productos de 2 dígitos)
      const mode = getRandomInt(1, 2);
      if (mode === 1) {
        factorA = getRandomInt(11, 12);
        factorB = getRandomInt(3, 8);
        answer = factorA * factorB;
        qText = `${factorA} × ${factorB} = ?`;
        qHint = `Descompón: (10 × ${factorB}) + (${factorA - 10} × ${factorB}) = ${10 * factorB} + ${(factorA - 10) * factorB}.`;
      } else {
        // Productos estilo 15×3, 14×4, 13×4
        factorA = getRandomInt(13, 16);
        factorB = getRandomInt(2, 4);
        answer = factorA * factorB;
        qText = `${factorA} × ${factorB} = ?`;
        qHint = `Multiplica 10 × ${factorB} (${10 * factorB}) y súmale ${factorA % 10} × ${factorB} (${(factorA % 10) * factorB}).`;
      }
      visualType = "glyphs";

    } else {
      // TABLERO 5: El Altar del Guardián Solar (Desafío Maestro: 2 cifras × 1 cifra y problemas contextuales)
      const problemMode = getRandomInt(1, 2);
      if (problemMode === 1) {
        // Ej: 25×4, 32×3, 18×5, 45×2, 24×3
        const listA = [18, 24, 25, 32, 35, 45];
        factorA = listA[getRandomInt(0, listA.length - 1)];
        factorB = getRandomInt(2, 5);
        answer = factorA * factorB;
        qText = `Desafío del Guardián: ${factorA} × ${factorB} = ?`;
        qHint = `Multiplica las decenas y las unidades: (${Math.floor(factorA / 10) * 10} × ${factorB}) + (${(factorA % 10)} × ${factorB}).`;
      } else {
        // Problema contextual de expedición en la selva
        const itemNames = ['cofres con gemas', 'mochilas con provisiones', 'canastas de frutas de selva'];
        const chosenItem = itemNames[getRandomInt(0, itemNames.length - 1)];
        factorA = getRandomInt(15, 25);
        factorB = getRandomInt(3, 4);
        answer = factorA * factorB;
        qText = `La expedición encontró ${factorB} ${chosenItem}, con ${factorA} unidades en cada uno. ¿Cuántas hay en total?`;
        qHint = `Calcula ${factorB} × ${factorA} en total.`;
      }
      visualType = "golden_orbs";
    }

    // Generar opciones con distractores matemáticamente plausibles
    const ansStr = String(answer);
    const optSet = new Set([ansStr]);
    while (optSet.size < 4) {
      const delta = getRandomInt(-4, 4);
      let fake = answer + delta;
      // Añadir pequeños errores comunes (como sumar en vez de multiplicar o sumar/restar un factor)
      if (fake <= 0 || fake === answer) {
        const fakeOffsets = [factorB, -factorB, factorA, 10, -10];
        fake = answer + fakeOffsets[getRandomInt(0, fakeOffsets.length - 1)];
      }
      if (fake > 0 && fake !== answer) {
        optSet.add(String(fake));
      }
    }
    const options = shuffleArray(Array.from(optSet));
    const correctIdx = options.indexOf(ansStr);

    return { factorA, factorB, answer, qText, qHint, options, correctIdx, visualType };
  }

  // ==========================================================================
  // 4. CONFIGURACIÓN DE LOS 5 TABLEROS Y SUS BIOMAS SELVÁTICOS
  // ==========================================================================
  const LEVEL_CONFIGS = [
    {
      id: 1,
      title: 'El Valle de las Semillas',
      subtitle: 'Tablas del 2 al 4 • Raíces y Brotes',
      targetPuzzles: 3,
      xMap: 280,
      biome: 'SEEDS_VALLEY',
      themeColor: '#10b981',
      description: 'Supera los troncos caídos y recolecta semillas multiplicadoras.'
    },
    {
      id: 2,
      title: 'El Puente de las Lianas',
      subtitle: 'Tablas del 5 al 7 • Abismo Vegetal',
      targetPuzzles: 4,
      xMap: 720,
      biome: 'VINES_BRIDGE',
      themeColor: '#34d399',
      description: 'Salta por las plataformas colgantes y activa los tótems entre las lianas.'
    },
    {
      id: 3,
      title: 'La Gruta de la Cascada',
      subtitle: 'Tablas del 8 al 10 • Aguas Esmeralda',
      targetPuzzles: 4,
      xMap: 1160,
      biome: 'CASCADE_GROTTO',
      themeColor: '#06b6d4',
      description: 'Cruza los cristales acuáticos y resuelve los orbes de la gran cascada.'
    },
    {
      id: 4,
      title: 'Las Ruinas del Templo Perdido',
      subtitle: 'Tablas del 11 y 12 • Glifos Ancestrales',
      targetPuzzles: 4,
      xMap: 1600,
      biome: 'TEMPLE_RUINS',
      themeColor: '#f59e0b',
      description: 'Escala los pilares labrados de piedra y descifra los jeroglíficos.'
    },
    {
      id: 5,
      title: 'El Altar del Guardián Solar',
      subtitle: 'Desafío Maestro • 2 Cifras y Problemas',
      targetPuzzles: 5,
      xMap: 2040,
      biome: 'SOLAR_ALTAR',
      themeColor: '#fbbf24',
      description: 'Alcanza la cima del templo solar y completa la gran prueba de expedición.'
    }
  ];

  const WORLD_MAP_WIDTH = 2360;
  let cameraX = 0;

  // Estados del juego
  let gameState = 'TITLE'; // TITLE, WORLD_MAP, IN_LEVEL, LEVEL_COMPLETE
  let currentLevel = null;
  let levelScoreEarned = 0;
  let puzzlesSolvedInLevel = 0;
  let totalLevelQuestionsAsked = 0;
  let activePuzzle = null;
  let activePuzzleTimer = 30;
  let puzzleTimerInterval = null;

  // Sistema de partículas y textos flotantes
  const particles = [];
  const floatingTexts = [];

  function addFloatingText(x, y, text, color) {
    floatingTexts.push({
      x: x,
      y: y,
      text: text,
      color: color,
      alpha: 1.0,
      vy: -1.6
    });
  }

  function addSparkleParticles(x, y, color = '#fbbf24', count = 14) {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5);
      const speed = 1.5 + Math.random() * 3.5;
      particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2.5 + Math.random() * 3.5,
        color: color,
        alpha: 1.0,
        decay: 0.02 + Math.random() * 0.025
      });
    }
  }

  // ==========================================================================
  // 5. CANVAS Y SPRITE SHEET (explorer_walk.png)
  // ==========================================================================
  const canvas = document.getElementById('game-canvas');
  const ctx = canvas.getContext('2d');
  const charPreviewCanvas = document.getElementById('char-preview-canvas');
  const previewCtx = charPreviewCanvas ? charPreviewCanvas.getContext('2d') : null;

  const sprite = new Image();
  sprite.src = 'explorer_walk.png';

  const TOTAL_FRAMES = 6;
  let frame = 0;
  let spriteLoaded = false;

  sprite.onload = () => {
    spriteLoaded = true;
  };

  // Temporizador para el ciclo de fotogramas de la exploradora
  setInterval(() => {
    if (Math.abs(player.vx) > 0.1 || !player.isGrounded) {
      frame = (frame + 1) % TOTAL_FRAMES;
    } else {
      frame = 0;
    }
  }, 100);

  // ==========================================================================
  // 6. ENTIDAD DEL JUGADOR Y MOTOR DE FÍSICA
  // ==========================================================================
  class Player {
    constructor() {
      this.x = gameData.mapPlayerX || 140;
      this.y = 420;
      this.width = 46;
      this.height = 60;
      this.vx = 0;
      this.vy = 0;
      this.speed = 5.6;
      this.jumpPower = -12.8;
      this.gravity = 0.62;
      this.groundY = 420;
      this.isGrounded = true;
      this.facingRight = true;
      this.walkTimer = 0;
      this.dustTimer = 0;
    }

    update(mapLimitWidth, platforms = []) {
      if (isPuzzleActive) {
        this.vx = 0;
        this.vy = 0;
        return;
      }
      this.x += this.vx;

      if (this.x < 35) this.x = 35;
      if (this.x > mapLimitWidth - 35) this.x = mapLimitWidth - 35;

      this.vy += this.gravity;
      this.y += this.vy;

      let groundedOnPlatform = false;

      // Colisión superior con plataformas
      platforms.forEach(p => {
        if (this.x + 18 > p.x && this.x - 18 < p.x + p.w) {
          if (this.y >= p.y - 30 && this.y - this.vy <= p.y - 18 && this.vy >= 0) {
            this.y = p.y - 30;
            this.vy = 0;
            this.isGrounded = true;
            groundedOnPlatform = true;
          }
        }
      });

      if (!groundedOnPlatform) {
        if (this.y >= this.groundY) {
          this.y = this.groundY;
          this.vy = 0;
          this.isGrounded = true;
        } else {
          this.isGrounded = false;
        }
      }

      // Animación y partículas de paso
      if (Math.abs(this.vx) > 0.1 && this.isGrounded) {
        this.walkTimer += 0.28;
        this.dustTimer++;
        if (this.dustTimer % 8 === 0) {
          particles.push({
            x: this.x + (this.facingRight ? -12 : 12),
            y: this.y + 22,
            vx: (Math.random() - 0.5) * 1.5,
            vy: -Math.random() * 1.2,
            size: 2.5 + Math.random() * 2,
            color: 'rgba(217, 119, 6, 0.45)',
            alpha: 0.8,
            decay: 0.05
          });
        }
      } else {
        this.walkTimer = 0;
      }
    }

    draw(c) {
      c.save();
      c.translate(this.x, this.y);
      if (!this.facingRight) {
        c.scale(-1, 1);
      }

      if (spriteLoaded && sprite.naturalWidth > 0 && sprite.naturalHeight > 0) {
        // Sombra de contacto en el suelo
        c.fillStyle = 'rgba(0, 0, 0, 0.35)';
        c.beginPath();
        c.ellipse(0, 24, 20, 6, 0, 0, Math.PI * 2);
        c.fill();

        // Recorte exacto por frame (1024 / 6)
        const singleFrameWidth = sprite.naturalWidth / TOTAL_FRAMES;
        const singleFrameHeight = sprite.naturalHeight;
        const currentFrameIndex = frame % TOTAL_FRAMES;

        const sx = currentFrameIndex * singleFrameWidth;
        const sy = 0;
        const sw = singleFrameWidth;
        const sh = singleFrameHeight;

        // Proporción original
        const aspectRatio = sw / sh;
        const renderHeight = 138;
        const renderWidth = renderHeight * aspectRatio;

        c.drawImage(
          sprite,
          sx,
          sy,
          sw,
          sh,
          -renderWidth / 2,
          -renderHeight + 24,
          renderWidth,
          renderHeight
        );
      } else {
        // Fallback procedural de la exploradora
        const legOffset = Math.sin(this.walkTimer) * 8;
        c.fillStyle = 'rgba(0, 0, 0, 0.35)';
        c.beginPath();
        c.ellipse(0, 24, 18, 6, 0, 0, Math.PI * 2);
        c.fill();

        // Botas
        c.fillStyle = '#451a03';
        c.fillRect(-10 + legOffset, 12, 9, 12);
        c.fillRect(1 - legOffset, 12, 9, 12);

        // Pantalón corto
        c.fillStyle = '#b45309';
        c.fillRect(-10 + legOffset, 2, 9, 11);
        c.fillRect(1 - legOffset, 2, 9, 11);

        // Camisa de expedición
        c.fillStyle = '#d97706';
        c.fillRect(-14, -18, 28, 22);

        // Cabeza
        c.fillStyle = '#fbcfe8';
        c.beginPath();
        c.arc(0, -28, 12, 0, Math.PI * 2);
        c.fill();

        // Sombrero de explorador
        c.fillStyle = '#78350f';
        c.beginPath();
        c.ellipse(0, -36, 18, 5, 0, 0, Math.PI * 2);
        c.fill();
        c.fillRect(-9, -46, 18, 11);
        c.fillStyle = '#fbbf24';
        c.fillRect(-9, -38, 18, 3);
      }

      c.restore();
    }
  }

  const player = new Player();

  // ==========================================================================
  // 7. ARTE PROCEDURAL DE SELVA TROPICAL (Canvas 2D)
  // ==========================================================================
  function drawJunglePalm(c, x, y, scale = 1) {
    c.save();
    c.translate(x, y);
    c.scale(scale, scale);

    // Tronco arqueado de madera
    c.strokeStyle = '#78350f';
    c.lineWidth = 14;
    c.lineCap = 'round';
    c.beginPath();
    c.moveTo(0, 0);
    c.quadraticCurveTo(20, -90, -12, -180);
    c.stroke();

    // Textura de anillos del tronco
    c.strokeStyle = '#451a03';
    c.lineWidth = 3;
    for (let i = 20; i < 170; i += 22) {
      c.beginPath();
      c.moveTo(4 - i * 0.08, -i);
      c.lineTo(16 - i * 0.08, -i + 4);
      c.stroke();
    }

    // Racimo de cocos selváticos
    c.fillStyle = '#3f1d0b';
    c.beginPath();
    c.arc(-8, -178, 6, 0, Math.PI * 2);
    c.arc(-14, -174, 5, 0, Math.PI * 2);
    c.arc(-2, -174, 5, 0, Math.PI * 2);
    c.fill();

    // Frondas tropicales esmeralda
    const angles = [-150, -115, -75, -35, 5, 45];
    angles.forEach((ang, idx) => {
      c.save();
      c.translate(-12, -180);
      c.rotate((ang * Math.PI) / 180);

      // Hoja
      c.fillStyle = idx % 2 === 0 ? '#10b981' : '#059669';
      c.beginPath();
      c.moveTo(0, 0);
      c.quadraticCurveTo(48, -26, 100, 0);
      c.quadraticCurveTo(48, 26, 0, 0);
      c.fill();

      // Nervadura dorada
      c.strokeStyle = '#fbbf24';
      c.lineWidth = 2.5;
      c.beginPath();
      c.moveTo(0, 0);
      c.lineTo(90, 0);
      c.stroke();

      c.restore();
    });

    c.restore();
  }

  function drawMonsteraLeaf(c, x, y, size = 26, angle = 0) {
    c.save();
    c.translate(x, y);
    c.rotate((angle * Math.PI) / 180);
    c.fillStyle = '#059669';
    c.beginPath();
    c.ellipse(0, -size / 2, size / 3, size / 2, 0, 0, Math.PI * 2);
    c.fill();

    c.strokeStyle = '#34d399';
    c.lineWidth = 2;
    c.beginPath();
    c.moveTo(0, 0);
    c.lineTo(0, -size);
    c.stroke();
    c.restore();
  }

  function drawBambooCluster(c, x, y, height = 110) {
    c.save();
    c.translate(x, y);
    const canes = [-12, 0, 14];
    canes.forEach((cx, idx) => {
      const h = height - idx * 14;
      c.fillStyle = '#15803d';
      c.fillRect(cx - 3, -h, 6, h);

      // Nudos de bambú
      c.fillStyle = '#fef08a';
      for (let step = 20; step < h; step += 24) {
        c.fillRect(cx - 5, -step, 10, 3);
      }
    });
    c.restore();
  }

  // ==========================================================================
  // 8. CONTROLES: TECLADO Y MULTI-TOUCH ERGONÓMICO
  // ==========================================================================
  const keys = { Left: false, Right: false, Up: false, Enter: false };
  const keyboardKeys = { Left: false, Right: false, Up: false };
  const touchPointers = { Left: new Set(), Right: new Set(), Up: new Set() };
  const touchPointerKeys = new Map();

  function updatePlayerVelocity() {
    if (isPuzzleActive) {
      player.vx = 0;
      return;
    }
    let dx = 0;
    if (keys.Right) {
      dx += player.speed;
      player.facingRight = true;
    }
    if (keys.Left) {
      dx -= player.speed;
      player.facingRight = false;
    }
    player.vx = dx;
  }

  function syncMovementInputs() {
    if (isPuzzleActive) {
      keys.Left = false;
      keys.Right = false;
      keys.Up = false;
      player.vx = 0;
      return;
    }
    keys.Left = keyboardKeys.Left || touchPointers.Left.size > 0;
    keys.Right = keyboardKeys.Right || touchPointers.Right.size > 0;
    keys.Up = keyboardKeys.Up || touchPointers.Up.size > 0;
    updatePlayerVelocity();
  }

  function startJump() {
    if (isPuzzleActive) return;
    if (player.isGrounded) {
      player.vy = player.jumpPower;
      player.isGrounded = false;
      audio.playJump();

      // Partículas al saltar
      for (let i = 0; i < 5; i++) {
        particles.push({
          x: player.x + (Math.random() - 0.5) * 16,
          y: player.y + 22,
          vx: (Math.random() - 0.5) * 3,
          vy: Math.random() * -2,
          size: 3,
          color: '#10b981',
          alpha: 0.9,
          decay: 0.05
        });
      }
    }
  }

  // Soporte Multi-Touch con Pointer Events
  document.querySelectorAll('[data-touch-control]').forEach((button) => {
    const control = button.dataset.touchControl;
    const key = { left: 'Left', right: 'Right', jump: 'Up' }[control];

    button.addEventListener('pointerdown', (event) => {
      event.preventDefault();

      if (control === 'enter') {
        handleEnterOrAction();
        return;
      }

      if (!key) return;

      touchPointers[key].add(event.pointerId);
      touchPointerKeys.set(event.pointerId, key);
      if (key === 'Up') startJump();
      syncMovementInputs();
      button.setPointerCapture(event.pointerId);
    });

    const releasePointer = (event) => {
      const pressedKey = touchPointerKeys.get(event.pointerId);
      if (!pressedKey) return;

      touchPointers[pressedKey].delete(event.pointerId);
      touchPointerKeys.delete(event.pointerId);
      syncMovementInputs();
    };

    button.addEventListener('pointerup', releasePointer);
    button.addEventListener('pointercancel', releasePointer);
    button.addEventListener('lostpointercapture', releasePointer);
  });

  // Manejo de teclado (PC)
  window.addEventListener('keydown', (e) => {
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' ', 'Enter'].includes(e.key)) {
      e.preventDefault();
    }

    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
      keyboardKeys.Left = true;
      syncMovementInputs();
    }
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
      keyboardKeys.Right = true;
      syncMovementInputs();
    }
    if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === ' ') {
      startJump();
      keyboardKeys.Up = true;
      syncMovementInputs();
    }
    if (e.key === 'Enter') {
      if (!keys.Enter) {
        handleEnterOrAction();
      }
      keys.Enter = true;
    }
  });

  window.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
      keyboardKeys.Left = false;
      syncMovementInputs();
    }
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
      keyboardKeys.Right = false;
      syncMovementInputs();
    }
    if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === ' ') {
      keyboardKeys.Up = false;
      syncMovementInputs();
    }
    if (e.key === 'Enter') {
      keys.Enter = false;
    }
  });

  function handleEnterOrAction() {
    if (gameState === 'WORLD_MAP') {
      const nearLevel = LEVEL_CONFIGS.find(cfg => Math.abs(player.x - cfg.xMap) < 65);
      if (nearLevel) {
        if (nearLevel.id <= gameData.unlockedLevel) {
          audio.playClick();
          startLevel(nearLevel.id);
        } else {
          audio.playWrong();
          addFloatingText(player.x, player.y - 45, "¡Tablero Bloqueado!", "#ef4444");
        }
      }
    } else if (gameState === 'IN_LEVEL') {
      if (isPuzzleActive) return;
      // Si está cerca de un orbe/obstáculo, interactuar
      levelObstacles.forEach(obs => {
        if (!obs.solved && (!obs.cooldown || Date.now() > obs.cooldown) && Math.abs(player.x - obs.x) < 55 && Math.abs(player.y - obs.y) < 70) {
          audio.playOrbTouch();
          triggerMathPuzzle(obs);
        }
      });
    }
  }

  // ==========================================================================
  // 9. DIBUJADO DEL MAPA DE LA SELVA (WORLD MAP CON CÁMARA SCROLL)
  // ==========================================================================
  function drawWorldMap() {
    const targetCamX = player.x - canvas.width / 2;
    cameraX += (targetCamX - cameraX) * 0.1;
    cameraX = Math.max(0, Math.min(WORLD_MAP_WIDTH - canvas.width, cameraX));

    ctx.save();
    ctx.translate(-Math.round(cameraX), 0);

    // 1. Cielo de Atardecer Dorado / Amanecer en la Selva
    const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    skyGrad.addColorStop(0, '#064e3b');    // Verde esmeralda superior
    skyGrad.addColorStop(0.35, '#047857'); // Verde selva tropical
    skyGrad.addColorStop(0.65, '#d97706'); // Naranja atardecer
    skyGrad.addColorStop(0.85, '#f59e0b'); // Ámbar brillante
    skyGrad.addColorStop(1, '#fef08a');    // Dorado resplandeciente
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, WORLD_MAP_WIDTH, canvas.height);

    // 2. Gran Sol Radiante
    ctx.fillStyle = 'rgba(254, 240, 138, 0.22)';
    ctx.beginPath();
    ctx.arc(1100, 210, 160, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fffbeb';
    ctx.beginPath();
    ctx.arc(1100, 210, 75, 0, Math.PI * 2);
    ctx.fill();

    // 3. Montañas de Selva en Silueta
    ctx.fillStyle = '#064e3b';
    for (let x = 0; x < WORLD_MAP_WIDTH; x += 280) {
      ctx.beginPath();
      ctx.moveTo(x, 460);
      ctx.lineTo(x + 140, 180);
      ctx.lineTo(x + 280, 460);
      ctx.fill();
    }

    ctx.fillStyle = '#047857';
    for (let x = 70; x < WORLD_MAP_WIDTH + 140; x += 250) {
      ctx.beginPath();
      ctx.moveTo(x, 460);
      ctx.lineTo(x + 125, 230);
      ctx.lineTo(x + 250, 460);
      ctx.fill();
    }

    // 4. Dosel y Lianas Colgantes Superiores
    ctx.fillStyle = '#022c22';
    for (let x = -50; x < WORLD_MAP_WIDTH + 100; x += 85) {
      ctx.beginPath();
      ctx.arc(x, 60, 75, 0, Math.PI * 2);
      ctx.fill();
    }

    // Lianas con flores exóticas
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 3;
    for (let lx = 50; lx < WORLD_MAP_WIDTH; lx += 140) {
      ctx.beginPath();
      ctx.moveTo(lx, 90);
      ctx.quadraticCurveTo(lx + 15, 140, lx + 5, 195);
      ctx.stroke();

      // Flor tropical
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.arc(lx + 5, 198, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(lx + 5, 198, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // 5. Palmeras y Bambúes a lo largo del mapa
    for (let px = 120; px < WORLD_MAP_WIDTH; px += 360) {
      drawJunglePalm(ctx, px, 440, 0.9);
      drawBambooCluster(ctx, px + 120, 440, 95);
    }

    // 6. Camino de Tierra y Madera
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 34;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(70, 440);
    ctx.lineTo(WORLD_MAP_WIDTH - 70, 440);
    ctx.stroke();

    ctx.strokeStyle = '#d97706'; // Iluminación superior
    ctx.lineWidth = 18;
    ctx.stroke();

    // Hojas de monstera en el camino
    for (let mx = 100; mx < WORLD_MAP_WIDTH; mx += 180) {
      drawMonsteraLeaf(ctx, mx, 448, 24, -20);
      drawMonsteraLeaf(ctx, mx + 26, 448, 20, 25);
    }

    // 7. Los 5 Santuarios / Portales de Entrada a los Tableros
    let nearAnyPortal = false;

    LEVEL_CONFIGS.forEach((cfg) => {
      const isUnlocked = cfg.id <= gameData.unlockedLevel;
      const isNear = Math.abs(player.x - cfg.xMap) < 65;
      if (isNear && isUnlocked) nearAnyPortal = true;

      const stars = gameData.levelStars[cfg.id] || 0;

      ctx.save();
      ctx.translate(cfg.xMap, 365);

      // Base del templo de piedra antigua
      ctx.fillStyle = isUnlocked ? '#78350f' : '#1f2937';
      ctx.fillRect(-38, -60, 76, 80);

      // Cornisa superior
      ctx.fillStyle = isUnlocked ? '#b45309' : '#374151';
      ctx.fillRect(-46, -78, 92, 22);

      // Arco de la puerta
      ctx.fillStyle = isUnlocked ? '#fef08a' : '#111827';
      ctx.beginPath();
      ctx.arc(0, -15, 22, Math.PI, 0);
      ctx.fillRect(-22, -15, 44, 35);
      ctx.fill();

      // Símbolo de Multiplicación '×' o Número de Tablero
      if (isUnlocked) {
        ctx.fillStyle = '#451a03';
        ctx.font = 'bold 16px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillText(`T${cfg.id}`, 0, 10);

        // Estrellas doradas ganadas
        ctx.font = '14px sans-serif';
        const starStr = '⭐'.repeat(stars) + '🖤'.repeat(3 - stars);
        ctx.fillText(starStr, 0, -88);
      } else {
        ctx.fillStyle = '#9ca3af';
        ctx.font = '22px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🔒', 0, 8);
      }

      // Título del Tablero
      ctx.fillStyle = isUnlocked ? '#ffffff' : '#9ca3af';
      ctx.font = 'bold 13px "Fredoka", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(cfg.title, 0, 46);

      // Subtítulo temático
      ctx.fillStyle = isUnlocked ? '#34d399' : '#6b7280';
      ctx.font = '11px "Outfit", sans-serif';
      ctx.fillText(cfg.subtitle, 0, 62);

      // Halo de selección dorada si el jugador está frente a la entrada
      if (isNear && isUnlocked) {
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 3.5;
        ctx.strokeRect(-50, -84, 100, 140);

        // Partículas místicas de entrada
        if (Math.random() < 0.25) {
          particles.push({
            x: cfg.xMap + (Math.random() - 0.5) * 60,
            y: 350 + (Math.random() - 0.5) * 40,
            vx: (Math.random() - 0.5) * 1.5,
            vy: -1.5 - Math.random() * 1.5,
            size: 3,
            color: '#fbbf24',
            alpha: 1,
            decay: 0.03
          });
        }
      }

      ctx.restore();
    });

    // Badge de aviso en el footer
    const promptBadge = document.getElementById('map-prompt-badge');
    if (promptBadge) {
      if (nearAnyPortal) promptBadge.classList.remove('hidden');
      else promptBadge.classList.add('hidden');
    }

    gameData.mapPlayerX = Math.round(player.x);

    // Actualizar y dibujar jugador
    player.update(WORLD_MAP_WIDTH);
    player.draw(ctx);

    ctx.restore();
  }

  // ==========================================================================
  // 10. DIBUJADO DE LOS 5 TABLEROS INTERNOS (PAISAJES Y OBSTÁCULOS)
  // ==========================================================================
  let levelPlatforms = [];
  let levelObstacles = [];
  let levelGoalX = 1500;
  const LEVEL_WIDTH = 1700;

  function initLevelScene(levelId) {
    player.x = 90;
    player.y = 380;
    player.groundY = 380;
    levelGoalX = 1520;

    // Plataformas del recorrido adaptadas al bioma
    levelPlatforms = [
      { x: 0, y: 440, w: LEVEL_WIDTH, h: 140 }, // Suelo selvático principal
      { x: 260, y: 340, w: 160, h: 22, type: 'wood' },
      { x: 520, y: 260, w: 170, h: 22, type: 'wood' },
      { x: 800, y: 330, w: 160, h: 22, type: 'wood' },
      { x: 1080, y: 250, w: 180, h: 22, type: 'wood' }
    ];

    // Obstáculos interactivos con Orbes de Multiplicación (×)
    levelObstacles = [
      {
        id: 1,
        x: 340,
        y: 295,
        solved: false,
        name: 'Tótem de Raíces',
        type: 'log_spikes'
      },
      {
        id: 2,
        x: 605,
        y: 215,
        solved: false,
        name: 'Monolito de Lianas',
        type: 'vine_totem'
      },
      {
        id: 3,
        x: 880,
        y: 285,
        solved: false,
        name: 'Altar Rúnico',
        type: 'crystal_altar'
      },
      {
        id: 4,
        x: 1170,
        y: 205,
        solved: false,
        name: 'Guardián de Piedra',
        type: 'sun_pillar'
      }
    ];

    if (currentLevel && currentLevel.targetPuzzles > 4) {
      // 5 obstáculos para el nivel 5
      levelObstacles.push({
        id: 5,
        x: 1360,
        y: 350,
        solved: false,
        name: 'Gran Altar Solar',
        type: 'sun_pillar'
      });
    }
  }

  function drawInLevel() {
    const levelCamX = Math.max(0, Math.min(LEVEL_WIDTH - canvas.width, player.x - canvas.width / 2));

    ctx.save();
    ctx.translate(-Math.round(levelCamX), 0);

    // Fondo del bioma específico
    drawLevelBiomeBackground(currentLevel ? currentLevel.id : 1);

    // Dibujar plataformas selváticas
    levelPlatforms.forEach(p => {
      // Cuerpo de madera o roca
      ctx.fillStyle = '#451a03';
      ctx.fillRect(p.x, p.y, p.w, p.h);

      // Superficie iluminada
      ctx.fillStyle = '#b45309';
      ctx.fillRect(p.x, p.y, p.w, 6);

      // Hojas de monstera en los bordes
      drawMonsteraLeaf(ctx, p.x + 14, p.y + 4, 16, -15);
      drawMonsteraLeaf(ctx, p.x + p.w - 14, p.y + 4, 16, 15);
    });

    // Dibujar obstáculos y Orbes de Multiplicación
    levelObstacles.forEach(obs => {
      ctx.save();
      ctx.translate(obs.x, obs.y);

      if (obs.solved) {
        // Obstáculo superado / abierto con destello verde
        ctx.fillStyle = '#10b981';
        ctx.font = '24px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('✨✅', 0, 0);

        ctx.fillStyle = '#34d399';
        ctx.font = 'bold 11px "Fredoka", sans-serif';
        ctx.fillText('¡SUPERADO!', 0, 18);
      } else {
        // Obstáculo activo: Orbe de Multiplicación dorado pulsante con símbolo '×'
        const pulse = Math.sin(Date.now() * 0.006) * 3;

        // Base del obstáculo (Tótem de madera / piedra con púas)
        ctx.fillStyle = '#78350f';
        ctx.fillRect(-16, 10, 32, 28);
        ctx.fillStyle = '#b45309';
        ctx.fillRect(-18, 8, 36, 6);

        // Halo místico del orbe
        ctx.fillStyle = 'rgba(251, 191, 36, 0.35)';
        ctx.beginPath();
        ctx.arc(0, -6, 22 + pulse, 0, Math.PI * 2);
        ctx.fill();

        // Esfera dorada del orbe
        const orbGrad = ctx.createRadialGradient(-3, -9, 3, 0, -6, 18);
        orbGrad.addColorStop(0, '#fef08a');
        orbGrad.addColorStop(0.7, '#f59e0b');
        orbGrad.addColorStop(1, '#b45309');
        ctx.fillStyle = orbGrad;
        ctx.beginPath();
        ctx.arc(0, -6, 17, 0, Math.PI * 2);
        ctx.fill();

        // Borde dorado
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Signo de multiplicación '×'
        ctx.fillStyle = '#1a0f00';
        ctx.font = 'bold 18px "Fredoka", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('×', 0, -6);

        // Texto indicador
        ctx.fillStyle = '#fef08a';
        ctx.font = 'bold 10px "Press Start 2P"';
        ctx.fillText('TOCA', 0, -32);
      }

      ctx.restore();

      // Detección de colisión / interacción con el orbe
      if (!isPuzzleActive && !obs.solved && (!obs.cooldown || Date.now() > obs.cooldown) && Math.abs(player.x - obs.x) < 42 && Math.abs(player.y - obs.y) < 68) {
        audio.playOrbTouch();
        triggerMathPuzzle(obs);
      }
    });

    // Portal de Meta Ancestral (GOAL)
    drawLevelGoal(levelGoalX);

    // Actualizar y dibujar jugador
    player.update(LEVEL_WIDTH, levelPlatforms);
    player.draw(ctx);

    ctx.restore();

    // Verificación de fin de nivel al llegar a la meta
    if (player.x >= levelGoalX - 25 && puzzlesSolvedInLevel >= 1) {
      completeCurrentLevel();
    }
  }

  function drawLevelBiomeBackground(levelId) {
    const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);

    if (levelId === 1) {
      // Bioma 1: Bosque Verde de Semillas
      bgGrad.addColorStop(0, '#064e3b');
      bgGrad.addColorStop(0.6, '#047857');
      bgGrad.addColorStop(1, '#10b981');
    } else if (levelId === 2) {
      // Bioma 2: Lianas y Bruma Tropical
      bgGrad.addColorStop(0, '#022c22');
      bgGrad.addColorStop(0.5, '#065f46');
      bgGrad.addColorStop(1, '#059669');
    } else if (levelId === 3) {
      // Bioma 3: Gruta de Cascada Esmeralda y Azul
      bgGrad.addColorStop(0, '#0f172a');
      bgGrad.addColorStop(0.5, '#0e7490');
      bgGrad.addColorStop(1, '#06b6d4');
    } else if (levelId === 4) {
      // Bioma 4: Ruinas de Templo en Penumbra Dorada
      bgGrad.addColorStop(0, '#1c1917');
      bgGrad.addColorStop(0.5, '#78350f');
      bgGrad.addColorStop(1, '#b45309');
    } else {
      // Bioma 5: Altar Solar
      bgGrad.addColorStop(0, '#451a03');
      bgGrad.addColorStop(0.5, '#d97706');
      bgGrad.addColorStop(1, '#fbbf24');
    }

    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, LEVEL_WIDTH, canvas.height);

    // Rayos de sol de selva filtrándose
    ctx.fillStyle = 'rgba(254, 240, 138, 0.08)';
    ctx.beginPath();
    ctx.moveTo(320, 0); ctx.lineTo(490, 480); ctx.lineTo(410, 480); ctx.lineTo(260, 0); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(900, 0); ctx.lineTo(1100, 480); ctx.lineTo(1020, 480); ctx.lineTo(840, 0); ctx.fill();

    // En el bioma de cascada (Nivel 3), dibujar cascada animada
    if (levelId === 3) {
      const waterOffset = (Date.now() * 0.1) % 40;
      ctx.fillStyle = 'rgba(6, 182, 212, 0.4)';
      ctx.fillRect(720, 0, 70, 440);
      ctx.fillStyle = '#ffffff';
      for (let y = 0; y < 440; y += 40) {
        ctx.fillRect(725, (y + waterOffset) % 440, 60, 4);
      }
    }
  }

  function drawLevelGoal(gx) {
    ctx.save();
    ctx.translate(gx, 340);

    // Columnas del arco de triunfo
    ctx.fillStyle = '#78350f';
    ctx.fillRect(-28, 0, 14, 100);
    ctx.fillRect(14, 0, 14, 100);

    // Dintel dorado superior
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(-34, -14, 68, 20);

    // Estandarte "META"
    ctx.fillStyle = '#10b981';
    ctx.fillRect(-22, 10, 44, 34);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px "Press Start 2P"';
    ctx.textAlign = 'center';
    ctx.fillText('META', 0, 32);

    ctx.restore();
  }

  // ==========================================================================
  // 11. CONTROLADOR DEL MODAL DE PREGUNTAS MATEMÁTICAS
  // ==========================================================================
  const puzzleOverlay = document.getElementById('math-puzzle-overlay');
  const puzzleQuestionTxt = document.getElementById('puzzle-question-text');
  const puzzleHintTxt = document.getElementById('puzzle-hint-text');
  const puzzleOptionsBox = document.getElementById('puzzle-options-container');
  const puzzleFeedbackMsg = document.getElementById('puzzle-feedback-msg');
  const puzzleLevelBadge = document.getElementById('puzzle-level-badge');
  const puzzleTimerVal = document.getElementById('puzzle-timer-val');
  const puzzleVisualHint = document.getElementById('puzzle-visual-hint');
  const closePuzzleBtn = document.getElementById('close-puzzle-btn');

  let currentInteractingObstacle = null;
  let isPuzzleActive = false;

  function closePuzzleModal() {
    if (!isPuzzleActive) return;
    clearInterval(puzzleTimerInterval);
    if (puzzleOverlay) {
      puzzleOverlay.classList.remove('active');
      puzzleOverlay.classList.add('hidden');
    }
    isPuzzleActive = false;
    if (currentInteractingObstacle) {
      currentInteractingObstacle.cooldown = Date.now() + 2000;
      player.x = Math.max(35, currentInteractingObstacle.x - 55);
    }
  }

  if (closePuzzleBtn) {
    closePuzzleBtn.addEventListener('click', () => {
      audio.playClick();
      closePuzzleModal();
    });
  }

  function triggerMathPuzzle(obstacle) {
    if (isPuzzleActive) return;
    if (!currentLevel || !obstacle || obstacle.solved) return;
    if (obstacle.cooldown && Date.now() < obstacle.cooldown) return;

    isPuzzleActive = true;
    currentInteractingObstacle = obstacle;

    // Frenar al personaje inmediatamente mientras responde
    player.vx = 0;
    player.vy = 0;
    keys.Left = false;
    keys.Right = false;
    keys.Up = false;
    keyboardKeys.Left = false;
    keyboardKeys.Right = false;
    keyboardKeys.Up = false;

    activePuzzle = generateLevelQuestion(currentLevel.id);
    totalLevelQuestionsAsked++;

    puzzleLevelBadge.textContent = `${currentLevel.title} • Reto ${puzzlesSolvedInLevel + 1}/${currentLevel.targetPuzzles}`;
    puzzleQuestionTxt.textContent = activePuzzle.qText;
    puzzleHintTxt.textContent = activePuzzle.qHint;
    puzzleFeedbackMsg.textContent = '';
    puzzleFeedbackMsg.className = 'puzzle-feedback';

    // Construir visualización pedagógica de apoyo (Grupos)
    renderVisualHint(activePuzzle);

    // Opciones
    puzzleOptionsBox.innerHTML = '';
    activePuzzle.options.forEach((optText, idx) => {
      const btn = document.createElement('button');
      btn.className = 'opt-btn';
      btn.textContent = optText;
      btn.addEventListener('click', () => submitAnswer(idx, btn));
      puzzleOptionsBox.appendChild(btn);
    });

    // Temporizador de 30 segundos
    activePuzzleTimer = 30;
    if (puzzleTimerVal) puzzleTimerVal.textContent = activePuzzleTimer;
    clearInterval(puzzleTimerInterval);
    puzzleTimerInterval = setInterval(() => {
      activePuzzleTimer--;
      if (puzzleTimerVal) puzzleTimerVal.textContent = activePuzzleTimer;
      if (activePuzzleTimer <= 0) {
        clearInterval(puzzleTimerInterval);
        submitAnswer(-1, null);
      }
    }, 1000);

    puzzleOverlay.classList.remove('hidden');
    puzzleOverlay.classList.add('active');
  }

  function renderVisualHint(puzzle) {
    if (!puzzleVisualHint) return;
    puzzleVisualHint.innerHTML = '';

    const iconMap = {
      seeds: '🌰',
      vines: '🌿',
      crystals: '💎',
      glyphs: '📜',
      golden_orbs: '👑'
    };
    const icon = iconMap[puzzle.visualType] || '⭐';

    // Si los factores son manejables visualmente (hasta 6 x 8)
    if (puzzle.factorA <= 6 && puzzle.factorB <= 8) {
      for (let g = 0; g < puzzle.factorA; g++) {
        const groupEl = document.createElement('div');
        groupEl.className = 'hint-group-box';
        groupEl.textContent = icon.repeat(puzzle.factorB);
        puzzleVisualHint.appendChild(groupEl);
      }
    } else {
      // Indicador compacto para números más grandes
      const summaryEl = document.createElement('div');
      summaryEl.style.fontSize = '0.9rem';
      summaryEl.style.fontWeight = '700';
      summaryEl.style.color = '#fef08a';
      summaryEl.textContent = `💡 Multiplicación: ${puzzle.factorA} veces el número ${puzzle.factorB}`;
      puzzleVisualHint.appendChild(summaryEl);
    }
  }

  function submitAnswer(chosenIdx, btnElement) {
    clearInterval(puzzleTimerInterval);
    const isCorrect = (chosenIdx === activePuzzle.correctIdx);

    const allBtns = puzzleOptionsBox.querySelectorAll('.opt-btn');
    allBtns.forEach(b => b.style.pointerEvents = 'none');

    if (isCorrect) {
      if (btnElement) btnElement.classList.add('correct');
      puzzleFeedbackMsg.textContent = '🌟 ¡Correcto! +10 Puntos';
      puzzleFeedbackMsg.className = 'puzzle-feedback correct-text';
      audio.playCorrect();

      gameData.score += 10;
      levelScoreEarned += 10;
      puzzlesSolvedInLevel++;

      if (currentInteractingObstacle) {
        currentInteractingObstacle.solved = true;
        addSparkleParticles(currentInteractingObstacle.x, currentInteractingObstacle.y - 10, '#34d399', 20);
      }

      addFloatingText(player.x - cameraX, player.y - 45, "+10 PTS", "#34d399");
    } else {
      if (btnElement) btnElement.classList.add('wrong');
      if (allBtns[activePuzzle.correctIdx]) {
        allBtns[activePuzzle.correctIdx].classList.add('correct');
      }
      puzzleFeedbackMsg.textContent = `❌ ¡Ups! La respuesta era ${activePuzzle.options[activePuzzle.correctIdx]}. −5 Puntos`;
      puzzleFeedbackMsg.className = 'puzzle-feedback wrong-text';
      audio.playWrong();

      gameData.score = Math.max(0, gameData.score - 5);
      levelScoreEarned = Math.max(-50, levelScoreEarned - 5);
      addFloatingText(player.x - cameraX, player.y - 45, "-5 PTS", "#ef4444");

      // Cooldown de 2.5s y alejar ligeramente al jugador para evitar bucle continuo
      if (currentInteractingObstacle) {
        currentInteractingObstacle.cooldown = Date.now() + 2500;
        player.x = Math.max(35, currentInteractingObstacle.x - 55);
      }
    }

    if (gameData.score > gameData.highScore) {
      gameData.highScore = gameData.score;
    }
    saveGameData(gameData);
    updateHUD();

    setTimeout(() => {
      puzzleOverlay.classList.remove('active');
      puzzleOverlay.classList.add('hidden');
      isPuzzleActive = false;

      // Si resolvió todos los acertijos del tablero, transportarlo cerca de la meta
      if (puzzlesSolvedInLevel >= currentLevel.targetPuzzles) {
        player.x = levelGoalX - 20;
      }
    }, 1400);
  }

  // ==========================================================================
  // 12. COMPLETAR NIVEL Y PANTALLA DE RESUMEN
  // ==========================================================================
  const levelSummaryOverlay = document.getElementById('level-summary-overlay');
  const summaryTitle = document.getElementById('summary-title');
  const summaryStars = document.getElementById('summary-stars');
  const summaryScoreEarned = document.getElementById('summary-score-earned');
  const summaryTotalScore = document.getElementById('summary-total-score');
  const summaryAccuracy = document.getElementById('summary-accuracy');
  const nextLevelBtn = document.getElementById('next-level-btn');
  const returnMapBtn = document.getElementById('return-map-btn');

  function startLevel(levelId) {
    currentLevel = LEVEL_CONFIGS.find(l => l.id === levelId);
    levelScoreEarned = 0;
    puzzlesSolvedInLevel = 0;
    totalLevelQuestionsAsked = 0;
    isPuzzleActive = false;
    clearInterval(puzzleTimerInterval);
    if (puzzleOverlay) {
      puzzleOverlay.classList.remove('active');
      puzzleOverlay.classList.add('hidden');
    }
    gameState = 'IN_LEVEL';

    initLevelScene(levelId);
    updateHUD();

    const returnTopBtn = document.getElementById('map-return-top-btn');
    if (returnTopBtn) returnTopBtn.classList.remove('hidden');
  }

  function completeCurrentLevel() {
    gameState = 'LEVEL_COMPLETE';
    audio.playWin();

    const accuracy = totalLevelQuestionsAsked > 0 ? Math.round((puzzlesSolvedInLevel / totalLevelQuestionsAsked) * 100) : 100;
    let stars = 1;
    if (accuracy >= 80) stars = 3;
    else if (accuracy >= 50) stars = 2;

    gameData.levelStars[currentLevel.id] = Math.max(gameData.levelStars[currentLevel.id] || 0, stars);

    if (currentLevel.id + 1 <= 5) {
      gameData.unlockedLevel = Math.max(gameData.unlockedLevel, currentLevel.id + 1);
    }
    saveGameData(gameData);

    summaryTitle.textContent = `¡${currentLevel.title} Conquistado!`;
    summaryStars.textContent = '⭐'.repeat(stars) + '🖤'.repeat(3 - stars);
    summaryScoreEarned.textContent = `+${levelScoreEarned}`;
    summaryTotalScore.textContent = `${gameData.score}`;
    summaryAccuracy.textContent = `${accuracy}%`;

    levelSummaryOverlay.classList.remove('hidden');
    levelSummaryOverlay.classList.add('active');
    updateHUD();
  }

  if (nextLevelBtn) {
    nextLevelBtn.addEventListener('click', () => {
      audio.playClick();
      levelSummaryOverlay.classList.remove('active');
      levelSummaryOverlay.classList.add('hidden');
      if (currentLevel && currentLevel.id < 5) {
        startLevel(currentLevel.id + 1);
      } else {
        returnToMap();
      }
    });
  }

  if (returnMapBtn) {
    returnMapBtn.addEventListener('click', () => {
      audio.playClick();
      levelSummaryOverlay.classList.remove('active');
      levelSummaryOverlay.classList.add('hidden');
      returnToMap();
    });
  }

  function returnToMap() {
    gameState = 'WORLD_MAP';
    currentLevel = null;
    isPuzzleActive = false;
    clearInterval(puzzleTimerInterval);
    if (puzzleOverlay) {
      puzzleOverlay.classList.remove('active');
      puzzleOverlay.classList.add('hidden');
    }
    player.groundY = 420;
    player.y = 420;
    updateHUD();

    const returnTopBtn = document.getElementById('map-return-top-btn');
    if (returnTopBtn) returnTopBtn.classList.add('hidden');
  }

  // ==========================================================================
  // 13. ACTUALIZACIÓN DEL HUD
  // ==========================================================================
  function updateHUD() {
    const hudScore = document.getElementById('hud-score-val');
    const hudHigh = document.getElementById('hud-highscore-val');
    const hudBoard = document.getElementById('hud-board-name');
    const hudLocation = document.getElementById('hud-location-val');

    if (hudScore) hudScore.textContent = gameData.score;
    if (hudHigh) hudHigh.textContent = gameData.highScore;
    if (hudBoard) {
      hudBoard.textContent = currentLevel ? currentLevel.title : 'Mapa del Explorador';
    }
    if (hudLocation) {
      hudLocation.textContent = currentLevel ? `Tablero ${currentLevel.id}` : 'Selva Central';
    }
  }

  // ==========================================================================
  // 14. PANTALLA DE TÍTULO, INSTRUCCIONES Y PREVIEW
  // ==========================================================================
  const titleOverlay = document.getElementById('title-screen-overlay');
  const startGameBtn = document.getElementById('start-game-btn');
  const howToPlayBtn = document.getElementById('how-to-play-btn');
  const resetProgressBtn = document.getElementById('reset-progress-btn');
  const instructionsOverlay = document.getElementById('instructions-overlay');
  const closeInstructionsBtn = document.getElementById('close-instructions-btn');
  const closeInstructionsXBtn = document.getElementById('close-instructions-x-btn');
  const footerHowBtn = document.getElementById('footer-how-btn');
  const footerRestartBtn = document.getElementById('footer-restart-btn');
  const mapReturnTopBtn = document.getElementById('map-return-top-btn');

  if (startGameBtn) {
    startGameBtn.addEventListener('click', () => {
      audio.playClick();
      titleOverlay.classList.remove('active');
      titleOverlay.classList.add('hidden');
      gameState = 'WORLD_MAP';
      updateHUD();
    });
  }

  function showInstructions() {
    audio.playClick();
    instructionsOverlay.classList.remove('hidden');
    instructionsOverlay.classList.add('active');
  }

  function hideInstructions() {
    audio.playClick();
    instructionsOverlay.classList.remove('active');
    instructionsOverlay.classList.add('hidden');
  }

  if (howToPlayBtn) howToPlayBtn.addEventListener('click', showInstructions);
  if (footerHowBtn) footerHowBtn.addEventListener('click', showInstructions);
  if (closeInstructionsBtn) closeInstructionsBtn.addEventListener('click', hideInstructions);
  if (closeInstructionsXBtn) closeInstructionsXBtn.addEventListener('click', hideInstructions);

  if (mapReturnTopBtn) {
    mapReturnTopBtn.addEventListener('click', () => {
      audio.playClick();
      returnToMap();
    });
  }

  if (footerRestartBtn) {
    footerRestartBtn.addEventListener('click', () => {
      if (gameState === 'IN_LEVEL' && currentLevel) {
        if (confirm('¿Deseas reiniciar este tablero?')) {
          startLevel(currentLevel.id);
        }
      }
    });
  }

  if (resetProgressBtn) {
    resetProgressBtn.addEventListener('click', () => {
      if (confirm('¿Seguro que deseas restablecer todo el progreso y las estrellas guardadas?')) {
        gameData = Object.assign({}, defaultData);
        saveGameData(gameData);
        updateHUD();
        alert('¡Progreso restablecido con éxito!');
      }
    });
  }

  // Previsualización animada en la intro
  function renderCharPreview() {
    if (!previewCtx) return;
    previewCtx.clearRect(0, 0, 120, 120);

    if (spriteLoaded && sprite.naturalWidth > 0 && sprite.naturalHeight > 0) {
      const singleFrameWidth = sprite.naturalWidth / TOTAL_FRAMES;
      const singleFrameHeight = sprite.naturalHeight;
      const sx = (frame % TOTAL_FRAMES) * singleFrameWidth;
      const sw = singleFrameWidth;
      const sh = singleFrameHeight;
      const aspectRatio = sw / sh;
      const pHeight = 105;
      const pWidth = pHeight * aspectRatio;

      previewCtx.drawImage(
        sprite,
        sx,
        0,
        sw,
        sh,
        (120 - pWidth) / 2,
        (120 - pHeight) / 2,
        pWidth,
        pHeight
      );
    } else {
      const dummy = new Player();
      dummy.x = 60;
      dummy.y = 80;
      dummy.draw(previewCtx);
    }

    requestAnimationFrame(renderCharPreview);
  }
  renderCharPreview();

  // Controles de Pantalla Completa y Audio
  const fullscreenToggleBtn = document.getElementById('fullscreen-toggle-btn');
  const audioToggleBtn = document.getElementById('audio-toggle-btn');

  if (fullscreenToggleBtn) {
    fullscreenToggleBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => console.warn(err));
      } else {
        document.exitFullscreen().catch(err => console.warn(err));
      }
    });
  }

  if (audioToggleBtn) {
    audioToggleBtn.addEventListener('click', () => {
      audio.enabled = !audio.enabled;
      const icon = document.getElementById('audio-icon');
      if (icon) icon.textContent = audio.enabled ? '🔊' : '🔇';
    });
  }

  // ==========================================================================
  // 15. BUCLE PRINCIPAL DE RENDERIZADO A 60 FPS
  // ==========================================================================
  function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gameState === 'WORLD_MAP' || gameState === 'TITLE') {
      drawWorldMap();
    } else if (gameState === 'IN_LEVEL' || gameState === 'LEVEL_COMPLETE') {
      drawInLevel();
    }

    // Partículas visuales
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= p.decay;

      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      if (p.alpha <= 0) {
        particles.splice(i, 1);
      }
    }

    // Textos flotantes (+10 PTS, etc.)
    for (let i = floatingTexts.length - 1; i >= 0; i--) {
      const ft = floatingTexts[i];
      ft.y += ft.vy;
      ft.alpha -= 0.02;

      ctx.save();
      ctx.globalAlpha = Math.max(0, ft.alpha);
      ctx.fillStyle = ft.color;
      ctx.font = 'bold 18px "Fredoka", sans-serif';
      ctx.fillText(ft.text, ft.x, ft.y);
      ctx.restore();

      if (ft.alpha <= 0) {
        floatingTexts.splice(i, 1);
      }
    }

    requestAnimationFrame(gameLoop);
  }

  updateHUD();
  requestAnimationFrame(gameLoop);

})();
