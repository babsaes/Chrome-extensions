chrome.webNavigation.onCommitted.addListener(function(details) {
  chrome.storage.sync.get({ websites: [] }, function(result) {
    const websites = result.websites.map(web => web.name);
    const url = new URL(details.url);
    const domain = url.hostname;
    const path = url.pathname;

    if (websites.some(website => domain.includes(website) && path === '/')) {
      chrome.tabs.executeScript(details.tabId, {
        file: "content.js"
      });
    }
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "closeTab") {
    chrome.tabs.remove(sender.tab.id);
  }
});

function onExtensionLoad() {
  const isFirstVisit = localStorage.getItem("isFirstVisit") !== "false";
  if (isFirstVisit) {
    localStorage.setItem("isFirstVisit", "false");
    chrome.runtime.reload();
  }
}

onExtensionLoad();

