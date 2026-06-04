function compressImage(file, maxSize = 1000, quality = 0.72) {
  return new Promise(function(resolve) {
    if (!file) {
      resolve(null);
      return;
    }

    const reader = new FileReader();

    reader.onload = function(event) {
      const img = new Image();

      img.onload = function() {
        let width = img.width;
        let height = img.height;

        if (width > height && width > maxSize) {
          height = Math.round(height * maxSize / width);
          width = maxSize;
        } else if (height > maxSize) {
          width = Math.round(width * maxSize / height);
          height = maxSize;
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        resolve(canvas.toDataURL("image/jpeg", quality));
      };

      img.src = event.target.result;
    };

    reader.readAsDataURL(file);
  });
}

async function compressMultipleImages(files) {
  if (!files || files.length === 0) {
    return [];
  }

  const fileArray = Array.from(files);
  const results = [];

  for (let i = 0; i < fileArray.length; i++) {
    const compressed = await compressImage(fileArray[i]);
    if (compressed) {
      results.push(compressed);
    }
  }

  return results;
}

async function saveMemorial() {
  try {
    const nameInput = document.getElementById("petName");
    const birthInput = document.getElementById("petBirthDate");
    const leaveInput = document.getElementById("petLeaveDate");
    const epitaphInput = document.getElementById("petMemory");
    const storyInput = document.getElementById("petStory");
    const stonePhotoInput = document.getElementById("petPhoto");
    const publicPhotosInput = document.getElementById("publicPhotos");
    const privatePhotosInput = document.getElementById("privatePhotos");

    const name = nameInput ? nameInput.value.trim() : "";
    const birthDate = birthInput ? birthInput.value : "";
    const leaveDate = leaveInput ? leaveInput.value : "";
    const epitaph = epitaphInput ? epitaphInput.value.trim() : "";
    const story = storyInput ? storyInput.value.trim() : "";

    const visibilityInput = document.querySelector("input[name='memorialVisibility']:checked");
    const visibility = visibilityInput ? visibilityInput.value : "public";

    if (!name) {
      alert("请填写宠物名字 / Please enter your pet's name.");
      return;
    }

    if (birthDate && leaveDate && birthDate > leaveDate) {
      alert("出生日期不能晚于离开日期 / Birth date cannot be later than leaving date.");
      return;
    }

    const oldData = JSON.parse(localStorage.getItem("myPetMemorial") || "{}");

    const newStonePhoto = stonePhotoInput && stonePhotoInput.files[0]
      ? await compressImage(stonePhotoInput.files[0])
      : null;

    const newPublicPhotos = publicPhotosInput
      ? await compressMultipleImages(publicPhotosInput.files)
      : [];

    const newPrivatePhotos = privatePhotosInput
      ? await compressMultipleImages(privatePhotosInput.files)
      : [];

    const memorial = {
      name: name,
      birthDate: birthDate,
      leaveDate: leaveDate,

      memory: epitaph,
      epitaph: epitaph,
      story: story,

      visibility: visibility,

      tombstoneStyle: oldData.tombstoneStyle || "rounded",

      photo: newStonePhoto || oldData.photo || "",

      publicPhotos: [
        ...(oldData.publicPhotos || []),
        ...newPublicPhotos
      ],

      privatePhotos: [
        ...(oldData.privatePhotos || []),
        ...newPrivatePhotos
      ],

      updatedAt: new Date().toISOString()
    };

    localStorage.setItem("myPetMemorial", JSON.stringify(memorial));

    // 关键修改：保存信息后，先进入选择墓碑页面
    window.location.href = "select-stone.html";

  } catch (error) {
    console.error(error);
    alert("保存失败。请先少上传几张照片，或换小一点的照片。");
  }
}

function loadCreateForm() {
  const data = JSON.parse(localStorage.getItem("myPetMemorial") || "{}");

  const nameInput = document.getElementById("petName");
  const birthInput = document.getElementById("petBirthDate");
  const leaveInput = document.getElementById("petLeaveDate");
  const epitaphInput = document.getElementById("petMemory");
  const storyInput = document.getElementById("petStory");

  if (nameInput && data.name) nameInput.value = data.name;
  if (birthInput && data.birthDate) birthInput.value = data.birthDate;
  if (leaveInput && data.leaveDate) leaveInput.value = data.leaveDate;
  if (epitaphInput) epitaphInput.value = data.epitaph || data.memory || "";
  if (storyInput) storyInput.value = data.story || "";

  if (data.visibility) {
    const visibilityInput = document.querySelector(
      "input[name='memorialVisibility'][value='" + data.visibility + "']"
    );

    if (visibilityInput) {
      visibilityInput.checked = true;
    }
  }
}

function loadMemorial() {
  const data = JSON.parse(localStorage.getItem("myPetMemorial") || "{}");

  const nameDisplay = document.getElementById("petNameDisplay");
  const yearsDisplay = document.getElementById("petYearsDisplay");
  const memoryDisplay = document.getElementById("petMemoryDisplay");
  const photoDisplay = document.getElementById("petPhotoDisplay");
  const stoneDisplay = document.getElementById("memorialStone");

  if (!nameDisplay) return;

  nameDisplay.textContent = data.name || "Luna";

  if (yearsDisplay) {
    yearsDisplay.textContent =
      (data.birthDate || "----") + "  —  " + (data.leaveDate || "----");
  }

  if (memoryDisplay) {
    memoryDisplay.textContent = data.epitaph || data.memory || "You are loved, always.";
  }

  if (photoDisplay) {
    if (data.photo) {
      photoDisplay.innerHTML =
        '<img src="' + data.photo + '" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">';
    } else {
      photoDisplay.textContent = "🐾";
    }
  }

  if (stoneDisplay) {
    stoneDisplay.classList.remove(
      "memorial-stone-rounded",
      "memorial-stone-square",
      "memorial-stone-heart",
      "memorial-stone-arch",
      "memorial-stone-small"
    );

    const style = data.tombstoneStyle || "rounded";
    stoneDisplay.classList.add("memorial-stone-" + style);
  }
}

function addMessage() {
  const messageInput = document.getElementById("messageInput");
  const messageList = document.getElementById("messageList");

  if (!messageInput || !messageList) return;

  const text = messageInput.value.trim();
  if (!text) return;

  const item = document.createElement("div");
  item.className = "message-item";
  item.textContent = text;

  messageList.prepend(item);
  messageInput.value = "";
}

function placeGift(type) {
  const placedItems = document.getElementById("placedItems");
  const status = document.getElementById("animalStatus");

  if (!placedItems) return;

  const gift = document.createElement("div");
  gift.className = "scene-item";

  const positions = [
    { left: 220, bottom: 84 },
    { left: 300, bottom: 70 },
    { left: 410, bottom: 82 },
    { left: 500, bottom: 72 }
  ];

  const position = positions[Math.floor(Math.random() * positions.length)];

  gift.style.left = position.left + "px";
  gift.style.bottom = position.bottom + "px";

  if (type === "can") {
    gift.textContent = "🥫";
    if (status) status.textContent = "A small can has been placed quietly near the memorial.";
    callAnimal("cat");
  }

  if (type === "ball") {
    gift.textContent = "🎾";
    if (status) status.textContent = "A ball rests softly on the grass.";
    callAnimal("dog");
  }

  if (type === "seed") {
    gift.textContent = "🌾";
    if (status) status.textContent = "Some seeds have been scattered gently.";
    callAnimal("bird");
  }

  if (type === "flower") {
    gift.textContent = "💐";
    if (status) status.textContent = "Fresh flowers have been placed beside the stone.";
    callAnimal("butterfly");
  }

  placedItems.appendChild(gift);
}

function callAnimal(type) {
  const animals = document.getElementById("animals");
  const status = document.getElementById("animalStatus");

  if (!animals) return;

  if (document.querySelector(".animal-" + type)) {
    if (status) status.textContent = "It is already staying nearby.";
    return;
  }

  const animal = document.createElement("div");
  animal.className = "animal animal-" + type;

  if (type === "cat") {
    animal.textContent = "🐈";
    animal.style.left = "-60px";
    animal.style.bottom = "112px";
  }

  if (type === "dog") {
    animal.textContent = "🐕";
    animal.style.right = "-70px";
    animal.style.bottom = "110px";
  }

  if (type === "bird") {
    animal.textContent = "🐦";
    animal.style.left = "360px";
    animal.style.top = "-50px";
  }

  if (type === "butterfly") {
    animal.textContent = "🦋";
    animal.style.left = "-50px";
    animal.style.top = "170px";
  }

  animal.onclick = function() {
    touchAnimal(animal, type);
  };

  animals.appendChild(animal);

  setTimeout(function() {
    if (type === "cat") animal.style.left = "80px";
    if (type === "dog") animal.style.right = "80px";
    if (type === "bird") animal.style.top = "130px";
    if (type === "butterfly") animal.style.left = "150px";
  }, 400);

  setTimeout(function() {
    if (type === "cat") animal.style.left = "245px";
    if (type === "dog") animal.style.right = "245px";
    if (type === "bird") animal.style.top = "250px";
    if (type === "butterfly") animal.style.left = "330px";
  }, 3200);

  setTimeout(function() {
    animal.classList.add("resting");

    if (status) {
      if (type === "cat") status.textContent = "A cat has curled up quietly near the gift.";
      if (type === "dog") status.textContent = "A dog is resting near the ball.";
      if (type === "bird") status.textContent = "A bird has stopped nearby for a moment.";
      if (type === "butterfly") status.textContent = "A butterfly is circling the flowers softly.";
    }
  }, 8500);
}

function touchAnimal(animal, type) {
  const status = document.getElementById("animalStatus");

  animal.classList.remove("touched");
  void animal.offsetWidth;
  animal.classList.add("touched");

  if (!status) return;

  if (type === "cat") status.textContent = "The cat gently leans into your touch.";
  if (type === "dog") status.textContent = "The dog looks up, as if it understands.";
  if (type === "bird") status.textContent = "The bird tilts its head and watches you.";
  if (type === "butterfly") status.textContent = "The butterfly flutters a little closer.";
}

function searchAnimal() {
  const names = ["Milo", "Nana", "Coco", "Snow", "Lucky"];
  const randomName = names[Math.floor(Math.random() * names.length)];
  const status = document.getElementById("animalStatus");

  if (status) {
    status.textContent = "A small pawprint leads toward " + randomName + "'s memorial.";
  }

  leaveTrace();
}

function leaveTrace() {
  const traces = document.getElementById("traces");
  if (!traces) return;

  const trace = document.createElement("div");
  trace.className = "trace";
  trace.textContent = "🐾";
  trace.style.left = Math.floor(180 + Math.random() * 360) + "px";
  trace.style.bottom = Math.floor(60 + Math.random() * 120) + "px";

  traces.appendChild(trace);
}

function dropOnePetal() {
  const petals = document.getElementById("petals");
  if (!petals) return;

  const petal = document.createElement("div");
  petal.className = "petal";

  const startLeft = Math.floor(260 + Math.random() * 220);
  const endBottom = Math.floor(78 + Math.random() * 45);

  petal.style.left = startLeft + "px";
  petal.style.top = "-30px";

  petals.appendChild(petal);

  let top = -30;
  let rotate = 0;

  const fall = setInterval(function() {
    top += 1.1;
    rotate += 2;

    petal.style.top = top + "px";
    petal.style.transform =
      "translateX(" + Math.sin(top / 28) * 24 + "px) rotate(" + rotate + "deg)";

    if (top > 540 - endBottom) {
      clearInterval(fall);
      petal.style.top = "auto";
      petal.style.bottom = endBottom + "px";
    }
  }, 28);
}

window.addEventListener("load", function() {
  loadCreateForm();
  loadMemorial();
  dropOnePetal();
});
