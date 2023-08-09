const fs = require("fs");
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const path = require("path");
const os = require("os");
const { readFile } = require("fs/promises");
const { glob } = require("glob");
import { flattenFilePath } from "./utils";
import { processMarkdownFile, ProcessedMarkdownFile } from "./process";

export interface ProcessFile {
  sourcePath: string;
  targetPath: string;
  sourceImagesPath: string;
  targetImagesPath: string;
}

export interface ProcessParameters {
  basePath: string;
  sourceFilesPattern: string;
  outputPath: string;
  sliceStart: number | undefined;
  sliceEnd: number | undefined;
}

export interface GenerateResults {
  files: ProcessedMarkdownFile[]
}

async function processFile(
  file: ProcessFile,
  parameters: ProcessParameters,
): Promise<ProcessedMarkdownFile> {
  //  Get the details of the file.
  const { sourcePath, targetPath } = file;

  //  Load the file, preprocess the lines (which just joins up 'describe' and
  //  'it' lines that were split by the linter, making them easier to parse).
  const content = await readFile(
    path.join(parameters.basePath, sourcePath),
    "utf8",
  );

  //  Process all of the text.
  const processedMarkdownFile = processMarkdownFile(content, sourcePath);

  //  TODO promisify
  fs.writeFileSync(targetPath, processedMarkdownFile.markua);

  return processedMarkdownFile;
}

export async function generate(parameters: ProcessParameters): Promise<GenerateResults> {
  const { basePath, sourceFilesPattern, outputPath, sliceStart, sliceEnd } =
    parameters;
  //  Get the source files, sort them (makes testing easier, more deterministic)
  const sourceFilesUnsorted = await glob(sourceFilesPattern, {
    cwd: basePath,
  });
  const sourceFiles = sourceFilesUnsorted.sort();

  const files = sourceFiles.map((sourceFile: string) => {
    const targetName = flattenFilePath(sourceFile);
    return {
      sourcePath: sourceFile,
      targetPath: path.join(outputPath, targetName),
      sourceImagesPath: path.join(path.dirname(sourceFile), "images"),
      targetImagesPath: path.join(outputPath, "resources/images"),
    };
  });

  const processedFiles = await Promise.all(
    files.slice(sliceStart, sliceEnd).map(async (file: ProcessFile) => {
      const processedFile = await processFile(file, parameters);

      //  Copy the images.
      const imageFileNames = [];
      const sourceImagesPath = path.join(basePath, file.sourceImagesPath);
      if (fs.existsSync(sourceImagesPath)) {
        const cpCommand = `cp -v -r '${sourceImagesPath + "/."}' '${
          file.targetImagesPath
        }'`;
        //console.log(`copy command:\n\t${cpCommand}`);

        //  TODO log friendly.
        try {
          const { stdout /*, stderr */ } = await exec(cpCommand);
          //  The standard output in verbose mode is:
          //  <source path> -> <destination folder>
          imageFileNames.push(
            // urr...
            ...[...stdout.matchAll(/^\s*(.+?) ->/gm)].map((match) =>
              path.basename(match[1]),
            ),
          );
        } catch (err: any) {
          console.error(`exec error: ${err}`);
          const { /* stdout, */ stderr } = err;
          console.error(stderr);
        }
      } else {
        console.log(
          `warning: images folder '${sourceImagesPath}' not found...`,
        );
      }

      return {
        ...file,
        fileId: processedFile.fileId,
        images: imageFileNames,
      };
    }),
  );

  return {
    files: processedFiles,
  };
}
