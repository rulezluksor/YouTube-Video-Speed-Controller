document.addEventListener("DOMContentLoaded", () => {
  const baseSpeedDisplay = document.getElementById("baseSpeedDisplay");
  const saveBaseButton = document.getElementById("saveBaseButton");

  let baseSpeed = 1.0;

  // Обновление отображения базовой скорости
  function updateBaseSpeedDisplay() {
    baseSpeedDisplay.innerText = `${baseSpeed.toFixed(2)}x`;
  }

  // Загружаем сохраненную скорость из хранилища
  chrome.storage.sync.get("speed", (data) => {
    baseSpeed = data.speed || 1.0;
    updateBaseSpeedDisplay();
  });

  // Сохранение новой базовой скорости в хранилище
  saveBaseButton.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "getCurrentSpeed" }, (response) => {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message);
            return;
          }
          if (response && response.speed) {
            baseSpeed = response.speed;
            chrome.storage.sync.set({ speed: baseSpeed }, () => {
              updateBaseSpeedDisplay();
            });
          }
        });
      }
    });
  });
});