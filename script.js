// 留言功能
function addMessage() {
  const input = document.getElementById('messageInput');
  if (!input) return;

  const msg = input.value.trim();
  if (!msg) return;

  const list = document.getElementById('messageList');
  const p = document.createElement('p');
  p.textContent = msg;
  list.appendChild(p);
  input.value = '';
}

// 献礼功能
function sendGift(name) {
  const list = document.getElementById('giftList');
  if (!list) return;

  const p = document.createElement('p');
  p.textContent = name;
  list.appendChild(p);
}

// 花瓣效果：一片一片缓慢落下，最后停在地上
const petalsContainer = document.getElementById('petals');
let landedPetals = [];

function createPetal() {
  if (!petalsContainer) return;

  const petal = document.createElement('div');

  const startX = window.innerWidth * (0.4 + Math.random() * 0.2);
  const endX = window.innerWidth * (0.42 + Math.random() * 0.16);
  const size = 10 + Math.random() * 8;
  const duration = 7 + Math.random() * 3;
  const rotateStart = Math.random() * 90;

  petal.style.position = 'fixed';
  petal.style.left = startX + 'px';
  petal.style.top = '-30px';
  petal.style.width = size + 'px';
  petal.style.height = size * 1.5 + 'px';
  petal.style.background = 'linear-gradient(180deg, #f8d7df 0%, #e8a9b8 100%)';
  petal.style.borderRadius = '70% 0 70% 0';
  petal.style.transform = `rotate(${rotateStart}deg)`;
  petal.style.opacity = '0.9';
  petal.style.pointerEvents = 'none';
  petal.style.zIndex = '5';
  petal.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)';

  petalsContainer.appendChild(petal);

  let startTime = null;

  function animate(timestamp) {
    if (!startTime) startTime = timestamp;

    const elapsed = (timestamp - startTime) / 1000;
    const progress = Math.min(elapsed / duration, 1);

    const sway = Math.sin(progress * Math.PI * 2) * 18;
    const currentX = startX + (endX - startX) * progress + sway;
    const currentY = -30 + (window.innerHeight - 90) * progress;
    const currentRotate = rotateStart + progress * 140;

    petal.style.left = currentX + 'px';
    petal.style.top = currentY + 'px';
    petal.style.transform = `rotate(${currentRotate}deg)`;

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      // 落地后停住
      petal.style.left = endX + 'px';
      petal.style.top = (window.innerHeight - 85 - Math.random() * 10) + 'px';
      petal.style.transform = `rotate(${20 + Math.random() * 40}deg)`;
      petal.style.opacity = '0.75';

      landedPetals.push(petal);

      // 最多保留 12 片落地花瓣
      if (landedPetals.length > 12) {
        const first = landedPetals.shift();
        if (first) first.remove();
      }
    }
  }

  requestAnimationFrame(animate);
}

// 不要满屏幕，3.5秒才掉一片
if (petalsContainer) {
  setInterval(createPetal, 3500);

  // 页面刚打开时，先来两片，效果自然一点
  setTimeout(createPetal, 800);
  setTimeout(createPetal, 2200);
}
