---
title: "About"
description: "Who Patch Dispatch is for, how every post is made and checked, and how you can help."
---

Patch Dispatch is for the people who keep systems running: system administrators, developers and security teams who need to know one thing every morning. **What is being attacked right now, and what do I have to patch?**

Every post covers a vulnerability that is already being exploited in the wild, confirmed by CISA's Known Exploited Vulnerabilities catalog. No hype, no "might be dangerous someday". Just the flaws attackers are using today, in Windows, Linux, PHP, npm, Python and enterprise software such as VPNs, firewalls and virtualization.

## What you get in every post

- **Who is affected and under which conditions**, with concrete version numbers.
- **The fix**: the exact version, package or KB update, and a workaround if you can't patch right away.
- **A timeline**: when the flaw was published, when exploitation was confirmed, when the fix came out, and how long a fix was already available.
- **Updates that never hide the past.** When the vendor releases new fixes or the facts change, the post gets a dated entry in its *timeline of updates*. The original text stays as it was, and every version is visible on GitHub.
- **Links to the official sources**, so you can check everything yourself.

## How a post is made

1. **Research.** An AI agent reads the official sources: the vendor's advisory, the National Vulnerability Database, security trackers and release notes. Only approved official sites, never random blogs.
2. **Writing.** A second agent writes the post from that research.
3. **Fact-checking.** A third agent opens the sources again *on its own* and checks every version number, condition and claim. It sends drafts back until they are right. It has already caught a writing agent inventing a version number that does not exist.
4. **Human review.** A person reads every post and approves it before it goes out.
5. **Keeping it current.** Every day for a month, the research agent checks each post again and proposes an update when something changes.

At most five new posts a day, the most severe first.

## How you can help

This works best with the community around it.

- **Found a mistake?** Email [corrections@patchdispatch.dev](mailto:corrections@patchdispatch.dev). Every correction is published with a dated note and listed on the [corrections page](/corrections/). Nothing is edited silently.
- **Missing a vulnerability you think matters?** Tell us at [contact@patchdispatch.dev](mailto:contact@patchdispatch.dev).
- **Found a security problem with this site?** See [security.txt](/.well-known/security.txt) or write to [security@patchdispatch.dev](mailto:security@patchdispatch.dev).
- **Want to see how it works?** The website and its whole history are public on [GitHub](https://github.com/patchdispatch).

Email subscriptions for a daily digest are coming soon.
