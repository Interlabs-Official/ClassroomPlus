async function loadContent(path) {
    const response = await fetch(chrome.runtime.getURL(path));
    return await response.text();
}

async function loadMappings() {
    const temp = await loadContent("themes/dark.css");
    const style = document.createElement("style");
    style.textContent = temp;
    document.head.appendChild(style);
}