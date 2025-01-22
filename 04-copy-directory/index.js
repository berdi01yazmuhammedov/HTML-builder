const fs = require("fs/promises");
const path = require("path");

const sourceFolder = path.join(__dirname, "files");
const copyFolder = path.join(__dirname, "files-copy");

const createCopyFolder = async () => {
    await fs.mkdir(copyFolder, { recursive: true });
}
const clearCopyFolder = async () => {
    const files = await fs.readdir(copyFolder);
    for (const file of files) {
        const filePath = path.join(copyFolder, file);
        const stats = await fs.stat(filePath);
        if (stats.isFile()) {
            await fs.unlink(filePath);
        } else if (stats.isDirectory()) {
            await fs.rm(filePath, { recursive: true, force: true });
        }
    }
}
const copyFiles = async () => {
    const files = await fs.readdir(sourceFolder, { withFileTypes: true });
    for (const file of files) {
        const sourcePath = path.join(sourceFolder, file.name);
        const copyPath = path.join(copyFolder, file.name);
        if (file.isFile()) {
            await fs.copyFile(sourcePath, copyPath);
        } else if (file.isDirectory()) {
            await copyDirectory(sourcePath, copyPath);
        }
    }
};
const copyDirectory = async (sourceDir, targetDir) => {
    await fs.mkdir(targetDir, { recursive: true });
    const items = await fs.readdir(sourceDir, { withFileTypes: true });
    for (const item of items) {
        const sourcePath = path.join(sourceDir, item.name);
        const targetPath = path.join(targetDir, item.name);
        if (item.isFile()) {
            await fs.copyFile(sourcePath, targetPath);
        } else if (item.isDirectory()) {
            await copyDirectory(sourcePath, targetPath);
        }
    }
}

const copyFolderContent = async () => {
    try {
        await createCopyFolder();
        await clearCopyFolder();
        await copyFiles();
        console.log("Копирование завершено");

    } catch (error) {
        console.error("Произошла ошибка", error);

    }
}
copyFolderContent();