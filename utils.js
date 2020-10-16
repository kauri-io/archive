const fs = require('fs');
const Path = require('path');

const createDirectory = dir => {
  if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
  }
}

const createFile = (file, content) => {
  fs.writeFileSync(file, content);
}

const appendFile = (file, line) => {
  fs.appendFileSync(file, line + "\n");
}

const deleteFile = (file) => {
  fs.unlinkSync(file);
}

const deleteFolder = (folder) => {
  if (fs.existsSync(folder)) {
    fs.readdirSync(folder).forEach((file, index) => {
      const curPath = Path.join(folder, file);
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolder(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(folder);
  }
}

exports.createDirectory = createDirectory
exports.createFile = createFile
exports.appendFile = appendFile
exports.deleteFile = deleteFile
exports.deleteFolder = deleteFolder
