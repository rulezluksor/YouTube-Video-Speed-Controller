chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && tab.url.includes('youtube.com/watch')) {
    chrome.tabs.sendMessage(tabId, { action: "getVideoId" }, (response) => {
      if (response && response.videoId !== undefined) {
        chrome.storage.local.set({ currentVideoId: response.videoId });
      }
    });
  }
});