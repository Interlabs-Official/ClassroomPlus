<img width="1500" height="500" alt="classroomplus_banner1" src="https://github.com/user-attachments/assets/d600bb99-c7c6-48a2-8e3c-5c9cd005d30d" />

<h1 align="center">ClassroomPlus</h1>
<p align="center">Extends the functionality of Google Classroom as a Chrome extension!</p>
<p align="center">Demo video of install and overview: <a href="https://youtu.be/JOj1GHjPP3Y">https://youtu.be/JOj1GHjPP3Y</a></p>
<hr>

## How to Install
Go to the [releases](https://github.com/Interlabs-Official/ClassroomPlus/releases/) page to download the latest release. Make sure to download the zip binary that says `classroomplus-chrome.zip`.

Then, extract the archive. Go to `chrome://extensions` in your Chrome browser, check "Developer mode" and then click "Load unpacked" and find the extracted folder.

## How to Build
Building Classroom+ is relatively easy! You just need these available on your machine:
[NodeJS & NPM](https://nodejs.org/en/download) - latest version is preferred (currently built using v20.19.2)
[Git](https://git-scm.com/install/) (or GitHub Desktop)

Then, open your terminal and run the following command and press Enter:
```bash
git clone https://github.com/Interlabs-Official/ClassroomPlus.git
```
<img width="640" height="226" alt="image" src="https://github.com/user-attachments/assets/8b141ac0-500d-4b8a-a6af-b976ae160f36" />

Then, to change directory, do:
```bash
cd ClassroomPlus
```

Then, assuming you have NodeJS and NPM installed (you can quickly check using):
```bash
node -v
   # -> v20.19.2 (for example)
npm -v
   # -> 9.2.0 (for example)
```

To actively have Classroom+ refresh upon building (for developing) do:
```bash
npm run dev
```

To build Classroom+ for production use, do:
```bash
npm run build
```

You will be able to find the extension in the `dist/` folder.
