/*document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.createElement("div");
    toggle.classList.add("togglebox");
    const title = document.createElement("p");
    title.textContent = "Enable Themes";
    toggle.appendChild(title);
    document.getElementById("toggles").appendChild(toggle);
});*/
import yaml from "js-yaml";
function createThemeCard(theme) {
    const card = createAndAssignClass("div", "card");
    const thumbnail = createAndAssignClass("img", "card-image");
    const card_content = createAndAssignClass("div", "card-content");
    const card_title_row = createAndAssignClass("div", "title-row");
    const header = document.createElement("h3");
    const apply_button = createAndAssignClass("button", "card-apply");
    const summary = document.createElement("p");

    header.textContent = theme.name || "Theme";
    summary.textContent = theme.summary || "No summary provided.";
    thumbnail.src = theme.thumbnail || "";
    apply_button.textContent = "Apply";
    
    apply_button.addEventListener("click", () => {
        applyTheme(theme.id, apply_button);
    });

    card_title_row.appendChild(header);
    card_title_row.appendChild(apply_button);
    card_content.appendChild(card_title_row);
    card_content.appendChild(summary);
    card.appendChild(thumbnail);
    card.appendChild(card_content);
    document.getElementById("card-container").appendChild(card);
    console.log("Created theme card: ", theme.name, theme.summary, theme.image);
};

function createAndAssignId(elementType, id) {
    const element = document.createElement(elementType || "div");
    element.setAttribute("id", id || "unknown-id");
    return element;
};

function createAndAssignClass(elementType, className) {
    const element = document.createElement(elementType || "div");
    element.classList.add(className || "unknown-class");
    return element;
};

function createThemeLink(name, summary, image, authors, id) {
    const theme = {
        name: name,
        id: id || crypto.randomUUID(),
        //description: description,
        summary: summary,
        thumbnail: image,
        authors: authors,
        linkedRepositories: ["Classroom+ Official Repository"]
    };
    createThemeCard(theme);
};

function activateTab(id) {
    for (const item of document.getElementById("content").children) {
        item.style.display = "none";
    };
    document.getElementById(id).style.display = "block";
};
activateTab("themes");

function registerTabButtons() {
    for (const item of document.getElementById("sidebar").children) {
        if (item instanceof HTMLButtonElement) {
            const linkedTab = item.getAttribute("tab");
            if (!linkedTab) continue;
            item.addEventListener("click", () => {
                activateTab(linkedTab);
            })
        }
    };
};
registerTabButtons();

function applyTheme(themeId, applyButton) {
    chrome.storage.sync.set({activeThemeId: themeId}).then(() => {
        console.log("Theme applied:", themeId);
        if (applyButton) {
            applyButton.textContent = "✓";
            applyButton.style.backgroundColor = "green";
        }
    });
};

async function loadContent(path) {
    const response = await fetch(chrome.runtime.getURL(path));
    return await response.text();
}

async function loopThemeList() {
    const themeFile = await loadContent("../src/modules/themes.yml");
    const themeList = yaml.load(themeFile);
    for (const object in themeList) {
        const obj = themeList[object];
        createThemeLink(obj.name, obj.summary, obj.thumbnail, obj.authors, object);
    }
};
loopThemeList();

//createThemeLink("Space Theme", "The classic Space Theme, built for Google Classroom!", "space.jpg", "solarcosmic");
//createThemeLink("Testing Theme", "This is a testing theme!", "space.jpg", "solarcosmic");