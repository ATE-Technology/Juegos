/* ==========================================================================
   AVENTURA DE DIVISIONES BÁSICAS - GAME ENGINE, SCROLLING CAMERA & PHYSICS
   (CON RECORTE DINÁMICO EXACTO DEL SPRITE + COLORES CLAROS Y FIGURAS DE SELVA)
   ========================================================================== */

(function () {
  'use strict';

  // --- AUDIO SYNTHESIZER ---
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
      osc.frequency.setValueAtTime(160, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(460, this.ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.15);
    }

    playCorrect() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = freq;
        const startTime = this.ctx.currentTime + idx * 0.08;
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.25, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.25);
      });
    }

    playWrong() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(90, this.ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.25);
    }

    playWin() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      const arpeggio = [440, 554.37, 659.25, 880, 1108.73];
      arpeggio.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.value = freq;
        const startTime = this.ctx.currentTime + i * 0.1;
        gain.gain.setValueAtTime(0.2, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.3);
      });
    }

    playClick() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    }
  }

  const audio = new SoundFx();

  // --- SAVE / RESTORE PROGRESS SYSTEM ---
  const SAVE_KEY = 'DIVISION_JUNGLE_QUEST_DATA_V3';

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
      console.warn('Could not read saved data', e);
    }
    return Object.assign({}, defaultData);
  }

  function saveGameData(data) {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Could not save game data', e);
    }
  }

  let gameData = loadGameData();

  // --- HELPERS MATEMÁTICOS DE DIVISIÓN ---
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

  // --- GENERADOR DE EJERCICIOS DE DIVISIONES PARA LOS 5 NIVELES ---
  function generateLevelQuestion(levelId) {
    let qText = "";
    let qHint = "";
    let options = [];
    let correctIdx = 0;
    let dividend = 0;
    let divisor = 1;
    let answer = 0;

    if (levelId === 1) {
      // Nivel 1: Repartos exactos básicos (divisores entre 2, 3, 4, 5 y dividendos hasta 20)
      divisor = getRandomInt(2, 5);
      answer = getRandomInt(2, 4);
      dividend = divisor * answer;

      qText = `¿Cuánto es ${dividend} ÷ ${divisor}?`;
      qHint = `Si repartes ${dividend} objetos en ${divisor} grupos iguales, ¿cuántos quedan en cada uno?`;
    } else if (levelId === 2) {
      // Nivel 2: Tablas de multiplicar del 3 al 6 (dividendos hasta 36)
      divisor = getRandomInt(3, 6);
      answer = getRandomInt(3, 6);
      dividend = divisor * answer;

      qText = `¿Cuánto es ${dividend} ÷ ${divisor}?`;
      qHint = `Busca qué número multiplicado por ${divisor} da como resultado ${dividend}.`;
    } else if (levelId === 3) {
      // Nivel 3: Tablas del 6 al 8 (dividendos hasta 64)
      divisor = getRandomInt(6, 8);
      answer = getRandomInt(4, 8);
      dividend = divisor * answer;

      qText = `¿Cuánto es ${dividend} ÷ ${divisor}?`;
      qHint = `Recuerda: la división es la operación inversa de la multiplicación (${divisor} × ? = ${dividend}).`;
    } else if (levelId === 4) {
      // Nivel 4: Tablas del 7 al 9 (dividendos hasta 81)
      divisor = getRandomInt(7, 9);
      answer = getRandomInt(5, 9);
      dividend = divisor * answer;

      qText = `Desafío del Templo: ¿Cuánto es ${dividend} ÷ ${divisor}?`;
      qHint = `¡Concentración! ${divisor} multiplicado por el número correcto te dará ${dividend}.`;
    } else {
      // Nivel 5: Batalla contra el Guardián - Decenas y números grandes
      const mode = getRandomInt(1, 3);
      if (mode === 1) {
        const divisorsList = [2, 3, 4, 5, 6];
        divisor = divisorsList[getRandomInt(0, divisorsList.length - 1)];
        answer = getRandomInt(15, 25);
        dividend = divisor * answer;
      } else if (mode === 2) {
        divisor = getRandomInt(4, 8);
        answer = getRandomInt(6, 12);
        dividend = divisor * answer;
        qText = `La expedición tiene ${dividend} gemas para repartir en ${divisor} mochilas: ¿Cuántas van en cada una?`;
        qHint = `Divide ${dividend} entre ${divisor} en partes iguales.`;
      } else {
        divisor = getRandomInt(6, 9);
        answer = getRandomInt(7, 12);
        dividend = divisor * answer;
      }

      if (!qText) {
        qText = `Batalla Final del Guardián: ¿Cuánto es ${dividend} ÷ ${divisor}?`;
        qHint = `¡Calcula rápido! Divide ${dividend} entre ${divisor}.`;
      }
    }

    const ansStr = String(answer);
    const optSet = new Set([ansStr]);
    while (optSet.size < 4) {
      const delta = getRandomInt(-3, 3);
      let fake = answer + delta;
      if (fake <= 0 || fake === answer) fake = answer + getRandomInt(4, 6);
      optSet.add(String(fake));
    }
    options = shuffleArray(Array.from(optSet));
    correctIdx = options.indexOf(ansStr);

    return { qText, qHint, options, correctIdx };
  }

  // --- CANVAS & SCROLLING CAMERA ENGINE SETUP ---
  const canvas = document.getElementById('game-canvas');
  const ctx = canvas.getContext('2d');
  const charPreviewCanvas = document.getElementById('char-preview-canvas');
  const previewCtx = charPreviewCanvas ? charPreviewCanvas.getContext('2d') : null;

  window.focus();
  if (canvas) canvas.focus();

  const WORLD_MAP_WIDTH = 2200;
  let cameraX = 0;

  // 5 Santuarios en el Mapa
  const LEVEL_CONFIGS = [
    { id: 1, title: 'Santuario Ancestral del Reparto', topic: 'Reparto básico (÷2 a ÷5)', targetPuzzles: 3, xMap: 280 },
    { id: 2, title: 'Paso de las Tablas Medias', topic: 'Tablas del 3 al 6', targetPuzzles: 4, xMap: 680 },
    { id: 3, title: 'Cascada de la División', topic: 'Tablas del 6 al 8', targetPuzzles: 4, xMap: 1080 },
    { id: 4, title: 'Templo de las Divisiones Mayores', topic: 'Tablas del 7 al 9', targetPuzzles: 5, xMap: 1480 },
    { id: 5, title: 'Batalla contra el Guardián de las Divisiones', topic: 'Decenas y Desafío Maestro', targetPuzzles: 5, xMap: 1880 }
  ];

  let gameState = 'TITLE';
  let currentLevel = null;
  let levelScoreEarned = 0;
  let puzzlesSolvedInLevel = 0;
  let totalLevelQuestionsAsked = 0;
  let activePuzzle = null;
  let activePuzzleTimer = 0;
  let puzzleTimerInterval = null;

  const floatingTexts = [];

  function addFloatingText(x, y, text, color) {
    floatingTexts.push({
      x: x,
      y: y,
      text: text,
      color: color,
      alpha: 1.0,
      vy: -1.5
    });
  }

  // --- SPRITE SHEET INTEGRATION (explorer_walk.png) ---
  const sprite = new Image();
  sprite.src = 'explorer_walk.png';

  const TOTAL_FRAMES = 6;
  let frame = 0;
  let spriteLoaded = false;

  sprite.onload = () => {
    spriteLoaded = true;
  };

  setInterval(() => {
    if (Math.abs(player.vx) > 0.1 || !player.isGrounded) {
      frame = (frame + 1) % TOTAL_FRAMES;
    } else {
      frame = 0;
    }
  }, 100);

  // --- PLAYER ENTITY & PHYSICS ENGINE ---
  class Player {
    constructor() {
      this.x = gameData.mapPlayerX || 140;
      this.y = 420;
      this.width = 44;
      this.height = 56;
      this.vx = 0;
      this.vy = 0;
      this.speed = 5.5;
      this.jumpPower = -12.5;
      this.gravity = 0.6;
      this.groundY = 420;
      this.isGrounded = true;
      this.facingRight = true;
      this.walkTimer = 0;
    }

    update(mapLimitWidth, platforms = []) {
      this.x += this.vx;

      if (this.x < 30) this.x = 30;
      if (this.x > mapLimitWidth - 30) this.x = mapLimitWidth - 30;

      this.vy += this.gravity;
      this.y += this.vy;

      let groundedOnPlatform = false;

      platforms.forEach(p => {
        if (this.x + 15 > p.x && this.x - 15 < p.x + p.w) {
          if (this.y >= p.y - 30 && this.y - this.vy <= p.y - 20 && this.vy >= 0) {
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

      if (Math.abs(this.vx) > 0.1 && this.isGrounded) {
        this.walkTimer += 0.25;
        if (this.walkTimer > Math.PI * 2) this.walkTimer = 0;
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
        // Sombra en el suelo justo debajo del personaje
        c.fillStyle = 'rgba(0,0,0,0.3)';
        c.beginPath();
        c.ellipse(0, 24, 18, 6, 0, 0, Math.PI * 2);
        c.fill();

        // Cálculo exacto del ancho de un solo fotograma dividiendo el ancho total entre 6
        const singleFrameWidth = sprite.naturalWidth / TOTAL_FRAMES;
        const singleFrameHeight = sprite.naturalHeight;

        // Corte milimétrico: (frame % 6) * ancho individual
        const currentFrameIndex = frame % TOTAL_FRAMES;
        const sx = currentFrameIndex * singleFrameWidth;
        const sy = 0;
        const sw = singleFrameWidth;
        const sh = singleFrameHeight;

        // Mantener la proporción original sin distorsiones
        const aspectRatio = sw / sh;
        const renderHeight = 135;
        const renderWidth = renderHeight * aspectRatio;

        c.drawImage(
          sprite,
          sx,
          sy,
          sw,
          sh,
          -renderWidth / 2,
          -renderHeight + 22,
          renderWidth,
          renderHeight
        );
      } else {
        // Fallback procedural
        const legOffset = Math.sin(this.walkTimer) * 9;
        const armOffset = Math.cos(this.walkTimer) * 7;

        c.fillStyle = 'rgba(0,0,0,0.3)';
        c.beginPath();
        c.ellipse(0, 24, 18, 6, 0, 0, Math.PI * 2);
        c.fill();

        c.fillStyle = '#2d1b0d';
        c.fillRect(-12 + legOffset, 12, 10, 12);
        c.fillRect(2 - legOffset, 12, 10, 12);

        c.fillStyle = '#c68b59';
        c.fillRect(-12 + legOffset, 2, 10, 12);
        c.fillRect(2 - legOffset, 2, 10, 12);

        c.fillStyle = '#d9a05b';
        c.fillRect(-14, -18, 28, 22);

        c.fillStyle = '#8b5a2b';
        c.fillRect(-20, -16, 8, 16);

        c.fillStyle = '#d9a05b';
        c.fillRect(-16, -14 - armOffset, 6, 14);
        c.fillRect(10, -14 + armOffset, 6, 14);

        c.fillStyle = '#f5c396';
        c.beginPath();
        c.arc(0, -28, 12, 0, Math.PI * 2);
        c.fill();

        c.fillStyle = '#5c4028';
        c.beginPath();
        c.ellipse(0, -35, 18, 5, 0, 0, Math.PI * 2);
        c.fill();
        c.fillRect(-10, -44, 20, 10);
        c.fillStyle = '#ffea00';
        c.fillRect(-10, -36, 20, 3);

        c.fillStyle = '#111';
        c.fillRect(3, -30, 3, 3);
      }

      c.restore();
    }
  }

  const player = new Player();

  // --- DIBUJADORES DE FIGURAS DE SELVA (JUNGLE ART) ---
  function drawPalmTree(c, x, y, scale = 1) {
    c.save();
    c.translate(x, y);
    c.scale(scale, scale);

    // Tronco curvado de palmera
    c.strokeStyle = '#8d5524';
    c.lineWidth = 14;
    c.lineCap = 'round';
    c.beginPath();
    c.moveTo(0, 0);
    c.quadraticCurveTo(15, -90, -10, -180);
    c.stroke();

    // Textura de anillos del tronco
    c.strokeStyle = '#633917';
    c.lineWidth = 3;
    for (let i = 20; i < 170; i += 22) {
      c.beginPath();
      c.moveTo(5 - i * 0.08, -i);
      c.lineTo(16 - i * 0.08, -i + 4);
      c.stroke();
    }

    // Racimo de cocos
    c.fillStyle = '#5a3818';
    c.beginPath();
    c.arc(-8, -178, 6, 0, Math.PI * 2);
    c.arc(-14, -174, 5, 0, Math.PI * 2);
    c.arc(-3, -174, 5, 0, Math.PI * 2);
    c.fill();

    // Hojas de palmera tropical (en abanico con tonos dorados y terracota de atardecer)
    const frondAngles = [-150, -115, -75, -35, 5, 45];
    frondAngles.forEach(ang => {
      c.save();
      c.translate(-10, -180);
      c.rotate((ang * Math.PI) / 180);

      // Hoja
      c.fillStyle = '#c0392b';
      c.beginPath();
      c.moveTo(0, 0);
      c.quadraticCurveTo(45, -25, 95, 0);
      c.quadraticCurveTo(45, 25, 0, 0);
      c.fill();

      // Centro dorado de la hoja
      c.strokeStyle = '#f39c12';
      c.lineWidth = 2.5;
      c.beginPath();
      c.moveTo(0, 0);
      c.lineTo(85, 0);
      c.stroke();

      c.restore();
    });

    c.restore();
  }

  function drawMonsteraLeaf(c, x, y, size = 28, angle = 0) {
    c.save();
    c.translate(x, y);
    c.rotate((angle * Math.PI) / 180);
    c.fillStyle = '#d35400';
    c.beginPath();
    c.ellipse(0, -size / 2, size / 3, size / 2, 0, 0, Math.PI * 2);
    c.fill();
    c.strokeStyle = '#f1c40f';
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
      const h = height - idx * 15;
      c.fillStyle = '#e67e22';
      c.fillRect(cx - 3, -h, 6, h);

      // Nudos de bambú
      c.fillStyle = '#ffd166';
      for (let step = 20; step < h; step += 25) {
        c.fillRect(cx - 5, -step, 10, 3);
      }
    });
    c.restore();
  }

  // --- KEYBOARD & TOUCH MULTI-KEY STATE TRACKING ---
  const keys = { Left: false, Right: false, Up: false, Enter: false };
  const keyboardKeys = { Left: false, Right: false, Up: false };
  const touchPointers = { Left: new Set(), Right: new Set(), Up: new Set() };
  const touchPointerKeys = new Map();

  function updatePlayerVelocity() {
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
    keys.Left = keyboardKeys.Left || touchPointers.Left.size > 0;
    keys.Right = keyboardKeys.Right || touchPointers.Right.size > 0;
    keys.Up = keyboardKeys.Up || touchPointers.Up.size > 0;
    updatePlayerVelocity();
  }

  function startJump() {
    if (player.isGrounded && !keys.Up) {
      player.vy = player.jumpPower;
      player.isGrounded = false;
      audio.playJump();
    }
  }

  document.querySelectorAll('[data-touch-control]').forEach((button) => {
    const control = button.dataset.touchControl;
    const key = { left: 'Left', right: 'Right', jump: 'Up' }[control];

    button.addEventListener('pointerdown', (event) => {
      event.preventDefault();

      if (control === 'enter') {
        handleEnterKeyPress();
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
        handleEnterKeyPress();
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

  function handleEnterKeyPress() {
    if (gameState === 'WORLD_MAP') {
      const nearLevel = LEVEL_CONFIGS.find(cfg => Math.abs(player.x - cfg.xMap) < 55);
      if (nearLevel) {
        if (nearLevel.id <= gameData.unlockedLevel) {
          audio.playClick();
          startLevel(nearLevel.id);
        } else {
          audio.playWrong();
          addFloatingText(player.x, player.y - 40, "¡Santuario Bloqueado!", "#ff8fa3");
        }
      }
    }
  }

  // --- RENDERING SCROLLING WORLD MAP (CLARO, CÁLIDO Y CON FIGURAS DE SELVA) ---
  function drawWorldMap() {
    const targetCamX = player.x - canvas.width / 2;
    cameraX += (targetCamX - cameraX) * 0.1;
    cameraX = Math.max(0, Math.min(WORLD_MAP_WIDTH - canvas.width, cameraX));

    ctx.save();
    ctx.translate(-Math.round(cameraX), 0);

    // 1. Cielo Luminoso y Cálido de Atardecer Dorado en la Selva
    const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    skyGrad.addColorStop(0, '#3e1e58');    // Violeta crepuscular superior
    skyGrad.addColorStop(0.35, '#8c2d5d'); // Coral magenta cálido
    skyGrad.addColorStop(0.65, '#d35400'); // Naranja atardecer
    skyGrad.addColorStop(0.9, '#f39c12');  // Ámbar brillante
    skyGrad.addColorStop(1, '#ffd166');    // Dorado radiante
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, WORLD_MAP_WIDTH, canvas.height);

    // 2. Gran Sol Poniente Cálido y Resplandeciente
    ctx.save();
    ctx.fillStyle = 'rgba(255, 234, 167, 0.25)';
    ctx.beginPath();
    ctx.arc(880, 240, 160, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fff4cc';
    ctx.beginPath();
    ctx.arc(880, 240, 75, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 3. Siluetas de Aves Tropicales Volando en el Cielo
    ctx.strokeStyle = '#5a2243';
    ctx.lineWidth = 2.5;
    for (let bx = 180; bx < WORLD_MAP_WIDTH; bx += 380) {
      ctx.beginPath();
      ctx.arc(bx, 90, 12, Math.PI, Math.PI * 1.8);
      ctx.arc(bx + 20, 90, 12, Math.PI * 1.2, Math.PI * 2);
      ctx.stroke();
    }

    // 4. Montañas Triangulares en Degradados Cálidos de Terracota y Amatista
    ctx.fillStyle = '#582458';
    for (let x = 0; x < WORLD_MAP_WIDTH; x += 280) {
      ctx.beginPath();
      ctx.moveTo(x, 460);
      ctx.lineTo(x + 140, 190);
      ctx.lineTo(x + 280, 460);
      ctx.fill();
    }

    // Cordillera media
    ctx.fillStyle = '#7a3258';
    for (let x = 80; x < WORLD_MAP_WIDTH + 200; x += 260) {
      ctx.beginPath();
      ctx.moveTo(x, 460);
      ctx.lineTo(x + 130, 230);
      ctx.lineTo(x + 260, 460);
      ctx.fill();
    }

    // 5. Marquesina Superior de Selva con Lianas Colgantes y Flores
    ctx.fillStyle = '#2d143c';
    for (let x = -50; x < WORLD_MAP_WIDTH + 100; x += 85) {
      ctx.beginPath();
      ctx.arc(x, 70, 75, 0, Math.PI * 2);
      ctx.fill();
    }

    // Lianas colgantes con orquídeas y flores
    ctx.strokeStyle = '#e67e22';
    ctx.lineWidth = 3;
    for (let lx = 60; lx < WORLD_MAP_WIDTH; lx += 140) {
      ctx.beginPath();
      ctx.moveTo(lx, 100);
      ctx.quadraticCurveTo(lx + 15, 150, lx + 5, 200);
      ctx.stroke();

      // Flor exótica en la punta de la liana
      ctx.fillStyle = '#ff7675';
      ctx.beginPath();
      ctx.arc(lx + 5, 203, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffd166';
      ctx.beginPath();
      ctx.arc(lx + 5, 203, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // 6. Palmeras Tropicales a lo largo del Mapa
    drawPalmTree(ctx, 110, 440, 0.85);
    drawPalmTree(ctx, 480, 440, 0.9);
    drawPalmTree(ctx, 890, 440, 0.95);
    drawPalmTree(ctx, 1300, 440, 0.88);
    drawPalmTree(ctx, 1720, 440, 0.92);
    drawPalmTree(ctx, 2080, 440, 0.85);

    // 7. Cañas de Bambú Tropical Decorativas
    drawBambooCluster(ctx, 220, 440, 95);
    drawBambooCluster(ctx, 620, 440, 90);
    drawBambooCluster(ctx, 1020, 440, 105);
    drawBambooCluster(ctx, 1420, 440, 95);
    drawBambooCluster(ctx, 1820, 440, 100);

    // 8. Camino de Madera / Tierra Cálida
    ctx.strokeStyle = '#78431e';
    ctx.lineWidth = 32;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(80, 440);
    ctx.lineTo(500, 440);
    ctx.lineTo(900, 440);
    ctx.lineTo(1300, 440);
    ctx.lineTo(1700, 440);
    ctx.lineTo(2120, 440);
    ctx.stroke();

    ctx.strokeStyle = '#d4976a'; // Centro iluminado claro
    ctx.lineWidth = 18;
    ctx.stroke();

    // Hojas de selva decorando el borde del camino
    for (let fx = 100; fx < WORLD_MAP_WIDTH; fx += 190) {
      drawMonsteraLeaf(ctx, fx, 448, 24, -20);
      drawMonsteraLeaf(ctx, fx + 28, 448, 20, 30);
    }

    // 9. Los 5 Santuarios / Portales con Enredaderas
    let nearInteractable = false;

    LEVEL_CONFIGS.forEach((cfg) => {
      const isUnlocked = cfg.id <= gameData.unlockedLevel;
      const isNear = isUnlocked && Math.abs(player.x - cfg.xMap) < 55;
      if (isNear) nearInteractable = true;

      const stars = gameData.levelStars[cfg.id] || 0;

      ctx.save();
      ctx.translate(cfg.xMap, 370);

      // Estructura de piedra del Santuario (Piedra arenisca cálida / terracota)
      ctx.fillStyle = isUnlocked ? '#b95a28' : '#3d2847';
      ctx.fillRect(-35, -55, 70, 75);

      ctx.fillStyle = isUnlocked ? '#d9743a' : '#52345e';
      ctx.fillRect(-42, -72, 84, 20);

      // Enredadera trepando por la pared del santuario
      ctx.strokeStyle = '#f39c12';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(-33, 10);
      ctx.quadraticCurveTo(-20, -25, -30, -50);
      ctx.stroke();

      // Puerta arqueada amarilla brillante con texto L1, L2, etc.
      ctx.fillStyle = isUnlocked ? '#ffea00' : '#1e1425';
      ctx.beginPath();
      ctx.arc(0, -12, 20, Math.PI, 0);
      ctx.fillRect(-20, -12, 40, 32);
      ctx.fill();

      if (isUnlocked) {
        ctx.fillStyle = '#2d1400';
        ctx.font = 'bold 16px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillText(`L${cfg.id}`, 0, 10);

        ctx.font = '14px sans-serif';
        const starStr = '⭐'.repeat(stars) + '🖤'.repeat(3 - stars);
        ctx.fillText(starStr, 0, -82);
      } else {
        ctx.fillStyle = '#bdc3c7';
        ctx.font = '22px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🔒', 0, 10);
      }

      // Título claro del Santuario debajo
      ctx.fillStyle = isUnlocked ? '#ffffff' : '#a498b0';
      ctx.font = 'bold 13px "Fredoka", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(cfg.title, 0, 42);

      // Marco dorado de selección
      if (isNear) {
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 3.5;
        ctx.strokeRect(-46, -78, 92, 128);
      }

      ctx.restore();
    });

    const promptBadge = document.getElementById('map-prompt-badge');
    if (promptBadge) {
      if (nearInteractable) promptBadge.classList.remove('hidden');
      else promptBadge.classList.add('hidden');
    }

    gameData.mapPlayerX = Math.round(player.x);

    player.update(WORLD_MAP_WIDTH);
    player.draw(ctx);

    ctx.restore();
  }

  // --- RENDERING IN-LEVEL INTERIOR JUNGLE (CLARO Y CON OBSTÁCULOS DE SELVA) ---
  let levelPlatforms = [];
  let levelCheckpoints = [];
  let levelGoalX = 1400;

  function initLevelPlatforms(levelId) {
    player.x = 80;
    player.y = 380;
    player.groundY = 380;
    levelPlatforms = [
      { x: 0, y: 440, w: 1600, h: 140 }, // Suelo
      { x: 240, y: 340, w: 150, h: 22 },  // Plataforma 1
      { x: 480, y: 260, w: 150, h: 22 },  // Plataforma 2
      { x: 740, y: 340, w: 150, h: 22 },  // Plataforma 3
      { x: 1000, y: 260, w: 150, h: 22 }  // Plataforma 4
    ];

    levelCheckpoints = [
      { x: 315, y: 300, solved: false, id: 1 },
      { x: 555, y: 220, solved: false, id: 2 },
      { x: 815, y: 300, solved: false, id: 3 },
      { x: 1075, y: 220, solved: false, id: 4 }
    ];

    levelGoalX = 1400;
  }

  function drawInLevel() {
    const levelCamX = Math.max(0, Math.min(1600 - canvas.width, player.x - canvas.width / 2));

    ctx.save();
    ctx.translate(-Math.round(levelCamX), 0);

    // Fondo claro con rayos de sol cálido filtrándose entre los árboles
    const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    bgGrad.addColorStop(0, '#361b47');
    bgGrad.addColorStop(0.5, '#5c2d58');
    bgGrad.addColorStop(0.85, '#8c4852');
    bgGrad.addColorStop(1, '#a65b57');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1600, canvas.height);

    // Rayos de sol de selva
    ctx.fillStyle = 'rgba(255, 234, 167, 0.12)';
    ctx.beginPath();
    ctx.moveTo(300, 0); ctx.lineTo(460, 480); ctx.lineTo(390, 480); ctx.lineTo(250, 0); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(850, 0); ctx.lineTo(1050, 480); ctx.lineTo(970, 480); ctx.lineTo(790, 0); ctx.fill();

    // Lianas y hojas gigantes en el nivel
    ctx.fillStyle = 'rgba(74, 30, 78, 0.45)';
    for (let i = 50; i < 1600; i += 130) {
      ctx.beginPath();
      ctx.arc(i, 80, 65, 0, Math.PI);
      ctx.fill();
    }

    // Plataformas de madera y roca esculpida
    levelPlatforms.forEach(p => {
      ctx.fillStyle = '#5c2c28';
      ctx.fillRect(p.x, p.y, p.w, p.h);

      // Borde superior iluminado de madera
      ctx.fillStyle = '#e67e22';
      ctx.fillRect(p.x, p.y, p.w, 6);

      // Hojas tropicales decorando las plataformas
      drawMonsteraLeaf(ctx, p.x + 15, p.y + 4, 16, -15);
      drawMonsteraLeaf(ctx, p.x + p.w - 15, p.y + 4, 16, 15);
    });

    // Checkpoints de división ('?')
    levelCheckpoints.forEach(cp => {
      ctx.save();
      ctx.translate(cp.x, cp.y);

      if (cp.solved) {
        ctx.fillStyle = '#4ade80';
        ctx.font = '24px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('✨✅', 0, 0);
      } else {
        // Moneda / Gema dorada de división
        ctx.fillStyle = '#ffea00';
        ctx.beginPath();
        ctx.arc(0, 0, 20, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#d35400';
        ctx.beginPath();
        ctx.arc(0, 0, 16, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillText('÷', 0, 6);
      }
      ctx.restore();

      if (!cp.solved && Math.abs(player.x - cp.x) < 35 && Math.abs(player.y - cp.y) < 60) {
        cp.solved = true;
        triggerMathPuzzle();
      }
    });

    // Portal de meta ancestral
    ctx.fillStyle = '#f1c40f';
    ctx.fillRect(levelGoalX - 25, 340, 50, 100);
    ctx.fillStyle = '#2c1400';
    ctx.font = 'bold 14px "Press Start 2P"';
    ctx.textAlign = 'center';
    ctx.fillText('GOAL', levelGoalX, 390);

    player.update(1600, levelPlatforms);
    player.draw(ctx);

    ctx.restore();

    if (player.x >= levelGoalX - 30 && puzzlesSolvedInLevel >= 1) {
      completeCurrentLevel();
    }
  }

  // --- MATH PUZZLE OVERLAY CONTROLLER ---
  const puzzleOverlay = document.getElementById('math-puzzle-overlay');
  const puzzleQuestionTxt = document.getElementById('puzzle-question-text');
  const puzzleHintTxt = document.getElementById('puzzle-hint-text');
  const puzzleOptionsBox = document.getElementById('puzzle-options-container');
  const puzzleFeedbackMsg = document.getElementById('puzzle-feedback-msg');
  const puzzleLevelBadge = document.getElementById('puzzle-level-badge');
  const puzzleTimerVal = document.getElementById('puzzle-timer-val');

  function triggerMathPuzzle() {
    if (!currentLevel) return;

    activePuzzle = generateLevelQuestion(currentLevel.id);
    totalLevelQuestionsAsked++;

    puzzleLevelBadge.textContent = `${currentLevel.title} - Pregunta ${puzzlesSolvedInLevel + 1}/${currentLevel.targetPuzzles}`;
    puzzleQuestionTxt.textContent = activePuzzle.qText;
    puzzleHintTxt.textContent = activePuzzle.qHint;
    puzzleFeedbackMsg.textContent = '';
    puzzleFeedbackMsg.className = 'puzzle-feedback';

    puzzleOptionsBox.innerHTML = '';
    activePuzzle.options.forEach((optText, idx) => {
      const btn = document.createElement('button');
      btn.className = 'opt-btn';
      btn.textContent = optText;
      btn.addEventListener('click', () => submitAnswer(idx, btn));
      puzzleOptionsBox.appendChild(btn);
    });

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

  function submitAnswer(chosenIdx, btnElement) {
    clearInterval(puzzleTimerInterval);
    const isCorrect = (chosenIdx === activePuzzle.correctIdx);

    const allBtns = puzzleOptionsBox.querySelectorAll('.opt-btn');
    allBtns.forEach(b => b.style.pointerEvents = 'none');

    if (isCorrect) {
      if (btnElement) btnElement.classList.add('correct');
      puzzleFeedbackMsg.textContent = '🌟 ¡Correcto! +10 Puntos!';
      puzzleFeedbackMsg.className = 'puzzle-feedback correct-text';
      audio.playCorrect();

      gameData.score += 10;
      levelScoreEarned += 10;
      puzzlesSolvedInLevel++;
      addFloatingText(player.x - cameraX, player.y - 50, "+10 PTS", "#4ade80");
    } else {
      if (btnElement) btnElement.classList.add('wrong');
      if (allBtns[activePuzzle.correctIdx]) {
        allBtns[activePuzzle.correctIdx].classList.add('correct');
      }
      puzzleFeedbackMsg.textContent = '❌ ¡Incorrecto! −5 Puntos.';
      puzzleFeedbackMsg.className = 'puzzle-feedback wrong-text';
      audio.playWrong();

      gameData.score = Math.max(0, gameData.score - 5);
      levelScoreEarned = Math.max(-50, levelScoreEarned - 5);
      addFloatingText(player.x - cameraX, player.y - 50, "-5 PTS", "#f87171");
    }

    if (gameData.score > gameData.highScore) {
      gameData.highScore = gameData.score;
    }
    saveGameData(gameData);
    updateHUD();

    setTimeout(() => {
      puzzleOverlay.classList.remove('active');
      puzzleOverlay.classList.add('hidden');

      if (puzzlesSolvedInLevel >= currentLevel.targetPuzzles) {
        player.x = levelGoalX - 20;
      }
    }, 1400);
  }

  // --- LEVEL COMPLETION & SUMMARY ---
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
    gameState = 'IN_LEVEL';

    initLevelPlatforms(levelId);
    updateHUD();
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

    summaryTitle.textContent = `¡${currentLevel.title} Superado!`;
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
    player.groundY = 420;
    player.y = 420;
    updateHUD();
  }

  // --- HUD UPDATER ---
  function updateHUD() {
    const hudScore = document.getElementById('hud-score-val');
    const hudHigh = document.getElementById('hud-highscore-val');
    const hudLevel = document.getElementById('hud-level-title');

    if (hudScore) hudScore.textContent = gameData.score;
    if (hudHigh) hudHigh.textContent = gameData.highScore;
    if (hudLevel) {
      hudLevel.textContent = currentLevel ? currentLevel.title : 'Jungle Map';
    }
  }

  // --- TITLE SCREEN & PREVIEW ---
  const titleOverlay = document.getElementById('title-screen-overlay');
  const startGameBtn = document.getElementById('start-game-btn');
  const howToPlayBtn = document.getElementById('how-to-play-btn');
  const resetProgressBtn = document.getElementById('reset-progress-btn');
  const instructionsOverlay = document.getElementById('instructions-overlay');
  const closeInstructionsBtn = document.getElementById('close-instructions-btn');

  if (startGameBtn) {
    startGameBtn.addEventListener('click', () => {
      audio.playClick();
      titleOverlay.classList.remove('active');
      titleOverlay.classList.add('hidden');
      gameState = 'WORLD_MAP';
      updateHUD();
    });
  }

  if (howToPlayBtn) {
    howToPlayBtn.addEventListener('click', () => {
      audio.playClick();
      instructionsOverlay.classList.remove('hidden');
      instructionsOverlay.classList.add('active');
    });
  }

  if (closeInstructionsBtn) {
    closeInstructionsBtn.addEventListener('click', () => {
      audio.playClick();
      instructionsOverlay.classList.remove('active');
      instructionsOverlay.classList.add('hidden');
    });
  }

  if (resetProgressBtn) {
    resetProgressBtn.addEventListener('click', () => {
      if (confirm('¿Estás seguro de que deseas restablecer todo el progreso y las puntuaciones?')) {
        gameData = Object.assign({}, defaultData);
        saveGameData(gameData);
        updateHUD();
        alert('¡Progreso restablecido correctamente!');
      }
    });
  }

  let previewAnimTimer = 0;
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
      const pHeight = 100;
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
      previewAnimTimer += 0.05;
      const hoverY = Math.sin(previewAnimTimer) * 4;

      const dummyPlayer = new Player();
      dummyPlayer.x = 60;
      dummyPlayer.y = 80 + hoverY;
      dummyPlayer.draw(previewCtx);
    }

    requestAnimationFrame(renderCharPreview);
  }
  renderCharPreview();

  // --- FULL-SCREEN & CLOSE CONTROLLERS ---
  const gameModalOverlay = document.getElementById('game-modal-overlay');
  const closeGameBtn = document.getElementById('close-game-btn');
  const footerCloseBtn = document.getElementById('footer-close-btn');
  const fullscreenToggleBtn = document.getElementById('fullscreen-toggle-btn');
  const audioToggleBtn = document.getElementById('audio-toggle-btn');

  function closeGameView() {
    if (gameModalOverlay) {
      gameModalOverlay.classList.add('hidden');
    }
  }

  if (closeGameBtn) closeGameBtn.addEventListener('click', closeGameView);
  if (footerCloseBtn) footerCloseBtn.addEventListener('click', closeGameView);

  if (gameModalOverlay) {
    gameModalOverlay.addEventListener('click', (e) => {
      if (e.target === gameModalOverlay) {
        closeGameView();
      }
    });
  }

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

  // --- MAIN 60FPS GAME LOOP ---
  function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gameState === 'WORLD_MAP' || gameState === 'TITLE') {
      drawWorldMap();
    } else if (gameState === 'IN_LEVEL' || gameState === 'LEVEL_COMPLETE') {
      drawInLevel();
    }

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