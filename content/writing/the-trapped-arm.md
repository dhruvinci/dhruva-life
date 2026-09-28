---
title: The Trapped Arm
date: 2026-09-27
excerpt: "I've spent two months asking a machine one question: whose arm is that? The answer, so far, is mostly no."
---

If you've ever been caught in an armbar, you know exactly whose arm it is.

It's yours. It's stretched across someone's hips, their legs are clamped over your chest, and every nerve in your body is very clear about the ownership situation. You tap. Nobody on the mat is confused about whose limb just got hyperextended.

Machines are.

I've spent the last two months on one clip. Two athletes, an armbar, 146 frames. At the start they're clearly two people. By the end they're one knot of limbs, and one arm - the trapped one - is the only thing that matters. And I've been asking a very simple question, over and over, in every way I can think of. Same image. Show me athlete one. Now show me athlete two. Whose arm is that?

The answers have been humbling.

I tried the best segmentation models there are. They separated the two athletes beautifully while they were apart, and fell apart the moment they tangled. I had a big language model look at the frames and tell the segmenter who was who. It kept the identities perfectly consistent - and then pointed at the other guy's torso when it meant the arm. It knew. It just couldn't put it in the right pixels.

So I went deeper. I pulled apart a 27-billion-parameter open model layer by layer - every vision layer, every language layer, about 146 gigabytes of its internal states - and trained small probes on top to see whether, somewhere inside, it knew whose arm it was. I asked it to think harder. I gave it the action. I gave it more frames. None of it beat just looking at the pixels. And when I swapped the two athletes' identities, the whole map flipped - it hadn't learned anything about the arm, it had learned a name tag.

That's the part I keep coming back to. The model can describe an armbar. It can tell you who's who. It still can't tell you whose arm it is. Fluent, but not faithful, all over again - just at a much smaller, much harder scale.

Here's the other thing these two months taught me, and I think it matters more than any single number. Simple baselines keep winning. Plain geometry beat my fancy ownership heads. Plain interpolation beat my learned temporal models at filling in hidden poses. Adding more data made one model decide everyone in the world was standing up. Every time I built something clever, the boring version was sitting right there, doing as well or better.

There's a version of research where you don't put the boring version in the table. You compare your clever thing against other clever things, find the angle where yours wins, and write that up. I understand the temptation. It's also exactly how you end up believing something that isn't true.

I'd rather know. So every experiment has its controls, every table has its dumb baseline, and every failure stays in the record next to the successes. A negative result, done properly, is a map of where not to dig. I've got a pretty detailed map now.

And it's not all negatives. A small, fast model reading frozen features got posture right across sources it had never seen. Tracking the middle of a pair of limbs, instead of each individual limb, predicted movement well - precisely because it stopped pretending to know which arm was which. Even that is a clue. The thing we can't do yet is the thing everything else keeps routing around.

So that's where I am. A very narrow question that turns out to sit underneath almost everything I care about. If a machine is ever going to coach you, spot an injury before it happens, or work alongside you without hurting you, it has to know where you end and someone else begins.

It's the most interesting problem I've ever been stuck on. I'm going to keep pulling on it until the arm comes loose.
