document.querySelector("button").addEventListener("click", () => {
    // Send a message to the content script to execute the script on the user page
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { message: "executeScriptOnUserPage" });
    });
});