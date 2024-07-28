console.log('Content script running');
chrome.storage.sync.get('websites', function(data) {
  console.log('Retrieved websites:', data.websites);
  let url = new URL(window.location.href);
  let hostname = url.hostname.replace('www.', '').toLowerCase();
  console.log('Current hostname:', hostname);
  let websites = data.websites.map(website => website.toLowerCase());
  if (websites.includes(hostname)) {
    console.log('Applying grayscale filter');
    document.body.style.filter = 'grayscale(100%)';
  } else {
    console.log('Not applying grayscale filter');
  }
});
