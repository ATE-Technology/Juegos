/* ==========================================================================
   PRIME JUNGLE QUEST - GAME ENGINE, SCROLLING CAMERA & PHYSICS
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
  const SAVE_KEY = 'PRIME_JUNGLE_QUEST_DATA_V1';

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

  // --- MATH HELPER & PRIME LOGIC ---
  function isPrime(num) {
    if (num <= 1) return false;
    if (num <= 3) return true;
    if (num % 2 === 0 || num % 3 === 0) return false;
    for (let i = 5; i * i <= num; i += 6) {
      if (num % i === 0 || num % (i + 2) === 0) return false;
    }
    return true;
  }

  function getPrimeFactors(n) {
    const factors = [];
    let d = 2;
    while (n >= 2) {
      if (n % d === 0) {
        factors.push(d);
        n = n / d;
      } else {
        d++;
      }
    }
    return factors;
  }

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function getRandomPrime(min, max) {
    let p = getRandomInt(min, max);
    while (!isPrime(p)) {
      p = getRandomInt(min, max);
    }
    return p;
  }

  function getRandomComposite(min, max) {
    let c = getRandomInt(min, max);
    while (isPrime(c) || c <= 1) {
      c = getRandomInt(min, max);
    }
    return c;
  }

  function shuffleArray(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // --- QUESTION GENERATOR FOR 5 LEVELS ---
  function generateLevelQuestion(levelId) {
    let qText = "";
    let qHint = "";
    let options = [];
    let correctIdx = 0;

    if (levelId === 1) {
      // Level 1: Primality Testing
      const isTestPrime = Math.random() > 0.4;
      const val = isTestPrime ? getRandomPrime(2, 50) : getRandomComposite(4, 50);
      qText = `Es ${val} un número primo?`;
      qHint = `Un número primo solo puede ser dividido por 1 y por si mismo`;
      options = ["SÍ - Es un número primo! 🌟", "NO - Es un número compuesto ❌"];
      correctIdx = isPrime(val) ? 0 : 1;
    } else if (levelId === 2) {
      // Level 2: Prime Sequences
      const primesList = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59];
      const startIdx = getRandomInt(0, primesList.length - 4);
      const missingRel = getRandomInt(1, 2);
      const seq = [primesList[startIdx], primesList[startIdx + 1], primesList[startIdx + 2], primesList[startIdx + 3]];
      const targetAns = seq[missingRel];
      seq[missingRel] = "❓";

      qText = `Encuentra el número primo que falta: [ ${seq.join(', ')} ]`;
      qHint = `¡Busca el número primo que pertenece a la secuencia!`;

      const wrg1 = targetAns + (Math.random() > 0.5 ? 2 : -2);
      const wrg2 = targetAns + (Math.random() > 0.5 ? 4 : -4);
      const wrg3 = targetAns + 1;

      const optList = [targetAns, wrg1, wrg2, wrg3].map(n => String(n));
      options = shuffleArray([...new Set(optList)]);
      if (options.length < 4) options.push(String(targetAns + 6));
      correctIdx = options.indexOf(String(targetAns));
    } else if (levelId === 3) {
      // Level 3: Prime Factorization
      const num = [12, 18, 20, 24, 28, 30, 36, 40, 45, 50, 60][getRandomInt(0, 10)];
      const factors = getPrimeFactors(num);
      qText = `Cuál es la factorización prima de ${num}?`;
      qHint = `Multiplica los factores primos para obtener ${num}!`;

      const correctAnsStr = factors.join(" × ");
      options = [correctAnsStr];

      const fake1 = factors.concat([2]).join(" × ");
      const fake2 = [factors[0], factors[1] + 1].concat(factors.slice(2)).join(" × ");
      const fake3 = [1, num].join(" × ");

      options.push(fake1, fake2, fake3);
      options = shuffleArray([...new Set(options)]);
      if (options.length < 4) options.push(`${num / 2} × 2`);
      correctIdx = options.indexOf(correctAnsStr);
    } else if (levelId === 4) {
      // Level 4: Twin Primes & Prime Ranges
      const twinPairs = [[3, 5], [5, 7], [11, 13], [17, 19], [29, 31], [41, 43]];
      const pair = twinPairs[getRandomInt(0, twinPairs.length - 1)];
      qText = `¿Cuál de estos pares está formado por números primos gemelos (con una diferencia de 2)??`;
      qHint = `¡Ambos números del par deben ser primos y estar separados exactamente por 2!`;

      const correctStr = `${pair[0]} & ${pair[1]}`;
      const fakeStr1 = `${pair[0]} & ${pair[0] + 4}`;
      const fakeStr2 = `${pair[0] + 1} & ${pair[1] + 1}`;
      const fakeStr3 = `9 & 11`;

      options = shuffleArray([correctStr, fakeStr1, fakeStr2, fakeStr3]);
      correctIdx = options.indexOf(correctStr);
    } else {
      // Level 5: Guardian Boss Rush
      const choiceType = getRandomInt(1, 3);
      if (choiceType === 1) {
        const p = getRandomPrime(30, 97);
        qText = `Desafío del Guardián: ¿Cuál de estos es un número primo?`;
        qHint = `¡Escoge el número que únicamente tiene dos divisores: 1 y él mismo!`;
        const c1 = getRandomComposite(30, 97);
        const c2 = getRandomComposite(30, 97);
        const c3 = getRandomComposite(30, 97);
        options = shuffleArray([String(p), String(c1), String(c2), String(c3)]);
        correctIdx = options.indexOf(String(p));
      } else if (choiceType === 2) {
        const val = getRandomInt(2, 60);
        const primeState = isPrime(val);
        qText = `Batalla Final: ¿Es ${val} un número primo?`;
        qHint = `¡Decide rápidamente! ¿Es primo? Selecciona "Sí"; si es compuesto, selecciona "No".`;
        options = ["SÍ - Es un número primo!", "NO - Es un número compuesto"];
        correctIdx = primeState ? 0 : 1;
      } else {
        const num = [14, 21, 26, 33, 35, 38, 39, 49][getRandomInt(0, 7)];
        const factors = getPrimeFactors(num);
        qText = `Desafío del Guardián: ¿Cuáles son los factores primos de ${num}?`;
        qHint = `¡Escribe la descomposición en factores primos de ${num}`;
        const correctStr = factors.join(" × ");
        const fake1 = `${factors[0]} × ${factors[1] + 2}`;
        const fake2 = `${factors[0] + 1} × ${factors[1]}`;
        const fake3 = `1 × ${num}`;
        options = shuffleArray([correctStr, fake1, fake2, fake3]);
        correctIdx = options.indexOf(correctStr);
      }
    }

    return { qText, qHint, options, correctIdx };
  }

  // --- CANVAS & SCROLLING CAMERA ENGINE SETUP ---
  const canvas = document.getElementById('game-canvas');
  const ctx = canvas.getContext('2d');
  const charPreviewCanvas = document.getElementById('char-preview-canvas');
  const previewCtx = charPreviewCanvas ? charPreviewCanvas.getContext('2d') : null;

  // Auto-focus window so key listeners trigger immediately
  window.focus();
  if (canvas) canvas.focus();

  // World Map Dimensions (Expanded for Scrolling Camera)
  const WORLD_MAP_WIDTH = 2200;
  let cameraX = 0;

  // 5 Level Entry Points Spaced across the 2200px Map
  const LEVEL_CONFIGS = [
    { id: 1, title: 'Santuario Ancestral de los Números Primos', topic: 'Prueba de Números Primos (¿Es Primo?)', targetPuzzles: 3, xMap: 280 },
    { id: 2, title: 'Paso entre las Lianas', topic: 'Secuencias de Números Primos', targetPuzzles: 4, xMap: 680 },
    { id: 3, title: 'Cascada de la Factorización', topic: 'Factorización de Números Primos', targetPuzzles: 4, xMap: 1080 },
    { id: 4, title: 'Templo de los Números Primos', topic: 'Números Primos Gemelos y Rangos', targetPuzzles: 5, xMap: 1480 },
    { id: 5, title: 'Batalla contra el Guardián Final', topic: 'Desafío Maestro de Números Primos', targetPuzzles: 5, xMap: 1880 }
  ];

  // Game States
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

  const FRAME_WIDTH = 256;
  const FRAME_HEIGHT = 256;
  const TOTAL_FRAMES = 6;

  let frame = 0;
  let spriteLoaded = false;

  sprite.onload = () => {
    spriteLoaded = true;
  };

  // Update animation frame index at 10 FPS (100ms interval) while character moves
  setInterval(() => {
    if (Math.abs(player.vx) > 0.1 || !player.isGrounded) {
      frame = (frame + 1) % TOTAL_FRAMES;
    } else {
      frame = 0; // Standing idle frame
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
      this.speed = 5.5; // Smooth continuous horizontal speed
      this.jumpPower = -12.5; // Natural gravity jump
      this.gravity = 0.6;
      this.groundY = 420;
      this.isGrounded = true;
      this.facingRight = true;
      this.walkTimer = 0;
    }

    update(mapLimitWidth, platforms = []) {
      // Continuous Movement Physics
      this.x += this.vx;

      // Map Boundaries Collision
      if (this.x < 30) this.x = 30;
      if (this.x > mapLimitWidth - 30) this.x = mapLimitWidth - 30;

      // Gravity Physics & Airborne Handling
      this.vy += this.gravity;
      this.y += this.vy;

      let groundedOnPlatform = false;

      // Solid Platform Collision Check (AABB)
      platforms.forEach(p => {
        if (this.x + 15 > p.x && this.x - 15 < p.x + p.w) {
          // Landing on top of platform
          if (this.y >= p.y - 30 && this.y - this.vy <= p.y - 20 && this.vy >= 0) {
            this.y = p.y - 30;
            this.vy = 0;
            this.isGrounded = true;
            groundedOnPlatform = true;
          }
        }
      });

      // Default Ground Collision
      if (!groundedOnPlatform) {
        if (this.y >= this.groundY) {
          this.y = this.groundY;
          this.vy = 0;
          this.isGrounded = true;
        } else {
          this.isGrounded = false;
        }
      }

      // Animation Cycle
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

      if (spriteLoaded) {
        // Ground Shadow
        c.fillStyle = 'rgba(0,0,0,0.3)';
        c.beginPath();
        c.ellipse(0, 24, 18, 6, 0, 0, Math.PI * 2);
        c.fill();

        // Render 256x256 frame from explorer_walk.png
        const renderSize = 135; // Scaled character size for smooth rendering in world
        c.drawImage(
          sprite,
          frame * FRAME_WIDTH,
          0,
          FRAME_WIDTH,
          FRAME_HEIGHT,
          -renderSize / 2,
          -renderSize + 22,
          renderSize,
          renderSize
        );
      } else {
        const legOffset = Math.sin(this.walkTimer) * 9;
        const armOffset = Math.cos(this.walkTimer) * 7;

        // Ground Shadow
        c.fillStyle = 'rgba(0,0,0,0.3)';
        c.beginPath();
        c.ellipse(0, 24, 18, 6, 0, 0, Math.PI * 2);
        c.fill();

        // Boots & Cargo Pants
        c.fillStyle = '#2d1b0d';
        c.fillRect(-12 + legOffset, 12, 10, 12);
        c.fillRect(2 - legOffset, 12, 10, 12);

        c.fillStyle = '#4a6b35';
        c.fillRect(-12 + legOffset, 2, 10, 12);
        c.fillRect(2 - legOffset, 2, 10, 12);

        // Torso / Shirt
        c.fillStyle = '#d9a05b';
        c.fillRect(-14, -18, 28, 22);

        // Explorer Backpack
        c.fillStyle = '#8b5a2b';
        c.fillRect(-20, -16, 8, 16);

        // Arms
        c.fillStyle = '#d9a05b';
        c.fillRect(-16, -14 - armOffset, 6, 14);
        c.fillRect(10, -14 + armOffset, 6, 14);

        // Head
        c.fillStyle = '#f5c396';
        c.beginPath();
        c.arc(0, -28, 12, 0, Math.PI * 2);
        c.fill();

        // Safari Explorer Hat
        c.fillStyle = '#5c4028';
        c.beginPath();
        c.ellipse(0, -35, 18, 5, 0, 0, Math.PI * 2);
        c.fill();
        c.fillRect(-10, -44, 20, 10);
        c.fillStyle = '#ffea00';
        c.fillRect(-10, -36, 20, 3);

        // Eye
        c.fillStyle = '#111';
        c.fillRect(3, -30, 3, 3);
      }

      c.restore();
    }
  }

  const player = new Player();

  // --- KEYBOARD CONTROLLER & MULTI-KEY STATE TRACKING ---
  const keys = { Left: false, Right: false, Up: false, Enter: false };
  const keyboardKeys = { Left: false, Right: false, Up: false };
  const touchPointers = {
    Left: new Set(),
    Right: new Set(),
    Up: new Set()
  };
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
    // Prevent default scroll behavior for arrow keys & space
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
          addFloatingText(player.x, player.y - 40, "Locked Shrine!", "#ff8fa3");
        }
      }
    }
  }

  // --- RENDERING SCROLLING WORLD MAP WITH CAMERA FOLLOW ---
  function drawWorldMap() {
    // 1. Update Camera Position to Follow Character smoothly
    const targetCamX = player.x - canvas.width / 2;
    cameraX += (targetCamX - cameraX) * 0.1; // smooth lerp
    cameraX = Math.max(0, Math.min(WORLD_MAP_WIDTH - canvas.width, cameraX));

    ctx.save();
    ctx.translate(-Math.round(cameraX), 0); // Apply camera offset

    // Background Sky Gradient across whole world map width
    const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    skyGrad.addColorStop(0, '#0a2014');
    skyGrad.addColorStop(0.5, '#143c22');
    skyGrad.addColorStop(1, '#07190e');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, WORLD_MAP_WIDTH, canvas.height);

    // Parallax Mountain Silhouettes
    ctx.fillStyle = '#06170d';
    for (let x = 0; x < WORLD_MAP_WIDTH; x += 300) {
      ctx.beginPath();
      ctx.moveTo(x, 460);
      ctx.lineTo(x + 150, 180);
      ctx.lineTo(x + 300, 460);
      ctx.fill();
    }

    // Dense Jungle Canopy Trees
    ctx.fillStyle = '#0f331b';
    for (let x = -50; x < WORLD_MAP_WIDTH + 100; x += 90) {
      ctx.beginPath();
      ctx.arc(x, 140, 75, 0, Math.PI * 2);
      ctx.fill();
    }

    // Waterfall Stream on Map
    ctx.fillStyle = 'rgba(46, 196, 182, 0.3)';
    ctx.fillRect(900, 180, 70, 280);

    // Winding Dirt Trail Path connecting all 5 level gateways
    ctx.strokeStyle = '#7c4d25';
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

    ctx.strokeStyle = '#d9a05b'; // Path inner highlight
    ctx.lineWidth = 18;
    ctx.stroke();

    // Render 5 Level Shrines
    let nearInteractable = false;

    LEVEL_CONFIGS.forEach((cfg) => {
      const isUnlocked = cfg.id <= gameData.unlockedLevel;
      const isNear = isUnlocked && Math.abs(player.x - cfg.xMap) < 55;
      if (isNear) nearInteractable = true;

      const stars = gameData.levelStars[cfg.id] || 0;

      ctx.save();
      ctx.translate(cfg.xMap, 370);

      // Ancient Stone Shrine Structure
      ctx.fillStyle = isUnlocked ? '#2d6a4f' : '#1f2937';
      ctx.fillRect(-35, -55, 70, 75);

      ctx.fillStyle = isUnlocked ? '#74c69d' : '#374151';
      ctx.fillRect(-42, -72, 84, 20);

      // Gateway Portal Archway
      ctx.fillStyle = isUnlocked ? '#ffea00' : '#111827';
      ctx.beginPath();
      ctx.arc(0, -12, 20, Math.PI, 0);
      ctx.fillRect(-20, -12, 40, 32);
      ctx.fill();

      if (isUnlocked) {
        ctx.fillStyle = '#07190e';
        ctx.font = 'bold 16px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillText(`L${cfg.id}`, 0, 10);

        // Star Rating
        ctx.font = '14px sans-serif';
        const starStr = '⭐'.repeat(stars) + '🖤'.repeat(3 - stars);
        ctx.fillText(starStr, 0, -82);
      } else {
        ctx.fillStyle = '#9ca3af';
        ctx.font = '22px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🔒', 0, 10);
      }

      // Shrine Title Label
      ctx.fillStyle = isUnlocked ? '#f0fdf4' : '#6b7280';
      ctx.font = 'bold 13px "Fredoka", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(cfg.title, 0, 42);

      // Glowing Selection Box
      if (isNear) {
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 3;
        ctx.strokeRect(-46, -78, 92, 128);
      }

      ctx.restore();
    });

    // Update Prompt Badge UI
    const promptBadge = document.getElementById('map-prompt-badge');
    if (promptBadge) {
      if (nearInteractable) promptBadge.classList.remove('hidden');
      else promptBadge.classList.add('hidden');
    }

    // Save map player position
    gameData.mapPlayerX = Math.round(player.x);

    // Update & Draw Player
    player.update(WORLD_MAP_WIDTH);
    player.draw(ctx);

    ctx.restore(); // Restore camera translation
  }

  // --- RENDERING IN-LEVEL INTERIOR JUNGLE ---
  let levelPlatforms = [];
  let levelCheckpoints = [];
  let levelGoalX = 1400;

  function initLevelPlatforms(levelId) {
    player.x = 80;
    player.y = 380;
    player.groundY = 380;
    levelPlatforms = [
      { x: 0, y: 440, w: 1600, h: 140 }, // Ground
      { x: 240, y: 340, w: 150, h: 20 },  // Platform 1
      { x: 480, y: 260, w: 150, h: 20 },  // Platform 2
      { x: 740, y: 340, w: 150, h: 20 },  // Platform 3
      { x: 1000, y: 260, w: 150, h: 20 }  // Platform 4
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
    // Level Camera Offset
    const levelCamX = Math.max(0, Math.min(1600 - canvas.width, player.x - canvas.width / 2));

    ctx.save();
    ctx.translate(-Math.round(levelCamX), 0);

    // Interior Jungle Environment Background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    bgGrad.addColorStop(0, '#041209');
    bgGrad.addColorStop(0.6, '#0e2a18');
    bgGrad.addColorStop(1, '#05160c');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1600, canvas.height);

    // Foliage & Vines background
    ctx.fillStyle = 'rgba(45, 106, 79, 0.4)';
    for (let i = 50; i < 1600; i += 130) {
      ctx.beginPath();
      ctx.arc(i, 80, 55, 0, Math.PI);
      ctx.fill();
    }

    // Platforms
    levelPlatforms.forEach(p => {
      ctx.fillStyle = '#1c4228';
      ctx.fillRect(p.x, p.y, p.w, p.h);

      ctx.fillStyle = '#52b788'; // Mossy top
      ctx.fillRect(p.x, p.y, p.w, 6);
    });

    // Math Checkpoints
    levelCheckpoints.forEach(cp => {
      ctx.save();
      ctx.translate(cp.x, cp.y);

      if (cp.solved) {
        ctx.fillStyle = '#4ade80';
        ctx.font = '24px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('✨✅', 0, 0);
      } else {
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.arc(0, 0, 18, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#07190e';
        ctx.font = 'bold 16px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillText('?', 0, 6);
      }
      ctx.restore();

      // Trigger question if player walks over unsolved checkpoint
      if (!cp.solved && Math.abs(player.x - cp.x) < 35 && Math.abs(player.y - cp.y) < 60) {
        cp.solved = true;
        triggerMathPuzzle();
      }
    });

    // Ancient Exit Portal
    ctx.fillStyle = '#ffd700';
    ctx.fillRect(levelGoalX - 25, 340, 50, 100);
    ctx.fillStyle = '#07190e';
    ctx.font = 'bold 14px "Press Start 2P"';
    ctx.textAlign = 'center';
    ctx.fillText('GOAL', levelGoalX, 390);

    // Player update & draw with platform collision
    player.update(1600, levelPlatforms);
    player.draw(ctx);

    ctx.restore();

    // Check level completion when reaching goal
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

    // Timer
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
      puzzleFeedbackMsg.textContent = '🌟 Correct! +10 Points!';
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
      puzzleFeedbackMsg.textContent = '❌ Incorrect! −5 Points.';
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

    summaryTitle.textContent = `${currentLevel.title} Cleared!`;
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
      if (confirm('Are you sure you want to reset all saved progress and scores?')) {
        gameData = Object.assign({}, defaultData);
        saveGameData(gameData);
        updateHUD();
        alert('Progress reset cleanly!');
      }
    });
  }

  let previewAnimTimer = 0;
  function renderCharPreview() {
    if (!previewCtx) return;
    previewCtx.clearRect(0, 0, 120, 120);

    if (spriteLoaded) {
      previewCtx.drawImage(
        sprite,
        frame * FRAME_WIDTH,
        0,
        FRAME_WIDTH,
        FRAME_HEIGHT,
        10,
        10,
        100,
        100
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

    // Render floating text particles
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

  // Launch initial setup
  updateHUD();
  requestAnimationFrame(gameLoop);

})();
