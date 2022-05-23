const { readdir, stat } = require('fs/promises');
const path = require('path');

(async () => {
  try {
    const arrFiles = await readdir(path.join(__dirname, 'secret-folder'), { withFileTypes: true });
    
    for (let item of arrFiles) {
      const fileNameWithExt = item.name;
      const pathToFile = path.join(__dirname, 'secret-folder', fileNameWithExt);
      const pathParsed = path.parse(pathToFile);
      const stats = await stat(pathToFile);
  
      let ext = pathParsed.ext.slice(1);
      if (ext ==='') ext = 'NA';
  
      if (stats.isFile()) { 
        console.log(`${pathParsed.name} - ${ext} - ${stats.size}b`);
      } 
    }
  } catch (err) {
    console.log(`Ошибка: ${err.message}`);
  }
})();