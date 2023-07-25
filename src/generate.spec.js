const {
  generate,
} = require('./generate')

describe('generate', () => {
  it('should return the full list of files that have been processed', async () => {
    const result = await generate({
      basePath: '../effective-shell/docs',
      sourceFilesPattern: '**/*.md*',
      outputPath: './artifacts/e2e/output',

      //  Process only a slice of the files, until we are confident the whole
      //  manuscript works.
      sliceStart: 0,
      sliceEnd: 3,
    });

    //  There should be three files processed.
    expect(result.files.length).toEqual(3);
    expect(result.files[0]).toEqual({
      fileId: '00-index',
      sourcePath: '00-index.mdx',
      targetPath: 'artifacts/e2e/output/00-index.mdx',
      sourceImagesPath: 'images',
      targetImagesPath: 'artifacts/e2e/output/resources/images',
    });
  })
});
