const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'frontend', 'node_modules');

function rmDir(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.readdirSync(dirPath).forEach((file) => {
      const curPath = path.join(dirPath, file);
      try {
        if (fs.lstatSync(curPath).isDirectory()) {
          rmDir(curPath);
        } else {
          fs.unlinkSync(curPath);
        }
      } catch (e) {
        // ignore errors
      }
    });
    try {
      fs.rmdirSync(dirPath);
    } catch(e) {}
  }
}

rmDir(dir);
console.log('Done');
