import {
  processFrontmatter,
  processMarkdown,
  processMarkdownFile,
} from "./process";

describe("processFrontmatter", () => {
  it("should process the leanpub_title", () => {
    const frontmatter = `
leanpub_title: 'Advanced Techniques'
`.trim();
    const expected = {
      leanpub_title: "Advanced Techniques",
    };
    const result = processFrontmatter(frontmatter);
    expect(result).toEqual(expected);
  });

  it("should process a multi-line leanpub_header", () => {
    const frontmatter = `
leanpub_header: |-
  {sample: true}
  {frontmatter}
`.trim();
    const expected = {
      leanpub_header: `{sample: true}
{frontmatter}`,
    };
    const result = processFrontmatter(frontmatter);
    expect(result).toEqual(expected);
  });
});

describe("processMarkdown", () => {
  it("should extract markdown frontmatter and remove extraneous quotes", () => {
    const text = `
---
title: 'Part 6 - Advanced Techniques'
slug: '/part-6-advanced-techniques/'
---
`.trim();
    const result = processMarkdown(text, ".");
    expect(result.frontmatter.title).toEqual("Part 6 - Advanced Techniques");
  });

  it("should reformat Docusaurus admonitions without titles into Markua blurbs", async () => {
    const input = `
This book assumes that you are using a Bash-like shell, most of these shells should operate in a similar way. However, given the popularity of the Z shell (Zsh) are called out like so:

:::info

Z shell specifics are highlighted like this.

:::
    `.trim();
    const expected = `
This book assumes that you are using a Bash-like shell, most of these shells should operate in a similar way. However, given the popularity of the Z shell (Zsh) are called out like so:

{blurb, class: information}

Z shell specifics are highlighted like this.

{/blurb}
    `.trim();

    const result = processMarkdown(input, ".");
    expect(result.markua).toEqual(expected);
  });

  it("should reformat Docusaurus admonitions with titles into Markua blurbs", async () => {
    const input = `
This book assumes that you are using a Bash-like shell, most of these shells should operate in a similar way. However, given the popularity of the Z shell (Zsh) are called out like so:

:::info Z shell

Z shell specifics are highlighted like this.

:::
    `.trim();
    const expected = `
This book assumes that you are using a Bash-like shell, most of these shells should operate in a similar way. However, given the popularity of the Z shell (Zsh) are called out like so:

{blurb, class: information}
# Z shell

Z shell specifics are highlighted like this.

{/blurb}
    `.trim();

    const result = processMarkdown(input, ".");
    expect(result.markua).toEqual(expected);
  });

  it("should include Markua content from 'markua' comments", async () => {
    const input = `
<!-- markua: {sample: true} -->
<!-- markua: {class: part} -->
# Part

This is in the sample.
    `.trim();
    const expected = `
{sample: true}
{class: part}
# Part

This is in the sample.
    `.trim();

    const result = processMarkdown(input, ".");
    expect(result.markua).toEqual(expected);
  });
});

describe("processMarkdownFile", () => {
  it("should add a markua fileid to the top of the generated file, set the title and add a pagebreak", () => {
    const path = "06-advanced-techniques/00-index.md";
    const text = `
---
title: 'Part 6 - Advanced Techniques'
---

In part six we...
`.trim();
    const expected = `
{id: 06-advanced-techniques-00-index.md}
# Part 6 - Advanced Techniques

In part six we...
{pagebreak}
`.trim();
    const result = processMarkdownFile(text, path);
    expect(result.markua).toEqual(expected);
  });

  it("should set the title from the leanpub_title if set in the frontmatter", () => {
    const path = "06-advanced-techniques/00-index.md";
    const text = `
---
title: 'Part 6 - Advanced Techniques'
leanpub_title: 'Advanced Techniques'
---

In part six we...
`.trim();
    const expected = `
{id: 06-advanced-techniques-00-index.md}
# Advanced Techniques

In part six we...
{pagebreak}
`.trim();
    const result = processMarkdownFile(text, path);
    expect(result.markua).toEqual(expected);
  });

  it("should add the frontmatter 'leanpubHeader' markua content", () => {
    const path = "06-advanced-techniques/00-index.md";
    const text = `
---
title: 'Part 6 - Advanced Techniques'
leanpub_header: |-
  {sample: true}
  {class: part}
leanpub_title: 'Advanced Techniques'
---

In part six we...
`.trim();
    const expected = `
{sample: true}
{class: part}
{id: 06-advanced-techniques-00-index.md}
# Advanced Techniques

In part six we...
{pagebreak}
`.trim();
    const result = processMarkdownFile(text, path);
    expect(result.markua).toEqual(expected);
  });
});
