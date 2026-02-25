import yaml from "js-yaml";

async function loadContent(path) {
    const response = await fetch(chrome.runtime.getURL(path));
    return await response.text();
}

async function loopThemeList() {
    const themeFile = await loadContent("src/modules/themes.yml");
    const themeList = yaml.load(themeFile);
    chrome.storage.sync.get(["activeThemeId"]).then(async (result) => {
        for (const object in themeList) {
            if (result.activeThemeId == object) {
                const obj = themeList[object];
                loadMappings("themes/" + obj.css);
            };
        }
    });
}

async function loadMappings(theme) {
    var temp = await loadContent(theme);
    const mappings = yaml.load(await loadContent("mappings.yml"));
    for (const item in mappings) {
        //console.log(temp);
        const entry = mappings[item];
        for (const object in entry?.any) {
            temp = temp.replace(":" + item, entry.any[object]);
            //console.log(temp);
        }
    }
    //console.log(mappings);
    const style = document.createElement("style");
    style.textContent = temp;
    style.id = "teststyle"
    document.head.appendChild(style);
    //console.log(temp);
}
loopThemeList();

//loadMappings();