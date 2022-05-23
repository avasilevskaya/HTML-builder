const { readdir, readFile, writeFile, copyFile, rm, mkdir } = require('fs/promises');
const path = require('path');

const pathTemplateHtml = path.join(__dirname, 'template.html');
const pathComponentsFolder = path.join(__dirname, 'components');
const pathStylesFolder = path.join(__dirname, 'styles');
const pathAssetsFolder = path.join(__dirname, 'assets');
const pathDistFolder = path.join(__dirname, 'project-dist');
const pathDistHtml = path.join(pathDistFolder, 'index.html');
const pathDistStylesheet = path.join(pathDistFolder, 'style.css');
const pathDistAssetsFolder = path.join(pathDistFolder, 'assets');

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
    await writeFile(copyTo, stylesArr);
  } catch (err) {
    console.log(`Ошибка: ${err.message}`);
  }
}

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

async function createHtmlFromTemplate(templatePath, componentsPath) {
  try {
    let html = await readFile(templatePath, 'utf8');
    const pattern = /{{\w*}}/g;
    const labelsArr = await html.match(pattern);
    for (let label of labelsArr) {
      let component = await readFile(path.join(componentsPath, `${label.substring(2, label.length-2)}.html`), 'utf8');
      html = html.replace(label, component);
    }
    await writeFile(pathDistHtml, html);
  } catch (err) {
    console.log(`Ошибка: ${err.message}`);
  }
}

(async () => {
  await rm(pathDistFolder, { recursive: true, force: true });
  await mkdir(pathDistFolder, { recursive: true });
  await mkdir(pathDistAssetsFolder, { recursive: true });
  copyDirectory(pathAssetsFolder, pathDistAssetsFolder);
  styleCollector(pathStylesFolder, pathDistStylesheet);
  createHtmlFromTemplate(pathTemplateHtml, pathComponentsFolder);
})();