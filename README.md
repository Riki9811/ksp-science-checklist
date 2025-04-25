<div align="center">
    <img src="assets/icon.png" alt="Logo" height="100">

# KSP Science Checklist

[![GitHub stars][stars-shield]][stars-url]
[![GitHub contributors][contributors-shield]][contributors-url]
[![Github issues][issues-shield]][issues-url]
[![Github MIT License][license-shield]][license-url]

</div>

A **desktop application** built with **Electron** and **JavaScript** to help track and visualize science progression in **Kerbal Space Program (KSP)** career/science mode.

<br />

## 🎯 Features

✅ **Modern UI** – Tab-based interface for each celestial body 📌\
✅ **Save File Parsing** – Extracts science data from `.sfs` files 📂\
✅ **Settings Persistence** – Remembers user preferences 🔧\
✅ **Windows Build** – Standalone executable for easy use 💾\
🛠️ **Future Cross-Platform Support** – Linux & macOS planned! 🌍

<br />

## ❓ Why Use Electron Instead of a KSP Mod?

I wanted to learn **Electron**, and this project came to mind, inspired by the great work done by [nic_name](https://forum.kerbalspaceprogram.com/topic/211219-ksp-science-checklist-v30/) on the KSP forum, who compiled a list of all science in the stock game and put it in an Excel spreadsheet.

Yes, a **mod would be better**—it could provide **live updates** when new experiments are completed and potentially **support modded planets/experiments**, similar to [x] Science! Continued ([Forum Link](https://forum.kerbalspaceprogram.com/topic/182683-ksp-190-x-science-continued-ksp-science-report-and-checklist-v523/)).

However, I **don’t know how to mod KSP**, and I don't plan to develop a mod with similar functionality. If someone else wants to take inspiration and create one, they're more than welcome! I understand that reading save files has its **limitations**.

<br />

## 🔍 How Does the App Work? What Are Its Limitations?

The program **reads the saves folder** in your KSP install and displays a list of all detected saves. When you select a save, it provides an **intuitive graphical UI** showing:

-   **Which experiments you have completed** in that save.
-   **How much science** is still available to collect.

#### 🚧 Limitations:

-   Since it **only reads save files**, it **cannot refresh in real-time** while the game is running. You must **save in KSP** and manually refresh the app to update the data.
-   The app **only supports vanilla KSP**. It does **not** detect or handle modded celestial bodies or experiments.
-   Any **mod that adds new experiments or celestial bodies could cause conflicts or crashes**. The app is designed to **ignore** records for unknown experiments, but this hasn't been thoroughly tested. As long as a mod does **not** change how vanilla experiments are stored in the save file, the app **should** function correctly.

<br />

## 📦 Installation

#### 1 🔹 Clone the Repository

```sh
git clone https://github.com/Riki9811/ksp-science-checklist.git
cd ksp-science-checklist
```

#### 2 🔹 Install Dependencies

```sh
npm install
```

#### 3 🔹 Run in Development Mode

```sh
npm start
```

<br />

## 🏗️ Build for Production (WIP)

To create a standalone Windows `.exe` file:

```sh
npm run build
```

The compiled `.exe` will be inside the `dist` folder.

<br />

## 🛠️ Technologies Used

-   **Electron** – Cross-platform desktop app framework ⚡
-   **Node.js** – Backend file handling 📁

<br />

### ⭐ Enjoying the Project?

Feel free to **star** ⭐ this repo and contribute! 🚀

<!-- LINKS -->

[stars-shield]: https://img.shields.io/github/stars/Riki9811/ksp-science-checklist.svg?style=for-the-badge
[stars-url]: https://github.com/Riki9811/ksp-science-checklist/stargazers
[contributors-shield]: https://img.shields.io/github/contributors/Riki9811/ksp-science-checklist.svg?style=for-the-badge
[contributors-url]: https://github.com/Riki9811/ksp-science-checklist/graphs/contributors
[issues-shield]: https://img.shields.io/github/issues/Riki9811/ksp-science-checklist.svg?style=for-the-badge
[issues-url]: https://github.com/Riki9811/ksp-science-checklist/issues
[license-shield]: https://img.shields.io/github/license/Riki9811/ksp-science-checklist.svg?style=for-the-badge
[license-url]: https://github.com/Riki9811/ksp-science-checklist/blob/master/LICENSE.txt
