const fs = require("fs");
const path = require("path");

async function mergeStyles(){
    const stylesFolder = path.join(__dirname, "styles");
    const files = await fs.promises.readdir(stylesFolder);
    
    const cssFiles = files.filter(file => path.extname(file) === ".css");
    const styles = [];
    for (const file of cssFiles){
        const filePath = path.join(stylesFolder, file);
        const fileContent = await fs.promises.readFile(filePath, "utf-8");
        styles.push(fileContent);
    }
    
    const bundlePath = path.join(__dirname, "project-dist", "bundle.css");
    await fs.promises.writeFile(bundlePath, styles.join("\n"), "utf-8");
}
mergeStyles().catch(console.error);