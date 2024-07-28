function addWebsite(website) {
  const currentTime = new Date().getTime();
  chrome.storage.sync.get({websites: []}, function(result) {
    let websites = result.websites;
    let websiteObj = {name: website, addTime: currentTime};

    if (!websites.find(website => website.name === websiteObj.name)) {
      websites.push(websiteObj);
      chrome.storage.sync.set({websites: websites}, function() {
        loadWebsites();
      });
    }
  });
}

function removeWebsite(website) {
  chrome.storage.sync.get({websites: []}, function(result) {
    let websites = result.websites;
    let websiteObj = websites.find(web => web.name === website);

    if (websiteObj) {
      const currentTime = new Date().getTime();
      if (currentTime - websiteObj.addTime < 24 * 60 * 60 * 1000) { // less than 24 hours
        alert("No no no, you can't remove this link within 24 hours of adding");
        return;
      }

      websites = websites.filter(web => web.name !== website);
      chrome.storage.sync.set({websites: websites}, function() {
        loadWebsites();
      });
    }
  });
}

function loadWebsites() {
  chrome.storage.sync.get({websites: []}, function(result) {
    let websitesList = document.getElementById('websitesList');
    websitesList.innerHTML = '';
    result.websites.forEach(websiteObj => {
      let li = document.createElement('li');
      li.textContent = websiteObj.name;

      let button = document.createElement('button');
      button.textContent = 'Remove';
      button.classList.add('remove-btn');
      button.addEventListener('click', function() {
        removeWebsite(websiteObj.name);
      });

      li.appendChild(button);
      websitesList.appendChild(li);
    });
  });
}

document.querySelector("#addWebsite").addEventListener('click', function() {
  const website = document.querySelector("#website").value;
  addWebsite(website);
});

loadWebsites();


