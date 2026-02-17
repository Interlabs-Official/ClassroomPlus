import yaml from "js-yaml";
import mycode from './src/testing.lua';
console.log(mycode);

async function loadContent(path) {
    const response = await fetch(chrome.runtime.getURL(path));
    return await response.text();
}

async function loadMappings() {
    mycode.hr("https://google.com")
    console.log(mycode.add(2,5));
    var temp = await loadContent("themes/dark.css");
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

loadMappings();