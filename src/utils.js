const fs = require('fs')
const path = require('path')

//  ASCII control codes for terminal formatting.
const term = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',

  fg: {
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    gray: '\x1b[90m',
    crimson: '\x1b[38m' // Scarlet
  },
  bg: {
    black: '\x1b[40m',
    red: '\x1b[41m',
    green: '\x1b[42m',
    yellow: '\x1b[43m',
    blue: '\x1b[44m',
    magenta: '\x1b[45m',
    cyan: '\x1b[46m',
    white: '\x1b[47m',
    gray: '\x1b[100m',
    crimson: '\x1b[48m'
  }
}

function flattenFilePath(filePath) {
  //  e.g:
  //  ./01-transitioning-to-the-shell/index.md
  //  to:
  //  01-transitioning-to-the-shell-index.md
  return filePath.replace(/^\.\//, '').replaceAll(path.sep, '-');
}

function processFrontmatter(input) {
  const lines = typeof input === 'string' ? input.split('\n') : input;
  return lines.reduce((agg, line) => {
    const [k, v] = line.split(': ');
    agg[k] = trimCharStartEnd(v || "", "'");
    return agg;
  }, {});
}

function processCrosslinksToAnchors(text) {
  const inPageLinks = /\[([^\]]+)\]\((#[^\)]+)\)/g
  return text.replace(inPageLinks, "$1");
}

function processCrosslinksToRelativeFiles(text, filePath) {
  //  Find crosslinks.
  const allLinks = /\[([^\]]+)\]\(([^\)]+)\)/g
  const linksToMarkdown = /\[([^\]]+)\]\(([^\)]+.mdx?)\)/g
  return text.replace(linksToMarkdown, (match, altText, link) => {
    //  Now that we have a link like:
    //  ./01-transitioning-to-the-shell/index.md
    //  we flatten to an anchor link to the file id:
    //  #01-transitioning-to-the-shell-index.md
    //  As per: https://leanpub.com/markua/read#crosslinks
    const resolvedLink = path.join(filePath, link);
    return match.replace(link, '#' + flattenFilePath(resolvedLink));
  });
}

function processMarkdownImages(text, options) {
  //  TODO make optional how we handle this (e.g. alt, width)
  //  Find crosslinks.
  const matches = /!\[([^\]]+)\]\(([^\)]+)\)/g
  return text.replace(matches, (match, p1, p2, p3) => {
    //  Take the full image path, basename it, use that.
    const fullPath = p2;
    const baseName = path.basename(p2);
    return match.replace(fullPath, baseName);
  });
}

function processImgTag(text, options) {
  //  TODO optoins are not wired
  //  Find crosslinks.
  const matches = /<img alt="([^"]+)" src={require\('([^']+)'\).default} width="([\d]+px)" \/>/g
      return text.replace(matches, (match, alt, src) => {
    //  Take the full image path, basename it, use that.
    const baseName = path.basename(src);
    return `![${alt}](${baseName})`;
  });
}

function trimCharStartEnd(text, char) {
  if (text.startsWith(char) && text.endsWith(char)) {
    return text.substr(char.length, text.length - char.length * 2);
  }
  return text;
}

module.exports = {
  term,
  flattenFilePath,
  processFrontmatter,
  processCrosslinksToAnchors,
  processCrosslinksToRelativeFiles,
  processMarkdownImages,
  processImgTag,
  trimCharStartEnd
}
