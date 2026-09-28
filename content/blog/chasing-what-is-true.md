---
title: Chasing What Is True
date: 2026-07-26
excerpt: "My paper got accepted. The part I'm proudest of is the section about where it falls short."
---

My parents taught me to chase what is true and share it. I don't think they ever said it in those words, it was more in how they lived, but when I sat down to write the acknowledgements for my first paper, that's the sentence that came out. It felt like the most accurate thing in the whole document.

The paper got accepted at CAISc 2026. Sole author, independent researcher, no lab behind me - just a question I couldn't stop asking and a lot of footage from real mats. The camera-ready is done. I'm still a little in disbelief.

The paper is called "Harnessing Vision-Language Models for Faithful Human-Movement Understanding", which is a very formal way of saying: these models describe people moving in lovely, confident prose, and they're often wrong, so how do you make them right? My answer was to stop throwing more at them. Instead of a bigger model, I built a harness around a frozen one - small, cheap computer-vision hints about pose, motion and contact, treated as hints rather than gospel, a compact answer instead of a verbose one, and the video cached once so you can take several cheap passes at it. Win by removing.

It worked better than I'd hoped. On one densely annotated match, position accuracy went up about 11x. Across 496 clips, it identifies the position 58.9% of the time.

But the result I care about most is the one that looks, at first glance, like bad news.

When I ran it on 200 real uploads it had never seen before - 4,620 segments, each reviewed by an expert - exact accuracy dropped to 46.7%. That's the number a lot of people would bury in an appendix. I put it front and centre, because of what sat underneath it. 93% of the mistakes were confusions between adjacent positions. When it was wrong, it was wrong the way a sharp white belt is wrong - mixing up two positions that are one hip movement apart - not the way a confused model is wrong, inventing something from nowhere.

It fails well.

I think that might be the most useful thing I've found. A system that degrades gracefully is something a coach can actually work with. You can trust its rough shape even when the details wobble, and you know where to look when you're checking it. A system that's right 60% of the time and wildly, confidently wrong the other 40% is, honestly, worse than useless, because you can never tell which answer you're getting.

The limitations section was the other part I'm proud of, which is a strange thing to say about a limitations section. The dense evaluation is one match. The models are frozen and all from one family. It's single-camera. Each of those is a real hole, and I wrote them down plainly rather than dressing them up. Put together, they're also the map for what comes next - more videos and more annotators, other model families, and whether the right grounding can lift much smaller models.

I've been thinking about why that felt so important to me, and I think it's because the entire paper is about machines that sound more certain than they are. It would've been a bit rich to write it in a voice that sounded more certain than I was. If I'm going to ask models to know what they don't know, I should at least be able to do it myself.

That's what research is, for me, at its best. The pursuit of what's actually true, including the parts that don't flatter you, and then handing it to other people so they can go further. The code and a first cut of the benchmark, MoveBench v0, are open source. Someone out there can take my one dense match and make it a hundred. Someone can try a different model family and prove me wrong about something. I hope they do.

This work happened on real mats, with real people rolling, and it will get better the same way jiu-jitsu gets better - one honest correction at a time. I'm just glad I got to share the first round.

I think my parents would call that chasing what's true.
