const fs = require("fs");
const path = require("path");

const projectDistPath = path.join(__dirname, "project-dist");

async function createFolder() {
    try {
        await fs.promises.mkdir(projectDistPath, { recursive: true });
    } catch (error) {
        console.error("Error creating folder:", error);
    }
}

const templatePath = path.join(__dirname, "template.html");

async function readTemplate() {
    const template = await fs.promises.readFile(templatePath, "utf-8");
    return template;
}

const componentsPath = path.join(__dirname, "components");

async function replaceTemplateTags(template) {
    const regex = /{{(\w+)}}/g;
    const matches = template.match(regex);
    if (matches) {
        for (let match of matches) {
            const tagName = match.replace(/[{{}}]/g, "");
            const componentPath = path.join(componentsPath, `${tagName}.html`);
            const componentContent = await fs.promises.readFile(componentPath, "utf-8");
            template = template.replace(match, componentContent);
        }
    }
    return template;
}

const indexHtmlPath = path.join(projectDistPath, "index.html");

async function writeHtmlFile(content) {
    await fs.promises.writeFile(indexHtmlPath, content);
}

const stylesPath = path.join(__dirname, "styles");
const styleCssPath = path.join(projectDistPath, "styles.css");

async function compileStyles() {
    const files = await fs.promises.readdir(stylesPath);
    let compiledStyles = "";
    for (let file of files) {
        const filePath = path.join(stylesPath, file);
        const stat = await fs.promises.stat(filePath);
        if (stat.isFile() && file.endsWith(".css")) {
            const cssContent = await fs.promises.readFile(filePath, "utf-8");
            compiledStyles += cssContent;
        }
    }
    await fs.promises.writeFile(styleCssPath, compiledStyles);
}

const assetsPath = path.join(__dirname, "assets");
const projectDistAssetsPath = path.join(projectDistPath, "assets");

async function copyAssets() {
    const files = await fs.promises.readdir(assetsPath);
    for (let file of files) {
        const currentFilePath = path.join(assetsPath, file);
        const stat = await fs.promises.stat(currentFilePath);
        const targetFilePath = path.join(projectDistAssetsPath, file);

        if (stat.isDirectory()) {
            await fs.promises.mkdir(targetFilePath, { recursive: true });
            await copyDirectory(currentFilePath, targetFilePath); // Рекурсивный вызов с правильными параметрами
        } else {
            await fs.promises.copyFile(currentFilePath, targetFilePath);
        }
    }
}

async function copyDirectory(source, destination) {
    const files = await fs.promises.readdir(source);
    for (let file of files) {
        const currentFilePath = path.join(source, file);
        const stat = await fs.promises.stat(currentFilePath);
        const targetFilePath = path.join(destination, file);

        if (stat.isDirectory()) {
            await fs.promises.mkdir(targetFilePath, { recursive: true });
            await copyDirectory(currentFilePath, targetFilePath); // Рекурсивный вызов с правильными параметрами
        } else {
            await fs.promises.copyFile(currentFilePath, targetFilePath);
        }
    }
}

async function buildPage() {
    await createFolder();
    const template = await readTemplate();
    const updatedTemplate = await replaceTemplateTags(template);
    await writeHtmlFile(updatedTemplate);
    await compileStyles();
    await copyAssets();
}

buildPage().catch(console.error);
