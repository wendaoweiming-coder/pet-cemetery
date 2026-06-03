// 保存创建的墓碑
function saveMemorial() {
  const name = document.getElementById("petName")?.value.trim();
  const years = document.getElementById("petYears")?.value.trim();
  const memory = document.getElementById("petMemory")?.value.trim();
  const photoInput = document.getElementById("petPhoto");

  if (!name) {
    alert("请填写宠物名字");
    return;
  }

  const memorial = {
    name: name,
    years: years || "永远被爱记得",
    memory: memory || "谢谢你陪我们走过那么多温柔的日子。",
    photo: ""
  };

  if (photoInput && photoInput.files && photoInput.files[0]) {
    const reader = new FileReader();

    reader.onload = function(event) {
      memorial.photo = event.target.result;
      localStorage.setItem("myPetMemorial", JSON.stringify(memorial));
      window.location.href = "cemetery.html";
    };

    reader.readAsDataURL(photoInput.files[0]);
  } else {
    localStorage.setItem("myPetMemorial", JSON.stringify(memorial));
    window.location.href = "cemetery.html";
  }
}

// 读取墓碑资料
function loadMemorial() {
  const saved = localStorage.getItem("myPetMemorial");
  if (!saved) return;

  const memorial = JSON.parse(saved);

  const nameDisplay = document.getElementById("petNameDisplay");
  const yearsDisplay = document.getElementById("petYearsDisplay");
  const memoryDisplay = document.getElementById("petMemoryDisplay");
  const photoDisplay = document.getElementById("petPhotoDisplay");

  if (nameDisplay) nameDisplay.textContent = memorial.name;
  if (yearsDisplay) yearsDisplay.textContent = memorial.years;
  if (memoryDisplay) memoryDisplay.textContent = memorial.memory;

  if (photoDisplay && memorial.photo) {
    photoDisplay.innerHTML = "";
    const img = document.createElement("img");
    img.src = memorial.photo;
    img.alt = memorial.name;
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "cover";
    img.style.borderRadius = "50%";
    photoDisplay.appendChild(img);
  }
}

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

// 召唤小动物
function callAnimal(type) {
  const animals = document.getElementById("animals");
  if (!animals) return;

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

  setTimeout(() => {
    animal.style.transition = "left 5s ease-in-out, top 5s ease-in-out";

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
  }, 3200);

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
  }, 8500);
}

// 点击小动物互动
function touchAnimal(animal, type) {
  animal.classList.remove("touched");
  void animal.offsetWidth;
  animal.classList.add("touched");

  if (type === "cat") setStatus("你轻轻摸了摸小猫，它蹭了蹭你。");
  if (type === "dog") setStatus("你摸了摸小狗，它开心地靠近了一点。");
  if (type === "bird") setStatus("小鸟歪着头看了看你，没有飞走。");
  if (type === "butterfly") setStatus("蝴蝶轻轻扇了扇翅膀。");
}

// 模拟小动物去别人的墓碑
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

// 留下脚印
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

// 每位访客进入，只掉一片花瓣
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

// 页面打开后运行
window.addEventListener("load", () => {
  loadMemorial();
  dropOnePetal();
});
