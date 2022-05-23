const { readdir, readFile, writeFile } = require('fs/promises');
const path = require('path');

const pathCopyFrom = path.join(__dirname, 'styles');
const pathCopyTo = path.join(__dirname, 'project-dist');

async function styleCollector(copyFrom, copyTo) {
  try {
    const arrFiles = await readdir(copyFrom, { withFileTypes: true });
    const stylesArr = [];
    for (let item of arrFiles) {
      const pathToFile = path.join(copyFrom, item.name);
      const ext = path.parse(pathToFile).ext;
      if (item.isFile() && ext === '.css') {
        const cssContent = await readFile(pathToFile, 'utf8');
        stylesArr.push(cssContent + '\n');
      }
    }
    await writeFile(path.join(copyTo, 'bundle.css'), stylesArr);
  } catch (err) {
    console.log(`Ошибка: ${err.message}`);
  }
}

styleCollector(pathCopyFrom, pathCopyTo);
