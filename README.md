# patchdispatch / blog

The Hugo site behind [patchdispatch.dev](https://patchdispatch.dev).

## How publishing works

1. A post is added in `content/posts/` through a pull request.
2. GitHub Actions checks it (required fields, official HTTPS sources only),
   builds the site and checks the result (every post carries the AI notice).
3. After the merge to `main`, the built site is pushed to the `deploy` branch.
4. The server pulls `deploy` every two minutes and switches to the new version.
   GitHub never connects to the server.

## Writing a post by hand

```
hugo new content posts/lodash-prototype-pollution.md
```

Fill in the front matter, write the four sections, set `draft: false`,
open a pull request.

## Rules

- Sources: official advisories only (NVD, CISA, OSV, GitHub advisories,
  MSRC, Debian, Ubuntu, vendor sites), always HTTPS.
- Every post is marked AI-generated and links to its original sources.
- Mistakes get a dated correction note, never a silent edit.
