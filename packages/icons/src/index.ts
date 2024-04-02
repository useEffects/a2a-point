import svgtofont from "svgtofont"
import * as path from "path"
import pkg from "../package.json"
 
svgtofont({
  src: path.resolve(process.cwd(), 'icons'), // svg path
  dist: path.resolve(process.cwd(), 'fonts'), // output path
  fontName: 'svgtofont', // font name
  css: true, // Create CSS files.
}).then(() => {
  console.log('done!');
});