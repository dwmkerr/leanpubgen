# leanpub

<!-- vim-markdown-toc GFM -->

- [Quickstart](#quickstart)
- [Features](#features)
- [Guides](#guides)
- [Known Issues](#known-issues)
- [Troubleshooting](#troubleshooting)
- [Developer Guide](#developer-guide)
- [TODO](#todo)

<!-- vim-markdown-toc -->

This is a work-in-progress project that helps to convert a Docusaurus online book into a set of Markua files suitable for use with Leanpub.

I am using this tool to manage the [Effective Shell](https://effective-shell.com) book, it will likely require adaptation and changes to support other projects.

## Quickstart

**Parameters**

`basePath` string path of the base of the project. All globs are resolved from
here, and this is also used to ensure that links between files are correctly
mapped into the flat folder structure.

## Features

- [Crosslinks](https://leanpub.com/markua/read#crosslinks) - links to files in the book are automatically converted to Markua Crosslinks
- [Docusaurus Admonitions](https://docusaurus.io/docs/markdown-features/admonitions) are converted into [Markua Blurbs](https://leanpub.com/markua/read#leanpub-auto-blurbs-b-or-blurb)
- [Frontmatter, Mainmatter and Backmatter](https://leanpub.com/lfm/read#leanpub-auto-front-matter-main-matter-and-back-matter) via `leanpub_header`
- [Part Headings](https://leanpub.com/markua/read#headings) via `markua` comments

## Guides

**Setting Markua Heading**

If you want to include Markua at the top of a file, before the headings and file id, you can use the `leanpub_header`, frontmatter. For example:

```
---
title: Chapter Title
leanpub_header: |-
  {frontmatter}
  {class: part}
---

This is the first line of the chapter.
```

Will translate to:

```
{frontmatter}
{class:part}
{fileid: <generated file id>}
# Chapter Title

This is the first line of the chapter.
```

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

**Overriding the title**

If you want a specific title for the Leanpub file, use the `leanpub_title` frontmatter:

```
---
title: Effective Shell
leanpub_title: Introduction
---
```

In this example the title "Introduction" will be used in the Leanpub file.

## Known Issues

**Blurb headings are included in the chapter list**

It seems that blurb headings are shown in the chapter list at the front of the book which can look quite odd. See the 'Z-Shell' heading in the Effective Shell introduction as an example.

**"Part" headings are unclear in the docs**

The Markua docs are not clear on what is the appropriate way to set a 'part' heading. The correct way is via `{class: part}`. See the Effective Shell introduction or any part introductions for an example.

**Image tags must be specifically formatted**

`img` tags must conform exactly to the structure below:

```
<img alt="Screenshot: Linux Shell" src={require('./images/linux-shell.png').default} width="800px" />
```

Otherwise they will not be parsed/transformed correctly.

**Images must be in a specific folder, and have unique file names**

Images must be in a folder called `images/` in the same folder as the source text, e.g:

```
docs/01-part/01-chapter/00-index.md
docs/01-part/01-chapter/images/
```

Image names must be unique across the book.

**Files must be named to sort correctly**

Sorting is the natural order of the files, so:

```
docs/00-index.mdx         # works, comes first
docs/01-part1/00-index.md # works
docs/index.mdx            # doesn't work, comes too late
```

## Troubleshooting

**Failed PDF generation without an error log**

I spent a long time removing text from a failing chapter. In the end, it was the file "Navigating Your System" and this line:

```
![Screenshot: Special Dot Folders](special-dot-folders.png)
```

It turns out the image file was missing. Normally this is clear from the error report, in this case there was no reference to the missing file. It might be that it uploaded partially, so that leanpub had a record of the file in their system but the file was not actually present - either way to troubleshoot, consider removing all file links and adding them back in.

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

## TODO

Quick and dirty task list.

- Support warning/error/info output.
- create output directory
- check for image path clashes or put in subfolders
- more robust parsing of `img` tags (currently the regex expects a specific order of attributes)
- index support Support for [Markua Index Entries](http://help.leanpub.com/en/articles/6961502-how-to-create-an-index-in-a-leanpub-book)
