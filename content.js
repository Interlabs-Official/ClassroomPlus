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

// Credit: Claude Sonnet 4.6 (for new mappings system)
function flattenMappings(obj, prefix = '') {
    const result = {};
    for (const key in obj) {
        const value = obj[key];
        const fullKey = prefix ? `${prefix}/${key}` : key;
        if (Array.isArray(value)) {
            result[fullKey] = value;
        } else if (typeof value === 'object' && value !== null && !('any' in value)) {
            Object.assign(result, flattenMappings(value, fullKey));
        } else if (typeof value === 'object' && value !== null && 'any' in value) {
            result[fullKey] = value.any;
        }
    }
    return result;
}

async function loadMappings(theme) {
    var temp = await loadContent(theme);
    const mappings = yaml.load(await loadContent("mappings.yml"));
    const flat = flattenMappings(mappings);
    for (const key in flat) {
        const selectors = flat[key];
        for (const selector of selectors) {
            temp = temp.replace(":" + key, selector);
        }
    }
    console.log(temp);
    const style = document.createElement("style");
    style.textContent = temp;
    style.id = "teststyle"
    document.head.appendChild(style);
}
loopThemeList();