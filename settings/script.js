/*document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.createElement("div");
    toggle.classList.add("togglebox");
    const title = document.createElement("p");
    title.textContent = "Enable Themes";
    toggle.appendChild(title);
    document.getElementById("toggles").appendChild(toggle);
});*/
function createThemeCard(title, summary, image) {
    const card = createAndAssignClass("div", "card");
    const thumbnail = createAndAssignClass("img", "card-image");
    const card_content = createAndAssignClass("div", "card-content");
    const card_title_row = createAndAssignClass("div", "title-row");
    const header = document.createElement("h3");
    const apply_button = createAndAssignClass("button", "card-apply");
    const description = document.createElement("p");

    header.textContent = title || "Theme";
    description.textContent = summary || "No description provided.";
    thumbnail.src = image || "";
    apply_button.textContent = "Apply";
    
    apply_button.addEventListener("click", () => {
        console.log("Theme clicked: " + title);
    });

    card_title_row.appendChild(header);
    card_title_row.appendChild(apply_button);
    card_content.appendChild(card_title_row);
    card_content.appendChild(description);
    card.appendChild(thumbnail);
    card.appendChild(card_content);
    document.getElementById("theme-container").appendChild(card);
    console.log("Created theme card: ", title, summary, image);
};
createThemeCard("Space Theme", "The classic Space Theme, built for Google Classroom!", "space.jpg");
createThemeCard("Testing Theme", "This is a testing theme!", "space.jpg");

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