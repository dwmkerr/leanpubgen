const fs = require('fs')
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const path = require('path');
const os = require('os');
const { readFile } = require('fs/promises')
const { relative, parse } = require('path')
const {
  processFrontmatter,
  flattenFilePath,
  processCrosslinksToAnchors,
  processCrosslinksToRelativeFiles,
  processMarkdownImages,
  processImgTag,
  term,
} = require('./utils.js')

const { glob } = require('glob')

async function processFile(file, parameters) {
  //  Get the details of the file.
  const {
    sourcePath,
    targetPath,
    fileId } = file;
  const sourceFileDirectory = path.dirname(sourcePath);

  //  Load the file, preprocess the lines (which just joins up 'describe' and
  //  'it' lines that were split by the linter, making them easier to parse).
  const content = await readFile(path.join(parameters.basePath, sourcePath), 'utf8')
  const lines = content.split('\n')

  const output = [];

  let isFrontMatter = false;
  let isManuscriptIgnore = false;
  const frontmatterLines = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i]

    //  Check if we are entering or leaving frontmatter.
    if (i === 0 && line === '---') {
      isFrontMatter = true;
      continue;
    } else if (isFrontMatter === true && line === '---') {
      isFrontMatter = false;
      continue;
    }

    //  Check if we are explicitly ignoring a block in the manuscript (e.g.
    //  email signup forms or whatever).
    if (line === '<!-- manuscript:ignore:start -->') {
      isManuscriptIgnore = true;
    } else if (isManuscriptIgnore === true && line === '<!-- manuscript:ignore:end -->') {
      isManuscriptIgnore = false;
      continue;
    }
    
    //  If we are in frontmatter, don't add it to the manuscript.
    if (isFrontMatter) {
      frontmatterLines.push(line);
      continue;
    }
    if (isManuscriptIgnore) continue;

    //  Clean up any in-page links.
    line = processCrosslinksToAnchors(line);
    line = processCrosslinksToRelativeFiles(line, sourceFileDirectory);
    line = processMarkdownImages(line);
    line = processImgTag(line);

    output.push(line)
  }

  //  Process frontmatter.
  const fm = processFrontmatter(frontmatterLines);
  
  //  Create a title and an ID.
  output.unshift(`# ${fm.title.replace(/^'/, '').replace(/'$/, '')}\n`);
  output.unshift(`{id: ${fileId}}`);

  //  Join the text.
  const text = output.join(os.EOL)
  const cleanText = text.replace(/^\s+/, '');

  //  TODO promisify
  fs.writeFileSync(targetPath, cleanText);
}


async function generate(parameters) {
  const { basePath, sourceFilesPattern, outputPath, sliceStart, sliceEnd } = parameters;
  //  Get the source files, sort them (makes testing easier, more deterministic)
  const sourceFilesUnsorted  = await glob(sourceFilesPattern, {
    cwd: basePath
  });
  const sourceFiles = sourceFilesUnsorted.sort();

  const files = sourceFiles.map(sourceFile => {
    const targetName = flattenFilePath(sourceFile);
    return {
      sourcePath: sourceFile,
      targetPath: path.join(outputPath, targetName),
      sourceImagesPath: path.join(path.dirname(sourceFile), 'images'),
      targetImagesPath: path.join(outputPath, 'resources/images'),
      fileId: path.parse(targetName).name
    }
  });

  const processedFiles = await Promise.all(files.slice(sliceStart, sliceEnd).map(async (file) => {

    processFile(file, parameters)

    //  Copy the images.
    if (fs.existsSync(file.sourceImagesPath)) {
      const cpCommand = `cp -v -r '${file.sourceImagesPath + "/."}' '${file.targetImagesPath}'`;
      console.log(`copy command:\n\t${cpCommand}`);

      //  TODO log friendly.
      try {
        const { stdout, stderr } = await exec('ls');
        console.log(stdout);
      } catch (err) {
        console.error(`exec error: ${err}`);
        const { stdout, stderr } = err;
        console.error(stderr)
      }
    }

    return file;
  }));

  return {
    files: processedFiles
  };
}

module.exports = {
  generate
};
