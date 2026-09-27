---
title: Time Is the Missing Variable
date: 2025-10-19
excerpt: "Our smartest AIs have the memory of a goldfish. That's a bigger problem than it sounds."
---

Walk into a coffee shop and, without really trying, you know a lot. You know the guy with the tray is about to bump into you if you don't step left. You know the barista is overwhelmed, because the orders are piling up and she's stopped making eye contact. You know the couple by the window is about to leave, because they've been putting their jackets on for a minute now, and if you hover near that table you'll get it.

None of that is in a single frame. Freeze the scene and all you have is a guy, a barista, a couple and a table. Everything useful you know comes from the few seconds before and the guess you're making about the few seconds after.

That's the thing I keep coming back to with AI right now. Our models are incredible at the frozen frame. Show one a picture and ask it to count the cups on the counter and it'll probably nail it. Show it a video and ask what happened, and things fall apart surprisingly quickly. It loses track of who's who. It forgets what happened thirty seconds ago. It describes each moment well and understands the whole thing badly.

The honest way to put it is that our AIs have the memory of a goldfish. There's a lot of clever work on memory orchestration, stitching together summaries, storing notes about what the model saw earlier and feeding them back in, and some of it works fine, but it feels like a bandaid. You're asking a goldfish to keep a diary. The model still isn't really living through time, it's reading its own notes about it.

I've come to think time isn't just another dimension to add to the pile. It's the dimension that separates perception from understanding. Seeing a thing is perception. Knowing what it means, what caused it and what's likely to happen next, that's understanding, and you can't get there without time.

I feel this most on the mats. I've said before that jiu-jitsu is chess in 4D, three dimensions plus time, and the time part is where the whole sport lives. A position on its own tells you almost nothing. Whether you're about to get swept depends on the grip your opponent set up four seconds ago and the weight shift that's coming. Earlier this year I pointed open vision models at jiu-jitsu matches just to see what they'd do, and they fell apart. I thought at the time it was mostly about two bodies being tangled up, and that's part of it. But the bigger thing is that they had no real sense of time. Each frame was its own little island.

So this month I started a hobby project. An AI that watches your jiu-jitsu rolls and tells you what actually happened. It's a side thing, nights and weekends, and I'm not pretending otherwise.

The idea I'm most excited about isn't training a new model, because I don't have the data or the compute for that and neither do most people. It's building a harness around a model that already exists. The model stays frozen, and around it you put cheap, boring computer vision - pose estimation, how pixels move between frames, where two bodies are touching - and hand those to the model as hints, not gospel. You look at the video once and cache it so you can ask the model several questions without paying for it every time. The model does the reasoning, the harness keeps it honest and grounded in what's actually on screen. A lot of it comes down to one thing. The key is making the model pay attention for longer.

I showed an early version to Roshan, half expecting him to tell me to get back to my actual job. He did the opposite. He looked at the harness and told me this should be its own thing, its own product, maybe even a paper. Having someone you respect see something in your weekend tinkering that you hadn't let yourself see yet is a strange and lovely feeling, and it's made me take it a lot more seriously than I'd planned to.

I don't know where this goes. I've learned not to plan too far on something this early. But I know the question is a good one, and I know it's going to take a long time, and I've always liked the long games best. If we want machines that understand people, and not just describe them, they're going to have to learn to remember what they just saw.

Goldfish don't get to be coaches.
