import { generate } from "./generate";

describe("generate", () => {
  it("should return the full list of files that have been processed", async () => {
    const result = await generate({
      basePath: "../effective-shell/docs",
      sourceFilesPattern: "**/*.md*",
      outputPath: "./artifacts/e2e/output",

      //  Process only a slice of the files, until we are confident the whole
      //  manuscript works.
      sliceStart: 0,
      sliceEnd: 10,
    });

    //  There should be three files processed.
    expect(result.files.length).toEqual(10);

    //  Spot check the first file processed.
    expect(result.files[0]).toEqual({
      fileId: "00-index.mdx",
      sourcePath: "00-index.mdx",
      targetPath: "artifacts/e2e/output/00-index.mdx",
      sourceImagesPath: "images",
      targetImagesPath: "artifacts/e2e/output/resources/images",
      images: [],
    });

    //  Ensure that we also track the images copied.
    expect(result.files[3]).toEqual({
      fileId:
        "01-transitioning-to-the-shell-02-navigating-your-system-index.md",
      sourcePath:
        "01-transitioning-to-the-shell/02-navigating-your-system/index.md",
      targetPath:
        "artifacts/e2e/output/01-transitioning-to-the-shell-02-navigating-your-system-index.md",
      sourceImagesPath:
        "01-transitioning-to-the-shell/02-navigating-your-system/images",
      targetImagesPath: "artifacts/e2e/output/resources/images",
      images: [
        ".",
        "pushd-popd-stack.png",
        "pushd-popd.png",
        "ls.png",
        "special-dot-folders.png",
        "ls-l.png",
        "echo-home.png",
        "pwd.png",
        "cd-home.png",
        "cd-dot-dot.png",
        "pwd-env-var.png",
        "cd-dot-dot-scripts.png",
        "cd.png",
        "cd-dash.png",
      ],
    });
  });
});
