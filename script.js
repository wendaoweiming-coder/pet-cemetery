// 留言功能
function addMessage() {
  const input = document.getElementById('messageInput');
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
  const p = document.createElement('p');
  p.textContent = name;
  list.appendChild(p);
}

// 简单花瓣动画
function createPetal() {
  const petal = document.createElement('div');
  petal.className = 'petal';
  petal.style.position = 'fixed';
  petal.style.left = Math.random()*window.innerWidth + 'px';
  petal.style.top = '-20px';
  petal.style.fontSize = (10+Math.random()*20)+'px';
  petal.textContent = '🌸';
  document.getElementById('petals').appendChild(petal);
  let top = -20;
  const interval = setInterval(()=>{
    top += 2 + Math.random()*3;
    petal.style.top = top + 'px';
    if(top>window.innerHeight){
      petal.remove();
      clearInterval(interval);
    }
  }, 50);
}

setInterval(createPetal, 500);

// 可以后续扩展：萤火虫、落叶、藤蔓动画
