let websiteInput = document.getElementById('website-input');
let addWebsiteButton = document.getElementById('add-website');
let websiteList = document.getElementById('website-list');

// Load existing websites and display them
chrome.storage.sync.get(['websites'], function(result) {
  if (result.websites && result.websites.length > 0) {
    result.websites.forEach(addWebsiteToList);
  } else {
    let noWebsiteMsg = document.getElementById('no-website-msg');
    noWebsiteMsg.style.display = 'block'; // Show the "no website added" message
  }
});
// Add new website to list when button is clicked
addWebsiteButton.addEventListener('click', function() {
  let website = websiteInput.value;
  if (website) {
    chrome.storage.sync.get(['websites'], function(result) {
      let websites = result.websites || [];
      if (!websites.includes(website)) {
        websites.push(website);
        chrome.storage.sync.set({websites: websites}, function() {
          addWebsiteToList(website);
          websiteInput.value = '';
        });
      }
    });
  }
});

// Function to add website to display list
function addWebsiteToList(website) {
  let websiteElement = document.createElement('p');
  websiteElement.textContent = website;
  let removeButton = document.createElement('button');
  removeButton.textContent = 'Remove';
  removeButton.addEventListener('click', function() {
    chrome.storage.sync.get(['websites'], function(result) {
      let websites = result.websites || [];
      websites = websites.filter(w => w !== website);
      chrome.storage.sync.set({websites: websites}, function() {
        websiteList.removeChild(websiteElement);
        if (websiteList.childElementCount === 1) { // Check if only the "no website added" message is left
          let noWebsiteMsg = document.getElementById('no-website-msg');
          noWebsiteMsg.style.display = 'block'; // Show the "no website added" message
        }
      });
    });
  });
  websiteElement.appendChild(removeButton);
  websiteList.appendChild(websiteElement);
  
  let noWebsiteMsg = document.getElementById('no-website-msg');
  noWebsiteMsg.style.display = 'none'; // Hide the "no website added" message
}