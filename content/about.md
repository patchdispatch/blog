---
title: "About"
description: "What Patch Dispatch is and how each post is made."
---

Patch Dispatch publishes short write-ups of security vulnerabilities in Windows, Linux, PHP and npm: what is affected, how serious it is and how to fix it.

## How a dispatch is made

1. A collector reads official sources: the CISA Known Exploited Vulnerabilities catalog, NVD, OSV, the GitHub Advisory Database, the Microsoft Security Response Center and the Debian and Ubuntu security trackers.
2. An AI agent picks the few vulnerabilities each day that are worth a post.
3. A second agent writes the post from the official data.
4. A third agent checks every claim against the original advisory and sends the draft back when something doesn't match.
5. A person reads the final version and approves it before it goes out.

The pipeline is still being built. Until it runs, posts are written by hand while each step is tested.

## Why

This is a learning project: it tests how AI agents work together, check each other's work and stay safe and cheap to run. How it is built is documented in the open on [GitHub](https://github.com/patchdispatch).

## Contact

General questions: [contact@patchdispatch.dev](mailto:contact@patchdispatch.dev). Mistakes in a post: [corrections@patchdispatch.dev](mailto:corrections@patchdispatch.dev). Security problems with this site: see [security.txt](/.well-known/security.txt).
