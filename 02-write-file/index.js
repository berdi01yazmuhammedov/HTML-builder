const fs = require("fs");
const readline = require("readline");
const filePath = "./02-write-file/output.txt";
const writableStream = fs.createWriteStream(filePath);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
})
console.log('Добро пожаловать! Введите текст, чтобы записать его в файл. Для выхода введите "exit" или нажмите Ctrl+C.');

rl.on("line", (input) => {
    if(input.trim() === "exit"){
        farewell();
    } else {
        writableStream.write(input + "\n");
    }
});

function farewell(){
    console.log("До свидания!");
    rl.close();
    writableStream.end();
}
process.on('SIGINT', farewell);