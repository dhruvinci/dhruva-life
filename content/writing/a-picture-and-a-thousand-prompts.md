---
title: A Picture and a Thousand Prompts
date: 2025-03-09
excerpt: "Most people can't write a good prompt to save their lives, but hand them a marker and they'll draw you the whole idea."
---

Ask someone to describe the app they've always wanted to build and watch what their hands do. They start drawing in the air - a box here, an arrow going over there, "and then this thing talks to that thing" - and if there's a napkin anywhere near them, it's gone. Nobody I know thinks in paragraphs. We think in shapes.

I've been chewing on this since January, when I joined my friend Roshan at Zopu.ai as a founding AI engineer. The idea fits in one sentence, which is always a good sign: a board, a bit like Miro, where you draw your product, your architecture, your system, whatever's rattling around in your head, and you get something real back out. Vibe coding for people who've never heard the phrase vibe coding.

Here's the honest truth about prompting that the rest of us like to skip over. It's a skill, and a strange one. The people getting magic out of these models are mostly people who already write for a living, or code for a living, or spend far too many hours talking to chatbots (guilty). They know you have to set the scene, name your constraints, say what you don't want, and then go back and forth a few more times until it clicks. Most people type one line, get something mediocre back, and quietly decide AI isn't for them. That isn't a failing on their part - we built the door at a height only some people can reach.

But anyone can sketch. You don't need a vocabulary for it, you don't need to know what a database is to draw a little cylinder and point an arrow at it, and you definitely don't need to know how a language model wants to be spoken to. A drawing is the most natural interface humans have had since we were scratching on cave walls, and somehow we skipped right past it on the way to the chat box.

I spent four years at PwC as an enterprise architect, and if I'm being honest, a big part of that job was drawing boxes and arrows on whiteboards until a room full of people agreed on what we were building. The drawing was never the product, but it was the moment everyone finally saw the same thing. Then at Dehidden, after working with 29 clients, the patterns got so obvious that we built a self-serve product so brands could do it themselves instead of waiting on us. Both of those lessons are sitting in this one. Meet people where they already are, and then get out of their way.

So what am I actually doing all day? I'm building the pipeline that takes a drawing and turns it into output. It sounds like one step and it's really a lot of small ones. The board has to be read, the shapes and the scribbled labels and the arrows between them have to become something a model can reason about, and then that reasoning has to turn into something a person can use and poke at and change. No single model does all of that well, so it's a few of them, each good at its own thing, passing the work down the line. We're hosting them on our own servers, which means every choice about which model runs where, and how fast, is ours to get wrong. Some days I get it wrong. It's early, it's messy, and I'm having a lot of fun.

There's also something personal in it. I spent all of last year on the mats, training jiu-jitsu six hours a day, and coming back to a keyboard I half expected to feel rusty. Instead it felt like the ground had moved while I was away. The models are good now, really good, and the bottleneck has quietly shifted from what the machine can do to whether a normal person can even ask it. That's a problem worth giving a year to.

I keep thinking about the gap between people who have ideas and people who can build them. It's always been a gap of tools and training and time, and for most of history the people on the wrong side of it just didn't build. If the input becomes a sketch, a lot of that gap closes. Not all of it, I'm not naive, but enough that someone with a napkin and a good idea gets a real shot.

A picture's worth a thousand words. Most people just never had anyone to hand the picture to.

Draw it. We'll figure out the rest.
