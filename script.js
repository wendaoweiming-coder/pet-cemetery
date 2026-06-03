// 留言功能：留言只显示在下方，不会变成墓地摆件
function addMessage() {
  const input = document.getElementById("messageInput");
  const list = document.getElementById("messageList");

  if (!input || !list) return;

  const text = input.value.trim();
  if (!text) return;

  const item = document.createElement("div");
  item.className = "message-item";
  item.textContent = text;

  list.prepend(item);
  input.value = "";
}

// 摆件功能：礼物会真正摆在墓碑周围
function placeGift(type) {
  const placedItems = document.getElementById("placedItems");
  const animals = document.getElementById("animals");

  if (!placedItems) return;

  const item = document.createElement("div");
  item.className = "scene-item";

  if (type === "flower") {
    item.textContent = "💐";
    item.style.left = randomBetween(180, 240) + "px";
    item.style.top = randomBetween(320, 370) + "px";
  }

  if (type === "can") {
    item.textContent = "🥫";
    item.style.left = randomBetween(350, 420) + "px";
    item.style.top = randomBetween(385, 420) + "px";

    setTimeout(() => {
      addAnimal("cat");
    }, 1800);
  }

  if (type === "ball") {
    item.textContent = "🎾";
    item.style.left = randomBetween(470, 560) + "px";
    item.style.top = randomBetween(385, 425) + "px";

    setTimeout(() => {
      addAnimal("dog");
    }, 2000);
  }

  if (type === "catstick") {
    item.textContent = "🪄";
    item.style.left = randomBetween(250, 310) + "px";
    item.style.top = randomBetween(330, 380) + "px";
    item.style.transform = "rotate(-28deg)";
  }

  placedItems.appendChild(item);
}

// 小动物：被食物或玩具吸引过来
function addAnimal(type) {
  const animals = document.getElementById("animals");
  if (!animals) return;

  const animal = document.createElement("div");
  animal.className = "animal";

  if (type === "cat") {
    animal.textContent = "🐈";
    animal.style.left = "420px";
    animal.style.top = "330px";
  }

  if (type === "dog") {
    animal.textContent = "🐕";
    animal.style.left = "500px";
    animal.style.top = "330px";
  }

  animals.appendChild(animal);
}

// 每位访客进入墓碑页，只掉一片花瓣
function dropOnePetal() {
  const petals = document.getElementById("petals");
  if (!petals) return;

  const petal = document.createElement("div");
  petal.className = "petal";

  const startX = randomBetween(300, 460);
  const endX = randomBetween(320, 440);
  const endY = randomBetween(390, 430);

  petal.style.left = startX + "px";
  petal.style.top = "-30px";

  petals.appendChild(petal);

  let progress = 0;

  const timer = setInterval(() => {
    progress += 0.006;

    const sway = Math.sin(progress * 10) * 22;
    const currentX = startX + (endX - startX) * progress + sway;
    const currentY = -30 + (endY + 30) * progress;
    const rotate = progress * 180;

    petal.style.left = currentX + "px";
    petal.style.top = currentY + "px";
    petal.style.transform = `rotate(${rotate}deg)`;

    if (progress >= 1) {
      clearInterval(timer);
      petal.style.left = endX + "px";
      petal.style.top = endY + "px";
      petal.style.transform = "rotate(35deg)";
      petal.style.opacity = "0.75";
    }
  }, 16);
}

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 页面打开后，代表一位访客来过，只掉一片
window.addEventListener("load", () => {
  dropOnePetal();
});
