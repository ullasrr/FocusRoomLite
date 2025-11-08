import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default function getThemes(){
    const themeDir = path.join(__dirname, '../public/themes');
    return fs.readdirSync(themeDir).map(file => `/themes/${file}`);
}
