const fs = require("fs");
const path = require("path");
const os = require("os");
const { readFile } = require("fs/promises");
import { parse } from "yaml";
import {
  flattenFilePath,
  processCrosslinksToAnchors,
  processCrosslinksToRelativeFiles,
  processMarkdownImages,
  processImgTags,
  processMarkuaCommentTags,
  trimCharStartEnd,
} from "./utils";

export interface ProcessedMarkdown {
  markua: string;
  frontmatter: Record<string, string>;
}
export  interface ProcessedMarkdownFile extends ProcessedMarkdown {
  fileId: string;
}

function mapAdmonitionTypeToBlurbClass(admonitionType: string): string {
  switch (admonitionType) {
    case "note":
      return "discussion";
    case "info":
      return "information";
    case "tip":
      return "tip";
    case "caution":
      return "warning";
    case "danger":
      return "error";
    default:
      throw new Error(
        `Unable to map admonition type '${admonitionType}' to a Markua Blurb class`,
      );
  }
}

export function processFrontmatter(
  frontmatterText: string
): Record<string, string> {
  return parse(frontmatterText);
}

export function processMarkdown(
  markdown: string,
  sourceFileDirectory: string,
): ProcessedMarkdown {
  const output = [];

  let isFrontMatter = false;
  let isManuscriptIgnore = false;
  let isInAdmonition = false;
  const frontmatterLines = [];

  const lines = markdown.split(os.EOL);
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    //  Check if we are entering or leaving frontmatter.
    if (i === 0 && line === "---") {
      isFrontMatter = true;
      continue;
    } else if (isFrontMatter === true && line === "---") {
      isFrontMatter = false;
      continue;
    }

    //  Check if we are explicitly ignoring a block in the manuscript (e.g.
    //  email signup forms or whatever).
    if (line === "<!-- manuscript:ignore:start -->") {
      isManuscriptIgnore = true;
    } else if (
      isManuscriptIgnore === true &&
      line === "<!-- manuscript:ignore:end -->"
    ) {
      isManuscriptIgnore = false;
      continue;
    }

    //  If we are in frontmatter, don't add it to the manuscript.
    if (isFrontMatter) {
      frontmatterLines.push(line);
      continue;
    }
    if (isManuscriptIgnore) continue;

    //  Check if we are in an admonition.
    const admonitionStartPattern = /:::(note|tip|info|caution|danger)\s?(.*)/;
    if (admonitionStartPattern.test(line)) {
      isInAdmonition = true;
      const match = line.match(admonitionStartPattern);
      if (match) {
        const admonitionType = match[1];
        const admonitionTitle = match[2];
        output.push(
          `{blurb, class: ${mapAdmonitionTypeToBlurbClass(admonitionType)}}`,
        );
        if (admonitionTitle) {
          output.push(`# ${admonitionTitle}`);
        }
      }
      continue;
    } else if (/^:::$/.test(line) && isInAdmonition === true) {
      isInAdmonition = false;
      output.push("{/blurb}");
      continue;
    }

    //  Clean up any in-page links.
    line = processCrosslinksToAnchors(line);
    line = processCrosslinksToRelativeFiles(line, sourceFileDirectory);
    line = processMarkdownImages(line);
    line = processImgTags(line);
    line = processMarkuaCommentTags(line);

    output.push(line);
  }

  //  Join the text.
  const text = output.join(os.EOL);
  const cleanText = text.replace(/^\s+/, "");

  //  Any frontmatter we have extracted can be mapped.
  const frontmatter = processFrontmatter(frontmatterLines.join(os.EOL));

  return {
    markua: cleanText,
    frontmatter,
  };
}

export function processMarkdownFile(
  markdown: string,
  sourcePath: string,
): ProcessedMarkdownFile {
  //  Get the details of the file.
  const sourceFileDirectory = path.dirname(sourcePath);
  const fileId = flattenFilePath(sourcePath);

  //  Process all of the text.
  const processedMarkdown = processMarkdown(markdown, sourceFileDirectory);

  //  Add markua heading, a markua fileid and a title (from the frontmatter).
  const text = [
    processedMarkdown.frontmatter.leanpub_header || "",
    `{id: ${fileId}}`,
    `# ${
      processedMarkdown.frontmatter.leanpub_title ||
      processedMarkdown.frontmatter.title
    }`,
    "",
    processedMarkdown.markua,
    "{pagebreak}",
  ]
    .join(os.EOL)
    .trim();

  return {
    markua: text,
    frontmatter: processedMarkdown.frontmatter,
    fileId,
  };
}
