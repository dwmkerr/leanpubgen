# leanpub

## Features

- TO TEST: Mapping of internal links to other markdown files as per: https://leanpub.com/markua/read#crosslinks
- TODO: support for boxes
- TODO: index support

## Parameters

`basePath` string path of the base of the project. All globs are resolved from
here, and this is also used to ensure that links between files are correctly
mapped into the flat folder structure.

## TODO

- Links in books

## TODO NTH

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

{blurb}
Blurbs are useful
{/blurb}

There are many types of blurbs, which will be familiar to you if you've ever read a computer programming book.

D> This is a discussion.

You can also specify them this way:

{blurb, class: discussion}
This is a discussion
{/blurb}

E> This is an error.

I> This is information.

Q> This is a question. (Not a question in a Markua course; those are done differently!)

T> This is a tip.

W> This is a warning.

X> This is an exercise. (Not an exercise in a Markua course; those are done differently!)



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
