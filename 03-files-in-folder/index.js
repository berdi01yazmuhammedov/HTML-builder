const fs = require("fs/promises");
const path = require("path");

const folderPath = path.join(__dirname, "secret-folder");

const readFolder = async () => {
    try{
        const files = await fs.readdir(folderPath, {withFileTypes: true});
        for(const file of files){
            if(file.isFile()){
                await getFileInfo(file.name);
            }
        }
    } catch (err){
        console.error("Error reading directory:", err);
    }
}
const getFileInfo = async (fileName) => {
    const filePath = path.join(folderPath, fileName);

    try {
        const stats = await fs.stat(filePath);
        const {name, ext} = path.parse(fileName);
        console.log(`${name} - ${ext.slice(1)} - ${(stats.size / 1024).toFixed(3)}kb`);
    } catch (error) {
        console.error(`Error getting file info: ${fileName}`, error);
    }
}
readFolder();