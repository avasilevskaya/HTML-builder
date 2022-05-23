const { readdir, copyFile, rm, mkdir } = require('fs/promises');
const path = require('path');

const pathCopyFrom = path.join(__dirname, 'files');
const pathCopyTo = path.join(__dirname, 'files-copy');

(async () => {
  try {
    await rm(pathCopyTo, { force: true, recursive: true });
    await mkdir(pathCopyTo, { recursive: true });
    const arrFiles = await readdir(pathCopyFrom, { withFileTypes: true });
    for (let item of arrFiles) {
      await copyFile(path.join(pathCopyFrom, item.name), path.join(pathCopyTo, item.name));
    }
  } catch (err) {
    console.log(`Ошибка: ${err.message}`);
  }
})();