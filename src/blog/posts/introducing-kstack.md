---
title: 'Introducing kstack: The Skills We Built to Ship Faster with AI Agents'
slug: 'introducing-kstack'
author: 'Bernard Xie'
date: '2026-07-24'
description: "We've written millions of lines of code with AI agents while building Kestral. kstack is the set of skills we developed along the way to make fewer mistakes, keep things documented, and actually ship."
tags: ['engineering', 'open-source', 'announcements']
draft: false
---

_Originally published on the [Kestral blog](https://kestral.ai/blog/introducing-kstack)._

We built Kestral almost entirely with AI coding agents — Cursor, Claude Code, Codex. Millions of lines of code across a full-stack TypeScript application, a GraphQL API, an AI orchestration layer, and over a dozen integrations.

That experience taught us something important: agents are remarkably capable at writing code, but they don't naturally follow a process. They won't write a plan before building. They won't pause between phases for review. They'll skip tests, ignore your patterns, and forget context between sessions. The code compiles, but the engineering discipline isn't there.

We kept solving the same problems manually, so we started writing them down. Small markdown instruction files — how we do migrations, how we review PRs, what to check before pushing. Agents read them, and the quality of their work improved immediately. Over time, those files evolved into a structured collection of skills we call [kstack](https://github.com/Kestral-Team/kstack). Today we're open-sourcing it.

## What kstack is

kstack is a set of markdown skill files you add to your repo. Each one teaches an agent how to do one thing well — stress-test a plan, implement it in phases, review a PR, sync progress to your task tracker, strip AI-generated slop from a branch. They work with Cursor, Claude Code, Codex, and any agent host that reads skill files.

No framework, no runtime, no dependencies. Just markdown that agents read before doing work.

The open-source set is intentionally focused on **strategy and product development** — planning, reviewing, and shipping with a task tracker in the loop. Internally we have a larger library that also covers git plumbing, CI fixes, and codebase-specific engineering references. Those stay in our repo. What we publish is the workflow that transfers: how to decide what to build, how to build it in phases, how to review it, and how to keep the project management layer current.

In Cursor, the `/kstack` command routes to the right pipeline automatically:

```
/kstack plan user notifications
/kstack implement the plan
/kstack review this branch
/kstack X is broken, debug it
```

You can also invoke skills directly — `/grill-me`, `/implement-plan`, `/code-review`, `/manual-review`.

## The skills that matter most

The public [kstack](https://github.com/Kestral-Team/kstack) repo ships around two dozen skills across planning, implementation, review, debugging, and prototyping, plus the pipelines that chain them. Five have had the biggest impact on our day-to-day workflow.

### grill-me

Before we write a plan — or after a draft exists and still feels soft — we run `grill-me`. The agent interviews you relentlessly about the design: one question at a time, with a recommended answer each round, walking down each branch of the decision tree until you share an understanding.

It does not start coding. It does not ask five questions at once. If something can be looked up in the repo, it looks it up instead of asking. Decisions stay yours; the agent just forces them to the surface before you've spent a week implementing the wrong thing.

This is the skill we recommend most to teams starting with kstack. Most agent failures are not coding failures — they're unexamined product and design decisions that show up as thrash later. `grill-me` is how we catch those early.

### implement-plan

You write a plan (or have the agent write one), and `implement-plan` executes it phase by phase. After each phase, the agent stops, summarizes what changed, and waits for approval before continuing.

This solves a fundamental problem with agent-driven development. Without phased execution, agents attempt to build an entire feature in one pass — database migrations, API resolvers, React components, all at once. The result is a massive diff where half the code is broken because dependencies are out of order. With `implement-plan`, the migration lands first. You verify it. Then the API layer. Then the client. Issues get caught in the phase they're introduced, not three layers later.

The agent also pauses automatically for migrations, ambiguous requirements, and anything else that requires human judgment — rather than guessing and creating problems downstream.

### manual-review

Most AI code review produces a flat list of PR comments. `manual-review` takes a different approach: it walks through changes section by section, grouped by layer (database, API, client, tests), and pauses after each section for discussion.

You see the database changes, discuss findings, and decide what to address now versus later. Then you move to the API layer. Then the client. By the end, you've reviewed the entire PR through a structured conversation rather than scanning a comment thread. It's closer to pair-reviewing with a senior engineer than reading automated lint output.

### deslop

AI agents produce a specific kind of technical debt: comments that restate what the code already says, unnecessary type casts, defensive null checks that guard against nothing. `deslop` identifies and removes this from the branch diff.

We run it on every branch before opening a PR. The difference in code readability is immediate.

### context-evolve

One of the persistent challenges with agent-driven development is that lessons learned in one session don't carry over to the next. You fix a pattern during review, but the agent makes the same mistake next week because it has no memory of the conversation.

`context-evolve` addresses this. After a review or debugging session, it scans the thread for new learnings — patterns, anti-patterns, conventions, codebase-specific gotchas — and proposes additions to the relevant `context.md` files. It deduplicates against what's already captured and waits for approval before writing anything.

Over time, this means the project's skill context files grow organically from real work rather than being written upfront. The agent gets better at following your conventions because the conventions are being documented as they're discovered.

## Kestral MCP integration

When used with [Kestral](https://kestral.ai), kstack skills sync progress automatically through our MCP server. Phase completion posts a progress update. Pushing code links the branch and PR. A finished review posts a summary to the task.

The team sees what's happening in real time without anyone having to manually update task status. This is especially valuable when multiple agents are working in parallel — the project management layer stays current without additional effort.

The skills work without Kestral as well. The MCP integration is optional.

## Adapting it to your codebase

Every skill has two files: `SKILL.md` contains the generic workflow, and `context.md` is where you add your project's conventions — test locations, lint commands, naming patterns, review checks. Skills work out of the box with empty context files and get more effective as you fill them in.

You don't have to write all the context upfront. `context-evolve` builds it for you incrementally — every review and debugging session is an opportunity for the project's knowledge base to grow. In practice, our context files are mostly the result of months of accumulated learnings, not a one-time setup effort.

Internally, we maintain the same split. The open-source skills stay generic and reusable. Our `context.md` files encode everything specific to the Kestral codebase — our GraphQL patterns, migration conventions, review checklist. Skill improvements flow to the public repo without leaking project internals. Publishing is opt-in per skill, so mechanical eng tooling we use day to day never leaks into the public set by accident.

## Get started

```bash
git clone https://github.com/Kestral-Team/kstack.git
./kstack/scripts/install.sh /path/to/your/project
```

If you only try one skill first, try `/grill-me` on a plan you're about to build.

kstack is MIT-licensed and available on [GitHub](https://github.com/Kestral-Team/kstack). To see how it works end-to-end with Kestral's task tracking, [book a demo](https://cal.com/kestral/30min) or [sign up](https://app.kestral.ai/signup).
