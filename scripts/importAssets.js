require('dotenv').config()
var path = require('path')
const fse = require('fs-extra')
const fs = require('fs')
const compact = require('lodash/compact');

const ASSETS_FOLDER = './public/assets';
const STAGING_FOLDER = `${process.env.SCHISM_ASSET_FOLDER}/staging/assets`;

console.log('importAssets')
console.log(process.env.SCHISM_ASSET_FOLDER)

const fileExtensionsToCopy = [
    '.gltf',
    '.ttf',
    '.png'
]

const foldersToCopy = [
    'buildings',
    'character',
    'resources',
    'ui',
    'fonts'
]

const stringsToAvoid = [
    'reference'
]

const filterFunc = (src, dest) => {
    const copyTest = (src, dest) => {
        if (path.basename[0] === '.') return false;                         // don't copy hidden files/folders
        if (stringsToAvoid.filter((string) => src.toLowerCase().includes(string.toLowerCase())).length) return false;   // avoid files/paths in stringsToAvoid
        if (fs.lstatSync(src).isDirectory()) return true;                   // do copy directories
        if (fileExtensionsToCopy.includes(path.extname(src))) return true;  // only copy thes file extensions
        return false;
    }
    const copyResult = copyTest(src, dest)
    if (!copyResult) return copyResult;
    console.log(src, ' -> ', dest)
    
    return copyResult;
}

console.log('removing existing assets folder ', ASSETS_FOLDER)
fs.rmSync(ASSETS_FOLDER, { recursive: true, force: true });

console.log('copying assets from schism-assets ', STAGING_FOLDER)
foldersToCopy.forEach((folder) => {
    fse.copySync(`${STAGING_FOLDER}/${folder}`, `${ASSETS_FOLDER}/${folder}`, {
        filter: filterFunc
    })
})
