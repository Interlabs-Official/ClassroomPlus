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
    return card;
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
    return createThemeCard(theme);
};

function activateTab(id) {
    for (const item of document.getElementById("content").children) {
        item.style.display = "none";
    };
    if (id == "themes") document.title = "⚙ Themes (Settings) / Classroom+";
    document.getElementById(id).style.display = "block";
    if (id == "repositories") {
        document.title = "⚙ Repositories (Settings) / Classroom+";
        chrome.storage.sync.get(["repositoryList"]).then(async (result) => {
            if (!result.repositoryList) {
                var repoList = {}
                repoList["classroomplus.repo"] = {
                    name: "Classroom+ Official Repository",
                    authors: ["solarcosmic", "Convy32"],
                    identifier: "classroomplus.repo", // may be redundant
                    manifest_link: "https://interlabs-official.github.io/classroomplus-repo/manifest.yml"
                };
                chrome.storage.sync.set({repositoryList: JSON.stringify(repoList)});
                activateTab("repositories");
            }
            var repoList;
            try {
                repoList = JSON.parse(result.repositoryList);
            } catch (e) {
                repoList = {};
            };
            document.getElementById("repository-list").innerHTML = "";
            document.getElementById("no-repositories").style.display = "none";
            console.log("Repo list:", repoList);
            if (Object.keys(repoList).length == 0) {
                console.log("testing")
                document.getElementById("no-repositories").style.display = "block";
                return;
            } 
            for (const item in repoList) {
                if (repoList.hasOwnProperty(item)) {
                    const repo = repoList[item];
                    console.log("Repository:", repo);
                    const list_item = createAndAssignClass("div", "repository-list-item");
                    const repo_name = createAndAssignClass("span", "repo-name");
                    const repo_authors = createAndAssignClass("span", "repo-authors");

                    repo_name.textContent = repo.name;
                    repo_authors.textContent = "by " + arrayToString(repo.authors);

                    list_item.appendChild(repo_name);
                    list_item.appendChild(repo_authors);
                    document.getElementById("repository-list").appendChild(list_item);
                }
            }
        });
    }
};
activateTab("themes");

// Credit: GPT-4.1 (this way is much more simple than what I had earlier)
function arrayToString(arr) {
    return Array.isArray(arr) ? arr.join(", ") : String(arr);
}

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



async function addRepo() {
    const url = prompt("Please enter the repository URL:") + "/manifest.yml";
    //if (!url) return;
    if (!isGitHubIOLink(url)) {
        alert("Error adding repository:  Repository must be a github.io link");
        return;
    }
    try {
        const resp = await fetch(url);
        if (!resp.ok) {
            if (resp.status == 404) {
                alert("Error adding repository: Could not find manifest.yml. Make sure there is a valid manifest.yml in the root folder of the repository.");
            } else {
                alert("Error adding repository: Response was not OK: " + resp.status);
            }
        }

        const res = await resp.text();
        const yml = yaml.load(res);
        if (!yml.name || !yml.authors || !yml.identifier) { //  || !yml.themes || !yml.addons
            alert("Error adding repository: manifest.yml has an invalid structure.\nIt is likely missing one of the following (or is corrupt):\n> name, authors, identifier, themes, addons\n\nIf you are the repository administrator, please update this accordingly.");
        } else {
            chrome.storage.sync.get(["repositoryList"]).then(async (result) => {
                var repoList = {};
                if (result.repositoryList) {
                    try {
                        repoList = JSON.parse(result.repositoryList);
                        if (typeof repoList !== "object" || Array.isArray(repoList) || repoList === null) repoList = {};
                    } catch (e) {
                        repoList = {};
                    }
                };
                if (repoList[yml.identifier] != null) {
                    alert("Error adding repository: There is already a repository with the same identifier");
                    return;
                }
                repoList[yml.identifier] = {
                    name: yml.name,
                    authors: yml.authors,
                    identifier: yml.identifier, // may be redundant
                    manifest_link: url
                };
                chrome.storage.sync.set({repositoryList: JSON.stringify(repoList)}).then(() => {
                    alert("Repository added: " + yml.name);
                });
            });
        }
    } catch (e) {
        alert("Error adding repository: " + e.message);
    };
    //alert("Error adding repository:  Repository must be a github.io link")
    //alert("Error adding repository: Could not find manifest.yml OR manifest.yml has an invalid structure");
    //const giveName = confirm("WARNING:  This repository is not on the trusted list, meaning it could contain addons that are malicious. By pressing OK, you agree to be careful and also agree that we (InterLabs) are not responsible for any damage occurred.");
    //alert("Repository added.");
};

function isGitHubIOLink(str) {
    try {
        const url = new URL(str);
        return url.hostname.endsWith("github.io");
    } catch (error) { return false; }
};

document.getElementById("manage-repo").addEventListener("click", () => {
    addRepo();
})

async function loadContent(path) {
    const response = await fetch(chrome.runtime.getURL(path));
    return await response.text();
}

async function loopThemeList() {
    const themeFile = await loadContent("../src/modules/themes.yml");
    const themeList = yaml.load(themeFile);
    chrome.storage.sync.get(["activeThemeId"]).then(async (result) => {
        for (const object in themeList) {
            const obj = themeList[object];
            const themeCard = createThemeLink(obj.name, obj.summary, obj.thumbnail, obj.authors, object);
            if (result.activeThemeId == object) {
                //console.log(themeCard);
                const applyButton = themeCard.querySelector(".card-apply");
                //console.log(applyButton);
                if (applyButton) {
                    applyButton.textContent = "✓";
                    applyButton.style.backgroundColor = "green";
                }
            };
        }
    });
};
loopThemeList();

//createThemeLink("Space Theme", "The classic Space Theme, built for Google Classroom!", "space.jpg", "solarcosmic");
//createThemeLink("Testing Theme", "This is a testing theme!", "space.jpg", "solarcosmic");