const fs = require("fs");
const path = require("path");
const os = require("os");

// gets the directory
const userInput = process.argv[2];
const resolvedPath = path.resolve(os.homedir(), "..", "..", userInput);

const typesMap = {
  Images: [".jpg", ".jpeg", ".png", ".gif", ".svg", ".bmp"],
  Documents: [".pdf", ".docx", ".txt", ".xlsx", ".pptx"],
  Music: [".mp3", ".wav", ".flac", ".aac"],
  Videos: [".mp4", ".mkv", ".avi", ".mov"],
  Archives: [".zip", ".rar", ".7z", ".tar"],
  Code: [
    ".js",
    ".ts",
    ".html",
    ".css",
    ".json",
    ".py",
    ".java",
    ".cpp",
    ".c",
    ".rb",
  ],
  Others: []
};

// Checks if all of the folder exist before creating a sorting the files
for (const key in typesMap) {
  const folder = path.resolve(resolvedPath, key);
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder);
  }
}

if (!userInput) {
  // check if there is a directory
  console.log("❌ Please provide a folder to organize.");
  console.log("✅ Example: node app.js ./Downloads");
  process.exit(1);
}

function readDirectory(path) {
  const files = fs.readdirSync(path);
  return files;
}

// if the path is existing
if (!fs.existsSync(resolvedPath)) {
  console.log("❌ That folder doesn't exist:", resolvedPath);
  process.exit(1);
}

// Checks if it's a directory
const stats = fs.statSync(resolvedPath);
if (!stats.isDirectory()) {
  console.log("❌ That path is not a folder:", resolvedPath);
  process.exit(1);
}

function moveFile(src, destination) {
  try{
      fs.copyFileSync(src, destination);
      fs.unlinkSync(src);
      
      console.log(`File has been successfuly moves to: ${destination}`); 
  }catch(err){
    console.log('Error moving files: ', err);
  } 
  
}

function getCategory(fullPath, fileName) {
  const stats = fs.statSync(fullPath);
  if(!stats.isFile()) return; // stops when it sees a folder in the resolve path

  const extName = path.extname(fileName);
  for(const [category, extension] of Object.entries(typesMap)) {
    if(extension.includes(extName)) {
      return category;
    }
  }
  // if the file is not a folder return this to avoid undefined
  return 'Others';
}

function sortFiles(files) {
  files.forEach((file) => {
    const initalPath = path.resolve(resolvedPath, file);
    const dir = getCategory(initalPath, file);
    
    if(!dir) return; // if the dir is undefined
    
    const newDir = path.resolve(resolvedPath, dir); // C:/testFile/Code
    const destination = path.resolve(newDir, file); // C:/testFile/Code/example.html
    moveFile(initalPath, newDir);
  });
}

function main() {
  const files = readDirectory(resolvedPath);
  sortFiles(files);
}

main();
