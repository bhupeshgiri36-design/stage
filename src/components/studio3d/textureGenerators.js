import * as THREE from 'three';

/**
 * Creates dynamic, high-resolution canvas textures for the 3D Studio LED screens,
 * reflective stage marble floor, podium emblems, and team desks.
 */

// 1. Central Curved LED Screen Texture
export function createCentralScreenTexture(
  scene = 'welcome',
  questionData,
  scores
) {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Background Gradient
  const bgGrad = ctx.createLinearGradient(0, 0, canvas.width, 0);
  bgGrad.addColorStop(0, '#590d22');
  bgGrad.addColorStop(0.2, '#991b1b');
  bgGrad.addColorStop(0.4, '#18181b');
  bgGrad.addColorStop(0.6, '#090a0f');
  bgGrad.addColorStop(0.8, '#0369a1');
  bgGrad.addColorStop(1, '#0c4a6e');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Energy smoke particles / nebula effect
  for (let i = 0; i < 90; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const rad = 40 + Math.random() * 140;
    const grad = ctx.createRadialGradient(x, y, 0, x, y, rad);
    const isLeft = x < canvas.width / 2;
    grad.addColorStop(0, isLeft ? 'rgba(239, 68, 68, 0.28)' : 'rgba(56, 189, 248, 0.28)');
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, rad, 0, Math.PI * 2);
    ctx.fill();
  }

  // Common Top Crown Logo
  ctx.save();
  ctx.translate(canvas.width / 2, 220);

  ctx.fillStyle = '#f59e0b';
  ctx.shadowColor = '#fbbf24';
  ctx.shadowBlur = 35;
  ctx.beginPath();
  ctx.moveTo(-90, 60);
  ctx.lineTo(-120, -30);
  ctx.lineTo(-60, 15);
  ctx.lineTo(0, -65);
  ctx.lineTo(60, 15);
  ctx.lineTo(120, -30);
  ctx.lineTo(90, 60);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(-90, 55, 180, 16);
  ctx.restore();

  if (scene === 'quiz' && questionData) {
    ctx.font = '800 48px "Outfit", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#f59e0b';
    ctx.fillText(`CATEGORY: ${questionData.category}`, canvas.width / 2, 360);

    ctx.font = '900 68px "Outfit", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 20;
    ctx.fillText(questionData.question, canvas.width / 2, 480);

    const optY = 660;
    questionData.options.forEach((opt, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const optX = col === 0 ? canvas.width / 2 - 440 : canvas.width / 2 + 440;
      const curY = optY + row * 110;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.strokeStyle = idx % 2 === 0 ? '#f43f5e' : '#38bdf8';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(optX - 380, curY - 45, 760, 85, 16);
      ctx.fill();
      ctx.stroke();

      ctx.font = '800 40px "Outfit", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`${String.fromCharCode(65 + idx)}.  ${opt}`, optX, curY + 12);
    });
  } else if (scene === 'team_intro') {
    // TEAM INTRO DUAL SCREEN
    ctx.font = '900 110px "Outfit", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
    ctx.shadowBlur = 25;
    ctx.fillText('TEAM SQUADS REVEAL', canvas.width / 2, 400);

    ctx.font = '900 80px "Cinzel", "Outfit", serif';
    ctx.fillStyle = '#f43f5e';
    ctx.fillText('🔥 TEAM INFERNO', canvas.width / 4 + 40, 560);

    ctx.font = '900 80px "Cinzel", "Outfit", serif';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('TEAM TITANS 🛡️', (canvas.width * 3) / 4 - 40, 560);

    ctx.fillStyle = '#f59e0b';
    ctx.font = '900 90px "Outfit", sans-serif';
    ctx.fillText('VS', canvas.width / 2, 560);

    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.roundRect(canvas.width / 2 - 380, 710, 760, 60, 14);
    ctx.fill();

    ctx.font = '800 36px "Outfit", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('5 HEROES ON RED  •  5 HEROES ON BLUE', canvas.width / 2, 752);
  } else if (scene === 'challenge') {
    // CHALLENGE ARENA SCREEN
    ctx.font = '900 130px "Outfit", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 25;
    ctx.fillText('CHALLENGE ARENA', canvas.width / 2, 420);

    const textGrad = ctx.createLinearGradient(canvas.width / 2 - 350, 0, canvas.width / 2 + 350, 0);
    textGrad.addColorStop(0, '#f59e0b');
    textGrad.addColorStop(0.5, '#fde047');
    textGrad.addColorStop(1, '#f59e0b');
    ctx.font = '900 85px "Cinzel", "Outfit", serif';
    ctx.fillStyle = textGrad;
    ctx.shadowColor = '#fbbf24';
    ctx.shadowBlur = 35;
    ctx.fillText('PHYSICAL STAGE OBSTACLE', canvas.width / 2, 560);

    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.roundRect(canvas.width / 2 - 400, 710, 800, 65, 16);
    ctx.fill();

    ctx.font = '800 38px "Outfit", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('SPEED • AGILITY • ENDURANCE TEST', canvas.width / 2, 755);
  } else if (scene === 'face_off') {
    ctx.font = '900 130px "Outfit", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 25;
    ctx.fillText('FACE-OFF ARENA', canvas.width / 2, 430);

    const textGrad = ctx.createLinearGradient(canvas.width / 2 - 350, 0, canvas.width / 2 + 350, 0);
    textGrad.addColorStop(0, '#f43f5e');
    textGrad.addColorStop(0.5, '#fbbf24');
    textGrad.addColorStop(1, '#38bdf8');
    ctx.font = '900 110px "Cinzel", "Outfit", serif';
    ctx.fillStyle = textGrad;
    ctx.fillText('INFERNO  VS  TITANS', canvas.width / 2, 580);

    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.roundRect(canvas.width / 2 - 380, 710, 760, 70, 16);
    ctx.fill();

    ctx.font = '800 38px "Outfit", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('FIRST TO HIT DESK BUZZER WINS POINTS', canvas.width / 2, 755);
  } else if (scene === 'results') {
    // LIVE SCORES & STATS SCREEN
    ctx.font = '900 120px "Outfit", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#fbbf24';
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 25;
    ctx.fillText('LIVE SCORES & STANDINGS', canvas.width / 2, 410);

    // Inferno box
    ctx.fillStyle = 'rgba(239, 68, 68, 0.25)';
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.roundRect(canvas.width / 2 - 580, 480, 520, 200, 20);
    ctx.fill();
    ctx.stroke();

    ctx.font = '900 50px "Outfit", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('🔥 TEAM INFERNO', canvas.width / 2 - 320, 545);
    ctx.font = '900 80px "Outfit", sans-serif';
    ctx.fillStyle = '#f87171';
    ctx.fillText(`${scores?.inferno || 1060}`, canvas.width / 2 - 320, 640);

    // Titans box
    ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.roundRect(canvas.width / 2 + 60, 480, 520, 200, 20);
    ctx.fill();
    ctx.stroke();

    ctx.font = '900 50px "Outfit", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('TEAM TITANS 🛡️', canvas.width / 2 + 320, 545);
    ctx.font = '900 80px "Outfit", sans-serif';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText(`${scores?.titans || 1100}`, canvas.width / 2 + 320, 640);

    ctx.fillStyle = '#eab308';
    ctx.beginPath();
    ctx.roundRect(canvas.width / 2 - 360, 720, 720, 60, 14);
    ctx.fill();

    ctx.font = '800 34px "Outfit", sans-serif';
    ctx.fillStyle = '#090a10';
    ctx.fillText('FINAL ROUNDS IN PROGRESS', canvas.width / 2, 760);
  } else if (scene === 'winner') {
    const winnerTeam = (scores?.inferno || 0) >= (scores?.titans || 0) ? 'TEAM INFERNO' : 'TEAM TITANS';
    ctx.font = '900 130px "Outfit", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('GRAND CHAMPION', canvas.width / 2, 430);

    const textGrad = ctx.createLinearGradient(canvas.width / 2 - 400, 0, canvas.width / 2 + 400, 0);
    textGrad.addColorStop(0, '#fde047');
    textGrad.addColorStop(0.5, '#f59e0b');
    textGrad.addColorStop(1, '#d97706');
    ctx.font = '900 150px "Cinzel", serif';
    ctx.fillStyle = textGrad;
    ctx.shadowColor = '#fbbf24';
    ctx.shadowBlur = 40;
    ctx.fillText(winnerTeam, canvas.width / 2, 590);

    ctx.fillStyle = '#16a34a';
    ctx.beginPath();
    ctx.roundRect(canvas.width / 2 - 420, 710, 840, 70, 16);
    ctx.fill();

    ctx.font = '800 38px "Outfit", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('CROWNED WITH THE GOLDEN TROPHY', canvas.width / 2, 755);
  } else {
    // DEFAULT MAIN WELCOME STAGE DISPLAY (Matching Screenshots)
    ctx.font = '900 130px "Outfit", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
    ctx.shadowBlur = 25;
    ctx.fillText('CHAMPIONS', canvas.width / 2, 420);

    const textGrad = ctx.createLinearGradient(canvas.width / 2 - 350, 0, canvas.width / 2 + 350, 0);
    textGrad.addColorStop(0, '#fef08a');
    textGrad.addColorStop(0.5, '#f59e0b');
    textGrad.addColorStop(1, '#d97706');
    ctx.font = '900 160px "Cinzel", "Outfit", serif';
    ctx.fillStyle = textGrad;
    ctx.shadowColor = '#fbbf24';
    ctx.shadowBlur = 35;
    ctx.fillText('TERA BHAI', canvas.width / 2, 580);

    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.roundRect(canvas.width / 2 - 380, 710, 760, 60, 14);
    ctx.fill();

    ctx.font = '800 36px "Outfit", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.letterSpacing = '6px';
    ctx.fillText('A REALITY COMPETITION SHOW', canvas.width / 2, 748);

    // Laurel Wreaths
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 14;
    ctx.shadowColor = '#fbbf24';
    ctx.shadowBlur = 20;

    ctx.beginPath();
    ctx.arc(canvas.width / 2 - 580, 520, 220, -Math.PI * 0.4, Math.PI * 0.4, false);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(canvas.width / 2 + 580, 520, 220, Math.PI * 0.6, Math.PI * 1.4, false);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

// 2. High-Gloss Dark Marble Stage Floor Texture
export function createStageMarbleTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Deep dark reflective base
  ctx.fillStyle = '#060810';
  ctx.fillRect(0, 0, 1024, 1024);

  // Subtle radial reflection gradient from center
  const centerGrad = ctx.createRadialGradient(512, 512, 0, 512, 512, 512);
  centerGrad.addColorStop(0, 'rgba(251, 191, 36, 0.12)');
  centerGrad.addColorStop(0.5, 'rgba(15, 23, 42, 0.4)');
  centerGrad.addColorStop(1, 'rgba(6, 8, 16, 0.9)');
  ctx.fillStyle = centerGrad;
  ctx.fillRect(0, 0, 1024, 1024);

  // Procedural marble veins
  ctx.strokeStyle = 'rgba(251, 191, 36, 0.08)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 18; i++) {
    ctx.beginPath();
    let x = Math.random() * 1024;
    let y = Math.random() * 1024;
    ctx.moveTo(x, y);
    for (let j = 0; j < 5; j++) {
      x += (Math.random() - 0.5) * 220;
      y += (Math.random() - 0.5) * 220;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // Polished marble tiles grid
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.lineWidth = 1.5;
  for (let x = 0; x <= 1024; x += 128) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 1024);
    ctx.stroke();
  }
  for (let y = 0; y <= 1024; y += 128) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1024, y);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

// 3. Anchor Podium Front Golden Crown Emblem Texture
export function createPodiumCrownTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = '#090a10';
  ctx.fillRect(0, 0, 512, 512);

  // Circular Gold Ring Border
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 12;
  ctx.shadowColor = '#fbbf24';
  ctx.shadowBlur = 25;
  ctx.beginPath();
  ctx.arc(256, 256, 230, 0, Math.PI * 2);
  ctx.stroke();

  // Grand Golden Crown in Center
  ctx.save();
  ctx.translate(256, 240);

  const crownGrad = ctx.createLinearGradient(0, -120, 0, 100);
  crownGrad.addColorStop(0, '#fef08a');
  crownGrad.addColorStop(0.5, '#f59e0b');
  crownGrad.addColorStop(1, '#b45309');
  ctx.fillStyle = crownGrad;
  ctx.shadowColor = '#fbbf24';
  ctx.shadowBlur = 30;

  ctx.beginPath();
  ctx.moveTo(-130, 70);
  ctx.lineTo(-160, -40);
  ctx.lineTo(-80, 15);
  ctx.lineTo(0, -90);
  ctx.lineTo(80, 15);
  ctx.lineTo(160, -40);
  ctx.lineTo(130, 70);
  ctx.closePath();
  ctx.fill();

  // Crown Base Band with jewels
  ctx.fillStyle = '#fde047';
  ctx.fillRect(-125, 65, 250, 22);

  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(0, 76, 8, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.arc(-70, 76, 7, 0, Math.PI * 2);
  ctx.arc(70, 76, 7, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();

  // "CHAMPIONS" Text at bottom of medallion
  ctx.font = '900 38px "Cinzel", "Outfit", serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#fef08a';
  ctx.shadowColor = '#fbbf24';
  ctx.shadowBlur = 15;
  ctx.fillText('CHAMPIONS', 256, 420);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

// 4. Team Inferno Side Banner
export function createInfernoBannerTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const grad = ctx.createRadialGradient(512, 512, 100, 512, 512, 512);
  grad.addColorStop(0, '#7f1d1d');
  grad.addColorStop(0.6, '#450a0a');
  grad.addColorStop(1, '#090a0f');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 1024);

  ctx.save();
  ctx.translate(512, 450);
  ctx.shadowColor = '#f43f5e';
  ctx.shadowBlur = 50;

  ctx.fillStyle = '#dc2626';
  ctx.beginPath();
  ctx.moveTo(0, -260);
  ctx.bezierCurveTo(120, -140, 220, 20, 180, 180);
  ctx.bezierCurveTo(140, 300, -140, 300, -180, 180);
  ctx.bezierCurveTo(-220, 20, -120, -140, 0, -260);
  ctx.fill();

  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.moveTo(0, -160);
  ctx.bezierCurveTo(70, -80, 140, 40, 100, 160);
  ctx.bezierCurveTo(70, 240, -70, 240, -100, 160);
  ctx.bezierCurveTo(-140, 40, -70, -80, 0, -160);
  ctx.fill();

  ctx.restore();

  ctx.font = '900 80px "Outfit", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = '#f43f5e';
  ctx.shadowBlur = 30;
  ctx.fillText('TEAM INFERNO', 512, 850);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

// 5. Team Titans Side Banner
export function createTitansBannerTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const grad = ctx.createRadialGradient(512, 512, 100, 512, 512, 512);
  grad.addColorStop(0, '#0c4a6e');
  grad.addColorStop(0.6, '#082f49');
  grad.addColorStop(1, '#090a0f');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 1024);

  ctx.save();
  ctx.translate(512, 450);
  ctx.shadowColor = '#38bdf8';
  ctx.shadowBlur = 50;

  ctx.fillStyle = '#0284c7';
  ctx.beginPath();
  ctx.moveTo(-160, -180);
  ctx.lineTo(-40, -260);
  ctx.lineTo(-20, -140);
  ctx.lineTo(80, -240);
  ctx.lineTo(120, -120);
  ctx.lineTo(240, -20);
  ctx.lineTo(160, 40);
  ctx.lineTo(200, 120);
  ctx.lineTo(80, 140);
  ctx.lineTo(0, 220);
  ctx.lineTo(-120, 180);
  ctx.lineTo(-160, 40);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.moveTo(-10, -100);
  ctx.lineTo(60, -180);
  ctx.lineTo(90, -80);
  ctx.lineTo(180, -10);
  ctx.lineTo(120, 30);
  ctx.lineTo(40, 100);
  ctx.lineTo(-40, 140);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(80, -50, 14, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();

  ctx.font = '900 80px "Outfit", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = '#38bdf8';
  ctx.shadowBlur = 30;
  ctx.fillText('TEAM TITANS', 512, 850);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

// 6. Team Desk Front Panel Illuminated Decal
export function createTeamDeskDecal(team) {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const isInferno = team === 'inferno';
  ctx.fillStyle = '#090a10';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Neon Border Frame
  ctx.strokeStyle = isInferno ? '#f43f5e' : '#38bdf8';
  ctx.lineWidth = 8;
  ctx.shadowColor = ctx.strokeStyle;
  ctx.shadowBlur = 25;
  ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

  // Team Icon on Left
  if (isInferno) {
    ctx.save();
    ctx.translate(120, 128);
    ctx.fillStyle = '#ef4444';
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 30;
    ctx.beginPath();
    ctx.moveTo(0, -70);
    ctx.bezierCurveTo(40, -30, 60, 20, 40, 60);
    ctx.bezierCurveTo(20, 80, -20, 80, -40, 60);
    ctx.bezierCurveTo(-60, 20, -40, -30, 0, -70);
    ctx.fill();

    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.moveTo(0, -30);
    ctx.bezierCurveTo(20, -10, 30, 20, 20, 45);
    ctx.bezierCurveTo(10, 55, -10, 55, -20, 45);
    ctx.bezierCurveTo(-30, 20, -20, -10, 0, -30);
    ctx.fill();
    ctx.restore();
  } else {
    ctx.save();
    ctx.translate(120, 128);
    ctx.fillStyle = '#0ea5e9';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 30;
    ctx.beginPath();
    ctx.moveTo(-50, -50);
    ctx.lineTo(0, -70);
    ctx.lineTo(20, -30);
    ctx.lineTo(60, 0);
    ctx.lineTo(40, 40);
    ctx.lineTo(0, 60);
    ctx.lineTo(-40, 40);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // Text
  ctx.font = '900 68px "Outfit", sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = isInferno ? '#f43f5e' : '#38bdf8';
  ctx.shadowBlur = 25;
  ctx.fillText(isInferno ? 'TEAM INFERNO' : 'TEAM TITANS', 220, 128);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

// 7. Individual Contestant Desk Nameplate Texture
export function createNameplateTexture(name, team) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = '#090a10';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = team === 'inferno' ? '#f43f5e' : '#38bdf8';
  ctx.lineWidth = 10;
  ctx.strokeRect(5, 5, canvas.width - 10, canvas.height - 10);

  ctx.font = '900 64px "Outfit", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = team === 'inferno' ? '#f43f5e' : '#38bdf8';
  ctx.shadowBlur = 20;
  ctx.fillText(name.toUpperCase(), canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

// 8. 3D Floating Name & Status Badge Texture
export function createCharacterBadgeTexture(
  name,
  jerseyNumber,
  team,
  isCenterStage = false
) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 160;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'rgba(9, 10, 16, 0.95)';
  ctx.beginPath();
  ctx.roundRect(16, 20, canvas.width - 32, 120, 60);
  ctx.fill();

  ctx.strokeStyle = isCenterStage
    ? '#fbbf24'
    : team === 'inferno'
    ? '#f43f5e'
    : '#38bdf8';
  ctx.lineWidth = 8;
  ctx.shadowColor = ctx.strokeStyle;
  ctx.shadowBlur = 18;
  ctx.stroke();

  ctx.font = '900 52px "Outfit", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = isCenterStage ? '#fde047' : '#ffffff';
  ctx.shadowBlur = 0;
  const label = `#${jerseyNumber} ${name.toUpperCase()}`;
  ctx.fillText(label, canvas.width / 2, 75);

  if (isCenterStage) {
    ctx.font = '800 24px "Outfit", sans-serif';
    ctx.fillStyle = '#fbbf24';
    ctx.fillText('★ CENTER STAGE ★', canvas.width / 2, 115);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

// 9. Vertical Backdrop Player LED Banner Texture (as seen in image_af638eae.png)
export function createPlayerTowerTexture(team, number, name) {
  const canvas = document.createElement('canvas');
  canvas.width = 384;
  canvas.height = 768;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const isInferno = team === 'inferno';
  const neonColor = isInferno ? '#f43f5e' : '#38bdf8';

  // Deep dark glass background
  const bg = ctx.createLinearGradient(0, 0, 0, 768);
  bg.addColorStop(0, isInferno ? '#450a0a' : '#082f49');
  bg.addColorStop(0.35, '#090a10');
  bg.addColorStop(0.75, '#030408');
  bg.addColorStop(1, isInferno ? '#7f1d1d' : '#0369a1');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 384, 768);

  // Outer Neon Frame
  ctx.strokeStyle = neonColor;
  ctx.lineWidth = 8;
  ctx.shadowColor = neonColor;
  ctx.shadowBlur = 20;
  ctx.strokeRect(12, 12, 360, 744);

  // Top Team Badge
  ctx.font = '900 24px "Cinzel", "Outfit", serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = neonColor;
  ctx.shadowBlur = 10;
  ctx.fillText(isInferno ? '🔥 INFERNO' : 'TITANS 🛡️', 192, 60);

  // Player Stylized Silhouette / Emblem
  ctx.save();
  ctx.translate(192, 320);

  // Head
  ctx.fillStyle = isInferno ? '#f87171' : '#7dd3fc';
  ctx.shadowColor = neonColor;
  ctx.shadowBlur = 15;
  ctx.beginPath();
  ctx.arc(0, -110, 42, 0, Math.PI * 2);
  ctx.fill();

  // Torso / Jersey Silhouette
  ctx.beginPath();
  ctx.moveTo(-75, 90);
  ctx.lineTo(-65, -45);
  ctx.lineTo(65, -45);
  ctx.lineTo(75, 90);
  ctx.closePath();
  ctx.fill();

  // Big Jersey Number on Chest
  ctx.font = '900 75px "Outfit", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = '#000000';
  ctx.shadowBlur = 10;
  ctx.fillText(`${number}`, 0, 45);

  ctx.restore();

  // Bottom Name Plate
  ctx.fillStyle = isInferno ? 'rgba(239, 68, 68, 0.3)' : 'rgba(56, 189, 248, 0.3)';
  ctx.fillRect(20, 620, 344, 100);

  ctx.strokeStyle = neonColor;
  ctx.lineWidth = 4;
  ctx.strokeRect(20, 620, 344, 100);

  ctx.font = '900 42px "Outfit", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = neonColor;
  ctx.shadowBlur = 12;
  ctx.fillText(name.toUpperCase(), 192, 685);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

