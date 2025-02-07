// Создаем элемент отображения скорости
const speedDisplay = document.createElement("div");
speedDisplay.style.position = "fixed";
speedDisplay.style.bottom = "10px";
speedDisplay.style.left = "10px";
speedDisplay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
speedDisplay.style.color = "white";
speedDisplay.style.padding = "5px";
speedDisplay.style.borderRadius = "5px";
speedDisplay.style.zIndex = "1000";
speedDisplay.style.fontSize = "14px";
speedDisplay.innerText = `1.0x`;

document.body.appendChild(speedDisplay);

// Функция для обновления скорости
const updateSpeed = (speed) => {
  const videos = document.querySelectorAll("video");
  videos.forEach((video) => {
    video.playbackRate = speed;
  });
  speedDisplay.innerText = `${speed.toFixed(2)}x`; // Отображаем только значение скорости
};

// Устанавливаем базовую скорость из хранилища и применяем ко всем видео
chrome.storage.sync.get("speed", (data) => {
  const defaultSpeed = data.speed || 1.0;
  updateSpeed(defaultSpeed);
});

// Слушаем изменения в хранилище и обновляем текущую скорость
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "sync" && changes.speed) {
    const newSpeed = changes.speed.newValue;
    updateSpeed(newSpeed);
  }
});

// Слушаем сообщения от popup.js для изменения скорости текущего видео
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "changeCurrentSpeed") {
    updateSpeed(message.speed);
  }
  if (message.action === "getCurrentSpeed") {
    const videos = document.querySelectorAll("video");
    const currentSpeed = videos[0]?.playbackRate || 1.0;
    sendResponse({ speed: currentSpeed });
  }
});

// Функция для проверки полноэкранного режима
const checkFullScreen = () => {
  if (document.fullscreenElement) {
    speedDisplay.style.display = "none";
  } else {
    speedDisplay.style.display = "block";
  }
};

// Слушаем события перехода в полноэкранный режим и выхода из него
document.addEventListener("fullscreenchange", checkFullScreen);
document.addEventListener("webkitfullscreenchange", checkFullScreen);
document.addEventListener("mozfullscreenchange", checkFullScreen);
document.addEventListener("msfullscreenchange", checkFullScreen);

// Слушаем события прокрутки колесика мыши с нажатым Shift для изменения текущей скорости
document.addEventListener("wheel", (event) => {
  if (event.shiftKey) {
    const videos = document.querySelectorAll("video");
    let currentSpeed = videos[0]?.playbackRate || 1.0;
    if (event.deltaY < 0) {
      currentSpeed = Math.min(currentSpeed + 0.05, 2.0);
    } else {
      currentSpeed = Math.max(currentSpeed - 0.05, 0.25);
    }
    updateSpeed(currentSpeed);
    event.preventDefault();
  }
}, { passive: false });