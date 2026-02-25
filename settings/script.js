/*document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.createElement("div");
    toggle.classList.add("togglebox");
    const title = document.createElement("p");
    title.textContent = "Enable Themes";
    toggle.appendChild(title);
    document.getElementById("toggles").appendChild(toggle);
});*/
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
        console.log("Theme clicked: " + theme.title);
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

function createThemeLink(name, summary, image, authors) {
    const theme = {
        name: name,
        //description: description,
        summary: summary,
        thumbnail: image,
        authors: authors,
        linkedRepositories: []
    };
    createThemeCard(theme);
}

createThemeLink("Space Theme", "The classic Space Theme, built for Google Classroom!", "space.jpg", "solarcosmic");
createThemeLink("Testing Theme", "This is a testing theme!", "space.jpg", "solarcosmic");