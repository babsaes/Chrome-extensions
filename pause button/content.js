let promptTimeout;
let popupShown = false;

const prompts = [
  "Sure you want to continue?",
  "Nothing interesting to see.",
  // "Have a life."

];

function createOverlay() {
  const overlay = document.createElement("div");
  overlay.id = "blueOverlay";
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.background = "rgba(94, 94, 94, 0.6)";
  overlay.style.zIndex = "9999";
  overlay.style.opacity = "1";
  overlay.style.backdropFilter = "blur(30px)";



  const redOverlay = document.createElement("div");
  redOverlay.id = "redOverlay";
  redOverlay.style.position = "fixed";
  redOverlay.style.top = "100vh"; // Set initial position below the viewport
  redOverlay.style.left = "0";
  redOverlay.style.width = "100%";
  redOverlay.style.height = "100vh";
  redOverlay.style.background = "rgba(94, 94, 94, 0.4)";
  redOverlay.style.zIndex = "10000";
  redOverlay.style.transition = "top 5s ease-in-out";
  redOverlay.style.backdropFilter = "blur(16px)";

  document.body.appendChild(overlay);
  document.body.appendChild(redOverlay);

  redOverlay.offsetHeight;

  redOverlay.style.top = "0"; // Move to the top
}

function createPromptOverlay() {
  const overlay = document.createElement("div");
  overlay.id = "mindfulBrowsingOverlay";
  overlay.style.position = "fixed";
  overlay.style.top = "42vh";
  overlay.style.zIndex = "10000";
  overlay.style.opacity = "0"; // Add this line
  overlay.style.transition = "opacity 1s ease-in-out";
  overlay.style.width = "60%";
  overlay.style.marginLeft = "20%";

  const shadowRoot = overlay.attachShadow({ mode: "open" });
  const wrapper = document.createElement("div");
  wrapper.style.fontFamily = "Helvetica, sans-serif";
  wrapper.style.fontSize = "61px";

  wrapper.style.opacity = "0.8";

  wrapper.style.lineHeight = "50px";
  wrapper.style.color = "rgba(255, 255, 255,1)";
  wrapper.style.fontWeight = "light";
  wrapper.style.textAlign = "center";
  wrapper.style.margin = "0 auto";

  const promptContainer = document.createElement("div");
  const promptText = document.createElement("div");
  promptText.id = "mindfulBrowsingPromptText";
  promptText.style.fontWeight = "light";
  promptContainer.appendChild(promptText);
  wrapper.appendChild(promptContainer);

  const buttonContainer = document.createElement("div");
  buttonContainer.style.display = "none";
  wrapper.appendChild(buttonContainer);

  shadowRoot.appendChild(wrapper);
  setTimeout(() => {
    overlay.style.transition = "opacity 2s ease-in-out";
  }, 3000); // Change delay to 3 seconds

  return { overlay, wrapper, buttonContainer }; 
}

function createCloseButton() {
  const closeButton = document.createElement("button");
  closeButton.innerText = "Let me scroll";

      closeButton.style.marginLeft = "24%";

  closeButton.style.marginTop = "15px";
  closeButton.style.padding = "15px";

  closeButton.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
  closeButton.style.color = "rgba(255, 255, 255, 1)";
  closeButton.style.fontSize = "20px";
  closeButton.style.width = "25%";
  closeButton.style.margin = "0 auto";
  closeButton.style.opacity = "0"; // Set opacity to 0 initially
  closeButton.style.pointerEvents = "none"; // Set pointer-events to none initially
  closeButton.style.transition = "opacity 1s ease-in-out, pointer-events 0s ease-in-out 5s"; // Add transition for pointer-events
  closeButton.style.border = "none";
  closeButton.style.display = "block";
  closeButton.style.borderRadius = "8px";
  closeButton.style.cursor = "pointer";
  closeButton.style.borderRadius = "15px";
  closeButton.style.border = "1px solid rgba(255, 255, 255, 0.6)";

    closeButton.style.marginLeft = "24%";
        closeButton.style.marginRight = "2%";


    closeButton.style.minWidth = "25%";
    closeButton.style.marginTop = "35vh";
    closeButton.style.float = "left";


  closeButton.onclick = () => {
    const promptOverlay = document.getElementById("mindfulBrowsingOverlay");
    promptOverlay.style.display = "none";
    document.body.style.overflow = "auto";

    // Remove the blueoverlay and the redoverlay
    clearTimeout(promptTimeout);
    const blueOverlay = document.getElementById("blueOverlay");
    if (blueOverlay) {
      blueOverlay.style.opacity = "1";
      setTimeout(() => {
        blueOverlay.remove();
      }, 0);
    }

    // element will disapear
    const redOverlay = document.getElementById("redOverlay");
    if (redOverlay) {
      redOverlay.style.top = "100%";
      setTimeout(() => {
        redOverlay.remove();
      }, 5000);
    }
  };

  // Setting opacity to 1 after 5 seconds
  setTimeout(() => {
    closeButton.style.opacity = "1";
    closeButton.style.pointerEvents = "auto";
  }, 5000);

  return closeButton;
}



function createCloseTabButton() {
  const closeTabButton = document.createElement("button");

  closeTabButton.innerText = "Close website";
  closeTabButton.style.padding = "15px";
  closeTabButton.style.backgroundColor = "rgba(255, 255, 255, 1)";
  closeTabButton.style.color = "rgba(94, 94, 94, 1)";
  closeTabButton.style.fontSize = "20px";
  closeTabButton.style.width = "25%";
    closeTabButton.style.minWidth = "25%";
    closeTabButton.style.float = "left";
  closeTabButton.style.margin = "0 auto";
  closeTabButton.style.marginTop = "35vh";
  closeTabButton.style.opacity = "0";
  closeTabButton.style.transition = "opacity 1s ease-in-out, pointer-events 0s ease-in-out 5s";
  closeTabButton.style.display = "block";
  closeTabButton.style.border = "1px solid rgba(255, 255, 255, 1)";
  closeTabButton.style.borderRadius = "15px";
  closeTabButton.style.cursor = "pointer";
  closeTabButton.style.pointerEvents = "none";
    closeTabButton.style.marginRight = "24%";
        closeTabButton.style.float = "left";


  closeTabButton.onclick = () => {
    chrome.runtime.sendMessage({ action: "closeTab" });
  };
  closeTabButton.style.backdropFilter = "blur(30px)";

  setTimeout(() => {
    closeTabButton.style.opacity = "1";
    closeTabButton.style.pointerEvents = "auto";
  }, 5000);

  return closeTabButton;
}


function displayPrompt() {
  const promptIndex = Math.floor(Math.random() * prompts.length);
  const promptOverlay = document.getElementById("mindfulBrowsingOverlay");
  const promptText = promptOverlay.shadowRoot.querySelector("#mindfulBrowsingPromptText");
  promptText.innerText = prompts[promptIndex];
  promptText.style.fontWeight = "bold";
  promptOverlay.style.display = "block";
  promptOverlay.style.opacity = "1"; // Add this line
  document.body.style.overflow = "hidden"; // Disable scrolling

  setTimeout(() => {
    const buttonContainer = promptOverlay.shadowRoot.querySelector(".button-container");
    if (buttonContainer) {
      buttonContainer.style.display = "block";
    }
  }, 5000); // Change delay to 5 seconds
}

function checkScrollPermission() {
  const allowScroll = localStorage.getItem("allowScroll") === "true";
  return allowScroll;
}

function removeOverlays() {
  const blueOverlay = document.getElementById("blueOverlay");
  if (blueOverlay) {
    blueOverlay.remove();
  }

  const redOverlay = document.getElementById("redOverlay");
  if (redOverlay) {
    redOverlay.remove();
  }
}

// Check if the user has chosen to let the scroll
const allowScroll = checkScrollPermission();

// Create overlays only if scrolling is not allowed
if (!allowScroll) {
  // Create overlays and prompt overlay
  createOverlay();
  const { overlay, wrapper, buttonContainer } = createPromptOverlay();
  const promptText = document.createElement("div");
  promptText.id = "mindfulBrowsingPromptText";
  promptText.style.fontWeight = "light";
  wrapper.appendChild(promptText);
  const closeButton = createCloseButton();
  buttonContainer.appendChild(closeButton);
  const closeTabButton = createCloseTabButton();
  buttonContainer.appendChild(closeTabButton);

  document.body.appendChild(overlay);

  setTimeout(() => {
    displayPrompt();
    buttonContainer.style.display = "block";
  });
} else {
  // Remove the overlays
  removeOverlays();
}

// Listen for click events on the page
document.addEventListener("click", function (event) {
  const closeButton = document.getElementById("closeButton");

  if (event.target === closeButton) {
    localStorage.setItem("allowScroll", "true");

    // Remove the overlays
    removeOverlays();
  }
});


