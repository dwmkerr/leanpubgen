# leanpub

## 0.1

- [x] Cover image
- Introduction text
- In-book links
- Page breaks
- Z-Shell blurb
- Sample (one per part?)
- If the sample/frontmatter/mainmatter/part shit works, add to the raw manu

## 0.2

- missing chapter (plus its images)
- better images report/test

## Features

- TO TEST: Mapping of internal links to other markdown files as per: https://leanpub.com/markua/read#crosslinks
- TODO: support for boxes
- [Docusaurus Admonitions](https://docusaurus.io/docs/markdown-features/admonitions) are converted into [Markua Blurbs](https://leanpub.com/markua/read#leanpub-auto-blurbs-b-or-blurb)
- TODO: boxes into [Markua Asides](https://leanpub.com/markua/read#leanpub-auto-asides-a-or-aside)
- TODO: index support Support for [Markua Index Entries](http://help.leanpub.com/en/articles/6961502-how-to-create-an-index-in-a-leanpub-book)
- TODO: headings are not indented properly for markua
- TODO: page breaks at the end of chapters
- TODO: front,main,back matter https://leanpub.com/lfm/read#leanpub-auto-front-matter-main-matter-and-back-matter
- TODO: [part headings](https://leanpub.com/markua/read#headings) note that part headings are changing

**Including Markua Content**

If you want to include specific Markua content, you can use the special `<!-- markua: -->` comment. For example, to include a part of the book in the sample and set a heading as a 'part' heading, you could use the following MDX:

```mdx
<!-- markua: {sample: true} -->
<!-- markua: {class: part} -->
# Part

This is in the sample.
```

This will be transformed into the following Markua:

```mdx
{sample: true}
{class: part}
# Part

This is in the sample.
```

## Parameters

`basePath` string path of the base of the project. All globs are resolved from
here, and this is also used to ensure that links between files are correctly
mapped into the flat folder structure.

## TODO NTH

- Support warning/error/info output.
- create output directory

todo check for image path clashes or put in subfolders

- flag to remove `images` from images as resources folder is flat
- flat to make `img` tags into markua

- `{part}`
- `{aside}`
-  `{backmatter}`

{aside}
Asides can be written this way, since adding a bunch of A> stuff at the beginning of each line can get annoying with longer asides.
{/aside}

B> Blurbs are useful


```
{mainmatter}
{frontmatter}
e.g
leanpub:
  - frontmatter
  - mainmatter
  - sample:true
```

Limitations:

- Sorting is the natural order of the files, so:

```
docs/00-index.mdx         # works, comes first
docs/01-part1/00-index.md # works
docs/index.mdx            # doesn't work, comes too late
```

- Images must be in a folder called `images/` in the same folder as the source text, e.g:

```
docs/01-part/01-chapter/00-index.md
docs/01-part/01-chapter/images/
```

- Image names must be unique across the book

- `img` tags must conform exactly to the structure below:

```
<img alt="Screenshot: Linux Shell" src={require('./images/linux-shell.png').default} width="800px" />
```

Otherwise they will not be parsed/transformed correctly

Basic script to test the validity of names of E2E suites and steps, as well as provide some metrics on reports. Can also be used in CI to fail PRs that do not have valid test names.

**This is a script** - it's not production grade code, it's for quick diagnostics and CI processes. It does not have tests, adhere to standard linting patterns and so on. If we want to industrialise this, we should extract it into it's own repo, module, and put a CLI around it.

## Quickstart


```bash
TODO
```

Or manually run the script, providing the path to the test files:

```bash
TODO
# debug with...
node --inspect --inspect-brk leanpub.js "../tests/specs"
```

This will:

1. TODO

## Developer Guide

Format the code with:

```bash
npx prettier --write
```

Run tests with:

```bash
npx jest *.spec.js
```

| Command | Description |
| ------- | ----------- |
| npm run lint | Lint the code with eslint/prettier |
| npm run lint:fix | Fix the code with eslint/prettier |
