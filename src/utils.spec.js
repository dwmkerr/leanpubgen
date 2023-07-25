const {
  flattenFilePath,
  processFrontmatter,
  processCrosslinksToAnchors,
  processCrosslinksToRelativeFiles,
  processMarkdownImages,
  processImgTag,
  trimCharStartEnd
} = require('./utils')

describe('flattenFilePath', () => {
  it('should replace path separators with hyphens', () => {
    const input = '01-transitioning-to-the-shell/index.md';
    const expected = '01-transitioning-to-the-shell-index.md'
    const result = flattenFilePath(input);
    expect(result).toEqual(expected)
  });

  it('should remove leading dot directory if present', () => {
    const input = './01-transitioning-to-the-shell/index.md';
    const expected = '01-transitioning-to-the-shell-index.md'
    const result = flattenFilePath(input);
    expect(result).toEqual(expected)
  });
});

describe('processFrontmatter', () => {
  it('should parse a title with quotes', () => {
    const text = `
---
title: 'Part 6 - Advanced Techniques'
slug: '/part-6-advanced-techniques/'
---
`
    const result = processFrontmatter(text)
    expect(result.title).toEqual('Part 6 - Advanced Techniques')
  })
});

describe('processCrosslinksToAnchors', () => {
  it('it should remove cross-links that are to locations in the same file', () => {
    const text = `
At this point you have a ready-to-go bash environment and can continue on to the [Summary](#Summary) and [Next Section](../02-navigating-your-system/index.md).
`
    const expected = `
At this point you have a ready-to-go bash environment and can continue on to the Summary and [Next Section](../02-navigating-your-system/index.md).
`
    const result = processCrosslinksToAnchors(
      text,
      '01-transitioning-to-the-shell/01-getting-started'
    )
    expect(result).toEqual(expected)
  })
});

describe('processCrosslinksToRelativeFiles', () => {
  it('it should replace a cross-link to a relative file to a link to the Markua fileId', () => {
    const text = `In [_Chapter 1 - Setting Up Your Shell Environment_](./01-transitioning-to-the-shell/01-getting-started/index.md) you'll learn...`
    const expected = `In [_Chapter 1 - Setting Up Your Shell Environment_](#01-transitioning-to-the-shell-01-getting-started-index.md) you'll learn...`
    const result = processCrosslinksToRelativeFiles(text, '.');
    expect(result).toEqual(expected)
  })

  it('it should correctly handle relative paths with parent directories', () => {
    const text = `At this point you have a ready-to-go bash environment and can continue on to the [Summary](#Summary) and [Next Section](../02-navigating-your-system/index.md).`
    const expected = `At this point you have a ready-to-go bash environment and can continue on to the [Summary](#Summary) and [Next Section](#01-transitioning-to-the-shell-02-navigating-your-system-index.md).`
    const result = processCrosslinksToRelativeFiles(text, './01-transitioning-to-the-shell/01-getting-started');
    expect(result).toEqual(expected)
  })
});

describe('processMarkdownImages', () => {
  it('is should remove the image sub-directory if specified', () => {
    const text = `
![Screenshot: Open a photo](./images/open-command.png)
`
    const expected = `
![Screenshot: Open a photo](open-command.png)
`
    const result = processMarkdownImages(text, {
      basenameOnly: true,
    })
    expect(result).toEqual(expected)
  })
});

describe('processImgTag', () => {
  it('is should remove the image sub-directory if specified', () => {
    const text = `
<img alt="Screenshot: OSX Installation" src={require('./images/setup-osx-3.png').default} width="800px" />
`
    const expected = `
![Screenshot: OSX Installation](setup-osx-3.png)
`
    const result = processImgTag(text, {
      basenameOnly: true,
    })
    expect(result).toEqual(expected)
  })
});

describe('trimCharStartEnd', () => {
  it('should remove specified characters from the start and end', () => {
    const text = `'Part 6 - Advanced Techniques'`
    const expected = `Part 6 - Advanced Techniques`
    const result = trimCharStartEnd(text, "'")
    expect(result).toEqual(expected)
  });
});
