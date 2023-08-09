import * as path from "path";

//  ASCII control codes for terminal formatting.
export const term = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  underscore: "\x1b[4m",
  blink: "\x1b[5m",
  reverse: "\x1b[7m",
  hidden: "\x1b[8m",

  fg: {
    black: "\x1b[30m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m",
    gray: "\x1b[90m",
    crimson: "\x1b[38m", // Scarlet
  },
  bg: {
    black: "\x1b[40m",
    red: "\x1b[41m",
    green: "\x1b[42m",
    yellow: "\x1b[43m",
    blue: "\x1b[44m",
    magenta: "\x1b[45m",
    cyan: "\x1b[46m",
    white: "\x1b[47m",
    gray: "\x1b[100m",
    crimson: "\x1b[48m",
  },
};

export function flattenFilePath(filePath: string) {
  //  e.g:
  //  ./01-transitioning-to-the-shell/index.md
  //  to:
  //  01-transitioning-to-the-shell-index.md
  return filePath.replace(/^\.\//, "").replaceAll(path.sep, "-");
}

export function processCrosslinksToAnchors(text: string) {
  const inPageLinks = /\[([^\]]+)\]\((#[^\)]+)\)/g;
  return text.replace(inPageLinks, "$1");
}

export function processCrosslinksToRelativeFiles(
  text: string,
  filePath: string,
) {
  //  Find crosslinks.
  //  For reference: const allLinks = /\[([^\]]+)\]\(([^\)]+)\)/g;
  const linksToMarkdown = /\[([^\]]+)\]\(([^\)]+.mdx?)\)/g;
  return text.replace(linksToMarkdown, (match, altText, link) => {
    //  Now that we have a link like:
    //  ./01-transitioning-to-the-shell/index.md
    //  we flatten to an anchor link to the file id:
    //  #01-transitioning-to-the-shell-index.md
    //  As per: https://leanpub.com/markua/read#crosslinks
    const resolvedLink = path.join(filePath, link);
    return match.replace(link, "#" + flattenFilePath(resolvedLink));
  });
}

export function processMarkdownImages(text: string) {
  //  Find crosslinks.
  const matches = /!\[([^\]]+)\]\(([^\)]+)\)/g;
  return text.replace(matches, (match, altText, imagePath) => {
    //  Take the full image path, basename it, use that.
    const fullPath = imagePath;
    const baseName = path.basename(imagePath);
    return match.replace(fullPath, baseName);
  });
}

export function processImgTags(text: string): string {
  //  A (much) better way is to find the tag and then rex out the attributes
  //  individually, but will refactor later.
  return text
    .replace(
      /<img alt="([^"]+)" src={require\('([^']+)'\).default} width="([\d]+px)" \/>/g,
      (match, alt, src) => {
        //  Take the full image path, basename it, use that.
        const baseName = path.basename(src);
        return `![${alt}](${baseName})`;
      },
    )
    .replace(
      /<img src={require\('([^']+)'\).default} alt="([^"]+)" width="([\d]+px)" \/>/g,
      (match, src, alt) => {
        //  Take the full image path, basename it, use that.
        const baseName = path.basename(src);
        return `![${alt}](${baseName})`;
      },
    );
}

export function processMarkuaCommentTags(text: string) {
  //  Replace 'markua' comments.
  const matches = /<!-- markua:\s*(.+?)\s*-->/g;
  return text.replace(matches, (_, markuaContent) => {
    return markuaContent;
  });
}

export function trimCharStartEnd(text: string, char: string) {
  if (text.startsWith(char) && text.endsWith(char)) {
    return text.substr(char.length, text.length - char.length * 2);
  }
  return text;
}
