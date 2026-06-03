// 留言功能
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

// 祭品摆放
function placeGift(type) {
  const placedItems = document.getElementById("placedItems");
  if (!placedItems) return;

  const item = document.createElement("div");
  item.className = "scene-item";

  if (type === "can") {
    item.textContent = "🥫";
    item.style.left = randomBetween(345, 420) + "px";
    item.style.top = randomBetween(392, 428) + "px";
    placedItems.appendChild(item);

    callAnimal("cat");
    setStatus("罐头的香味飘开了，好像有什么小动物在远处看着这里。");
    return;
  }

  if (type === "ball") {
    item.textContent = "🎾";
    item.style.left = randomBetween(470, 555) + "px";
    item.style.top = randomBetween(390, 428) + "px";
    placedItems.appendChild(item);

    callAnimal("dog");
    setStatus("小球静静地放在墓碑旁，远处好像有小狗注意到了。");
    return;
  }

  if (type === "seed") {
    item.textContent = "🌾";
    item.style.left = randomBetween(250, 330) + "px";
    item.style.top = randomBetween(385, 420) + "px";
    placedItems.appendChild(item);

    callAnimal("bird");
    setStatus("鸟食撒在地上，一只小鸟正在慢慢靠近。");
    return;
  }

  if (type === "flower") {
    item.textContent = "💐";
    item.style.left = randomBetween(180, 250) + "px";
    item.style.top = randomBetween(330, 380) + "px";
    placedItems.appendChild(item);

    callAnimal("butterfly");
    setStatus("花香很轻，吸引来一只安静的蝴蝶。");
    return;
  }
}

// 召唤小动物：不是突然出现，而是从边缘慢慢靠近
function callAnimal(type) {
  const animals = document.getElementById("animals");
  if (!animals) return;

  // 第一版先限制：同类动物只出现一只，避免画面太乱
  if (document.querySelector(`.animal[data-type="${type}"]`)) {
    setStatus(getAnimalName(type) + "已经在这里了，它安静地陪着墓碑。");
    return;
  }

  const animal = document.createElement("div");
  animal.className = "animal";
  animal.dataset.type = type;

  if (type === "cat") {
    animal.textContent = "🐈";
    animal.style.left = "-70px";
    animal.style.top = "350px";
  }

  if (type === "dog") {
    animal.textContent = "🐕";
    animal.style.left = "790px";
    animal.style.top = "350px";
  }

  if (type === "bird") {
    animal.textContent = "🐦";
    animal.style.left = "370px";
    animal.style.top = "-50px";
  }

  if (type === "butterfly") {
    animal.textContent = "🦋";
    animal.style.left = "-50px";
    animal.style.top = "190px";
  }

  animal.onclick = function () {
    touchAnimal(animal, type);
  };

  animals.appendChild(animal);

  // 1. 探头
  setTimeout(() => {
    animal.style.transition = "left 1.8s ease-out, top 1.8s ease-out";

    if (type === "cat") {
      animal.style.left = "18px";
      animal.style.top = "350px";
      setStatus("一只小猫从左边探出了头。");
    }

    if (type === "dog") {
      animal.style.left = "700px";
      animal.style.top = "350px";
      setStatus("一只小狗从右边小心地看了过来。");
    }

    if (type === "bird") {
      animal.style.left = "370px";
      animal.style.top = "60px";
      setStatus("一只小鸟停在了上方，低头看着鸟食。");
    }

    if (type === "butterfly") {
      animal.style.left = "90px";
      animal.style.top = "190px";
      setStatus("蝴蝶慢慢飞进了这片安静的墓园。");
    }
  }, 400);

  // 2. 停一下观察
  setTimeout(() => {
    animal.style.transition = "transform 0.8s ease";
    animal.style.transform = "translateY(-4px)";
  }, 2400);

  setTimeout(() => {
    animal.style.transform = "translateY(0)";
  }, 3200);

  // 3. 慢慢靠近
  setTimeout(() => {
    animal.style.transition = "left 5s ease-in-out, top 5s ease-in-out, transform 0.8s ease";

    if (type === "cat") {
      animal.style.left = "390px";
      animal.style.top = "350px";
      setStatus("小猫确认安全后，慢慢走向罐头。");
    }

    if (type === "dog") {
      animal.style.left = "510px";
      animal.style.top = "350px";
      setStatus("小狗摇着尾巴，慢慢走向小球。");
    }

    if (type === "bird") {
      animal.style.left = "285px";
      animal.style.top = "330px";
      setStatus("小鸟轻轻落下，靠近了鸟食。");
    }

    if (type === "butterfly") {
      animal.style.left = "210px";
      animal.style.top = "285px";
      setStatus("蝴蝶停在花旁边，轻轻扇动翅膀。");
    }
  }, 3800);

  // 4. 吃/玩/停留
  setTimeout(() => {
    animal.classList.add("resting");

    if (type === "cat") {
      setStatus("小猫吃完罐头后，安静地坐在墓碑旁。点击它，可以轻轻摸摸它。");
    }

    if (type === "dog") {
      setStatus("小狗在小球旁趴了下来。点击它，它会亲近你。");
    }

    if (type === "bird") {
      setStatus("小鸟吃了一点鸟食，停在墓碑旁陪伴了一会儿。");
    }

    if (type === "butterfly") {
      setStatus("蝴蝶被花吸引，安静地停在这里。");
    }

    saveAnimalVisit(type);
  }, 9200);
}

// 点击小动物后的互动
function touchAnimal(animal, type) {
  animal.classList.remove("touched");
  void animal.offsetWidth;
  animal.classList.add("touched");

  if (type === "cat") {
    setStatus("你轻轻摸了摸小猫，它蹭了蹭你。");
  }

  if (type === "dog") {
    setStatus("你摸了摸小狗，它开心地靠近了一点。");
  }

  if (type === "bird") {
    setStatus("小鸟歪着头看了看你，没有飞走。");
  }

  if (type === "butterfly") {
    setStatus("蝴蝶轻轻扇了扇翅膀。");
  }
}

// 模拟小动物去别人的墓碑闲逛
function searchAnimal() {
  const places = [
    "小布丁的墓碑",
    "豆豆的纪念花园",
    "雪球的安睡地",
    "阿黄的小石碑",
    "咪咪的星光角落"
  ];

  const place = places[randomBetween(0, places.length - 1)];

  setStatus("你沿着小脚印找过去，发现小动物去了「" + place + "」。以后这里会连接到别人的墓碑故事。");

  leaveTrace();
}

// 留下脚印/痕迹
function leaveTrace() {
  const traces = document.getElementById("traces");
  if (!traces) return;

  const trace = document.createElement("div");
  trace.className = "trace";
  trace.textContent = "🐾";
  trace.style.left = randomBetween(300, 520) + "px";
  trace.style.top = randomBetween(405, 455) + "px";

  traces.appendChild(trace);
}

// 每位访客进入墓碑页，只掉一片花瓣
function dropOnePetal() {
  const petals = document.getElementById("petals");
  if (!petals) return;

  const petal = document.createElement("div");
  petal.className = "petal";

  const startX = randomBetween(300, 470);
  const endX = randomBetween(320, 440);
  const endY = randomBetween(395, 435);

  petal.style.left = startX + "px";
  petal.style.top = "-30px";

  petals.appendChild(petal);

  let progress = 0;

  const timer = setInterval(() => {
    progress += 0.005;

    const sway = Math.sin(progress * 10) * 22;
    const currentX = startX + (endX - startX) * progress + sway;
    const currentY = -30 + (endY + 30) * progress;
    const rotate = progress * 180;

    petal.style.left = currentX + "px";
    petal.style.top = currentY + "px";
    petal.style.transform = "rotate(" + rotate + "deg)";

    if (progress >= 1) {
      clearInterval(timer);
      petal.style.left = endX + "px";
      petal.style.top = endY + "px";
      petal.style.transform = "rotate(35deg)";
      petal.style.opacity = "0.75";
    }
  }, 16);
}

// 记录动物来过，第一版先存在当前浏览器
function saveAnimalVisit(type) {
  const key = "animal_" + type + "_visits";
  const oldValue = Number(localStorage.getItem(key) || "0");
  localStorage.setItem(key, String(oldValue + 1));
}

// 设置提示文字
function setStatus(text) {
  const status = document.getElementById("animalStatus");
  if (!status) return;
  status.textContent = text;
}

function getAnimalName(type) {
  if (type === "cat") return "小猫";
  if (type === "dog") return "小狗";
  if (type === "bird") return "小鸟";
  if (type === "butterfly") return "蝴蝶";
  return "小动物";
}

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 页面打开 = 一位访客来过，只落一片花瓣
window.addEventListener("load", () => {
  dropOnePetal();
});
