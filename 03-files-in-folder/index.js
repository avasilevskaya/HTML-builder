const fsPromises = require('fs/promises');
const path = require('path');

(async () => {
  const fileNamesArr = await fsPromises.readdir(path.join(__dirname, 'secret-folder'), { withFileTypes: true });

  for (let item of fileNamesArr) {
    const fileNameWithExt = item.name;
    const pathToFile = path.join(__dirname, 'secret-folder', fileNameWithExt);
    const pathParsed = path.parse(pathToFile);
    const stat = await fsPromises.stat(pathToFile);

    if (stat.isFile()) { 
      console.log(`${pathParsed.name} - ${pathParsed.ext.slice(1)} - ${stat.size}b`);
    } 
  }
})();