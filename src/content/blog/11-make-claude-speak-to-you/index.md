---
title: "Make Claude speak TO you, not LIKE you"
description: "Claude tends to mirror how you write, but the way you talk isn't always the way you best take in information. Here's how I tuned mine to how I actually process things, using retention tests instead of guessing, plus a prompt so you can build your own."
date: "August 5, 2026"
draft: true
keywords:
  - claude
  - llm
  - communication
  - neurodivergence
  - prompting
---

Talk to Claude for a while and you notice something. It starts to sound like you. Write formally and it answers formally. Crack a joke and it loosens up. That mirroring is usually a nice property. Language models pick up the register and style of the person in front of them.

I missed one thing about it for a long time. The way I talk is not the way I best take in information. Those are two different systems, and the mirroring only serves the first one. When Claude explains something new to me in my own comfortable style, it optimises for how I sound, not for what stays in my head afterwards.

So I stopped guessing and ran some tests on myself.

## The mistake I was making

If you had asked me how I like things explained, I would have said analogies help me get it. I believed that. I had believed it for years.

It turned out to be wrong. When I checked what I actually retained, analogies made things worse. They forced me to translate the idea twice, first from the analogy into the real thing, then into memory. The version with no analogy, just the mechanism described plainly, landed better every time.

I only found that out because I tested it instead of trusting my own report. That is the point of this post. You are probably wrong about how you best process information, and it is the kind of wrong you can measure.

## What I built instead

I wrote a communication protocol. It is a file my agent loads at the start of every session, and it tells Claude how to explain things to me specifically. Not "be concise". Actual rules, each one backed by a small test of what I retained.

A few of the rules that came out of it:

**Explain in short sentences linked by cause and effect, not bullet points.** Loose facts in a list do not encode for me. A causal chain does. Same facts, very different retention.

**Bold the key terms and values.** I re-read. I always re-read. Instead of fighting that, the design makes re-reading cheap, so my eye finds the important word without parsing the whole sentence again.

**Tie any explanation to a consequence for me before explaining it.** This was the big one, and I would not have guessed it. When a topic did not connect to something I cared about, no amount of formatting saved it. I just did not retain it. Framed as a decision with a consequence for me, the same content stuck on the first try.

That last rule is the thing the exercise taught me that I value most, and it only showed up because a test forced it out. Interest is not a nice-to-have for my memory. It is a gate the information has to pass before formatting even matters.

None of these are aesthetic preferences. Each one earned its place by beating the alternative in a retention check.

## Build your own

You do not need my file. You need your own, because your constraints are not mine. Claude can run the whole thing on you. Paste this into a fresh conversation and give it twenty to thirty minutes.

```
I want you to build me a personal communication protocol: a set of rules for how you should
explain things to me, calibrated to how I actually process information, not how I think I do.

Work in four phases. Do them in order and don't skip the testing.

PHASE 1: INTERVIEW
Ask me about how I take in information. One question at a time, wait for my answer. Cover at
least: whether I re-read things and where; whether long nested sentences cost me; how I feel
about analogies, acronyms, tangents, parentheticals; whether I retain loose facts or need
cause-and-effect; whether I prefer tables, prose, or bullets; and what my attention does when a
topic doesn't interest me. If I mention a formal assessment (cognitive profile, ADHD/dyslexia
eval, learning profile), ask me to paste the relevant parts, since measured beats self-reported.

PHASE 2: TEST
Don't trust my self-report. Run small retention checks:
- Take one idea and explain it two ways (e.g. bullet list vs. linked causal prose). Ask me which
  one I actually followed and could repeat back.
- Explain the SAME kind of content twice: once using a topic I care about, once using a neutral
  topic. Compare how much I retained. This tells us whether interest gates my retention.
- Try one explanation WITH an analogy and one WITHOUT. See which lands.
Run at least three of these. Tell me what each one is testing before you run it.

PHASE 3: DERIVE
From the interview and the tests, write the rules. One rule per constraint. Each rule states the
instruction AND the one-line reason behind it, so I don't later delete a rule whose purpose I
forgot. Prioritize rules the TESTS supported over rules I merely claimed.

PHASE 4: WRITE THE FILE
Output a finished protocol file I can save as CLAUDE.md (or paste into custom instructions). Include:
- a header saying this is evidence-based, not aesthetic preference
- a short profile: which mental operations are cheap for me, which are expensive
- the numbered rules with their reasons
- a one-line "reading signal" you print at the start of every session so I know the file loaded
- an adaptation section: how to detect when I'm low on capacity and switch to a stripped-down format

Start with Phase 1, first question only.
```

Save the output as `CLAUDE.md` if you use Claude Code, or paste it into the custom-instructions field of whatever tool you use. It loads every session from then on.

## Two things that make the test sharp

The testing phase is only as good as the material you feed it. Two inputs matter most.

Bring a topic you genuinely care about. When Claude runs the interest-versus-neutral test, do not give it a generic example. Give it a real passion, a hobby, a game's lore, a field you follow on your own time. The gap between how much you retain on that versus a neutral topic is often the single biggest finding of the whole exercise. For me it was decisive.

Bring facts from the domain you actually work in. Have Claude test you with real material from your job, a piece of your stack, your field's jargon, a system you own. It makes the test realistic. And if a few people do this, it lets us compare. Does retention track interest and domain the same way for everyone, or is it personal? That comparison is where it gets interesting.

If you have any formal assessment of how you learn or process, a cognitive profile, an ADHD or dyslexia evaluation, paste it in during Phase 1. Measured constraints beat self-reported ones every time.

## Why bother

The default assistant is tuned for the average reader. On every axis you are not the average reader, and neither is anyone else. The gap between "generically clear" and "clear to you" is real, and you pay it on every message until you close it.

Closing it once, with evidence, pays back on every session after.

If you run the exercise, I would like to hear two numbers: your interest-versus-neutral retention gap, and whether domain facts helped. If the pattern holds across people, that tells us something. If it is wildly personal, that tells us something too. Either way you end up with an agent that finally speaks to you.
