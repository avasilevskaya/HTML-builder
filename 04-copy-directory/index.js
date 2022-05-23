const { readdir, copyFile, rm, mkdir } = require('fs/promises');
const path = require('path');

const pathCopyFrom = path.join(__dirname, 'files');
const pathCopyTo = path.join(__dirname, 'files-copy');

async function copyDirectory(copyFrom, copyTo) {
  try {
    const arrFiles = await readdir(copyFrom, { withFileTypes: true });
    for (let item of arrFiles) {
      if (item.isFile()) {
        await copyFile(path.join(copyFrom, item.name), path.join(copyTo, item.name));
      } else if (item.isDirectory()) {
        await mkdir(path.join(copyTo, item.name));
        await copyDirectory(path.join(copyFrom, item.name), path.join(copyTo, item.name));
      }
    }
  } catch (err) {
    console.log(`Ошибка: ${err.message}`);
  }
}

(async () => {
  await rm(pathCopyTo, { force: true, recursive: true });
  await mkdir(pathCopyTo, { recursive: true });
  await copyDirectory(pathCopyFrom, pathCopyTo);
})();