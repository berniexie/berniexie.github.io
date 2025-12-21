---
title: "Coding with agents: a practical playbook"
slug: "coding-with-agents"
author: "Bernard"
date: "2025-12-20"
description: "A lightweight set of principles and prompts for getting reliable, high-leverage results from coding agents: be specific, plan well, verify everything, and institutionalize learnings."
tags: ["ai", "coding", "agents", "cursor", "workflow"]
draft: false
---

Coding agents are extremely capable, but they’re not mind readers. The highest-leverage shift I’ve found is treating them like a very strong new teammate: give them great context, tight constraints, and a plan to follow—then insist they verify reality at every step.

I spent over 9 billion tokens last year prompting Cursor and Claude Code to build our start-up Kestral. This post is a practical checklist I've accumulated during this time to keep agent-driven work fast, correct, and easy to maintain.

---

## Before you start: set the agent up for success

### Be specific (context + constraints + acceptance criteria)

Agents can’t infer what you “meant” from vague prompts. If you under-specify the request, they’ll still generate an answer, but it may be a plausible implementation that doesn’t match your codebase (e.g., it ignores existing patterns or reimplements something that already exists).

- **Provide the smallest relevant context**: point at the exact files, components, routes, and data structures involved.
- **State constraints explicitly**: performance, API compatibility, UI behavior, “don’t change X”, “must keep Y”.
- **Define acceptance criteria**: what must be true for the change to be considered done.

If you’re using Cursor, get in the habit of referencing context directly:

- **Use `@files`** to point at the real implementation.
- **Use `@rules` / `@commands`** to anchor expectations (“follow existing patterns”, “don’t add dependencies”, etc.).
- **Prefer narrow context**: smaller scope usually means faster, more accurate results.

### Use plans!

Agents forget details across long sessions, and they can also “wander” into an implementation that feels locally reasonable but globally inconsistent with your codebase.

A good plan pays dividends because it becomes:

- **Implementation guidance** (what to do next)
- **Documentation** (why you did it)
- **A review checklist** (what to verify)

What helps most:

- **Concrete steps** (“edit `X.ts` to do Y”, “add tests in `Z.test.ts`”)
- **Examples** (request/response examples, UI screenshots, sample inputs/outputs)
- **Code paths** (which functions are touched and why)
- **Diagrams** (even a simple bullet flow is enough)

---

## While you’re coding

### Ask for verification, not guesses

When in doubt, phrase prompts as “verify first” requests.

- **Good**: “Verify where `getUser()` is used before changing the signature.”
- **Good**: “Confirm whether `Foo` already exists; if so, reuse it.”
- **Bad**: “Implement X” (without constraints or a reference point)

This reduces hallucinations because the agent has to reconcile its work with actual code.

### At first you don’t succeed, try, try again

For complex changes, treat early attempts as prototypes and optimize for fast feedback loops.

- **Commit often**: small commits make it easy to bisect and revert.
- **Capture learnings**: when something fails, update the original plan/prompt with what you learned so the next attempt doesn’t repeat the same mistake.
- **Reset intentionally**: if the agent starts thrashing (bug A “fixed” → bug B appears → bug A returns), revert to the last good commit and re-run from the plan state with tighter constraints.
- **Watch for duplicate abstractions**: agents will sometimes create “new” helpers that already exist—catch it early to avoid unnecessary refactors.

### Debugging is still a human superpower

Agents are great at proposing hypotheses, but you’re still the one who decides what matters and how to converge.

Helpful mental loop:

- **What matters / doesn’t matter** (reduce the search space)
- **What could plausibly cause this** (generate hypotheses)
- **Where can we add logs or assertions** (make reality observable)
- **Ask as questions**: “Is this a potential issue?” “Can we verify this assumption?” (prevent hallucinations)

If you can provide real logs, stack traces, and repro steps, an agent’s debugging quality usually jumps dramatically, instead of just asking the Agent to suggest solutions based on symptoms.

---

## Ask the agent to do the things you avoid

Agents are especially useful for tasks that are important but easy to procrastinate:

- **Writing tests**
- **Creating test plans**
- **Drafting documentation**
- **Adding crisp code comments**

Even if you don’t accept the output verbatim, you’ll often get a strong starting point in minutes. This should be something of a no-brainer for something that easily makes your codebase better.

---

## After you’re done: institutionalize learnings

### Update your rules and “golden” examples

Agents have short-term memory. Your job becomes closer to staff engineering: capture the durable knowledge so the next task starts with better guardrails.

- **Add/refresh rules**: what to do, what not to do, and what patterns are canonical here.
- **Update technical docs**: rules are one thing that are helpful for the agent to understand, but you should also ask it to refresh implementation/technical documentation for other humans.
- **Create golden datasets/examples**: representative fixtures, example payloads, known-good patterns, this is especially helpful for things like data queries, migrations, tests, etc.

### Optimize your codebase for agent readability

LLMs are trained on common internet patterns; code that resembles common patterns is easier for them to reason about.

Practical wins:

- Clear naming
- Simple data models
- Predictable file structure
- Minimal “clever” abstractions
- Well written comments

Data models in particular are high leverage: well-designed schemas are easy for agents (and humans) to understand and extend; messy schemas create confusion and migration risk. Using MCPs to ask the agent to query for the data-model is a super easy hack to have it understand your system design extremely quickly.

### Constraints are the real accelerator

There are a hundred ways to implement any feature. Clear constraints prevent wasted time and avoid “technically correct, practically wrong” solutions.

If you only do one thing: make the constraints explicit.

---

## Tooling notes (Cursor and friends)

Cursor has a lot of agent-adjacent tools that are worth using intentionally:

- **Browser tools**: capture ground-truth UI behavior.
- **MCP / integrations**: pull in real data and docs.
- **Plan/Debug/Ask modes**: pick the mode that matches the task.
- **Multiple sessions**: context switching is powerful—run parallel threads for exploration vs implementation.
- **Multiple models/CLIs**: different models excel at different tasks; use the right one for the job.

---

## Further reading

Here's a great article of general coding philosophy with AI. They used Codex, but the same principles apply to any agentic coding tool.
- [Shipping Sora for Android with Codex](https://openai.com/index/shipping-sora-for-android-with-codex/)
