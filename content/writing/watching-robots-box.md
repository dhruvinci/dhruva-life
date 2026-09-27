---
title: Watching Robots Box
date: 2026-09-06
excerpt: "Everyone laughed at the boxing robots. I couldn't stop watching their feet."
---

A while back a clip of Unitree's humanoid robots boxing each other did the rounds, and most people I know laughed at it. I get it. Two robots squaring up, throwing slightly stiff punches, occasionally toppling over like a toddler who's had too much sugar. It's funny.

I watched it more times than I'd like to admit, and I wasn't laughing. I was watching their feet.

They were strafing. Circling out when they got pressured, cutting angles instead of just marching forward. When they threw, you could see the weight moving through the technique, from the floor up through the hips into the punch, not just an arm swinging on its own. And the bit that genuinely gave me goosebumps - when one of them took a hit, it rebalanced. It staggered, found its base, and came back. That's not a trivial thing. I've seen plenty of humans on a mat who can't do that yet.

I said at the time that if you added some real-time vision to it, something that could read the opponent's technique as it's happening, we might have Real Steel on our hands sooner than anyone thinks. I was half joking. Only half.

The reason I saw footwork where other people saw a comedy sketch is jiu-jitsu. I spent all of 2024 on the mat, six hours a day, six days a week, and somewhere in there my eyes changed. Jiu-jitsu is chess with your body as the pieces, except the board is three-dimensional and the clock is always running - chess in 4D. You stop watching the hands, because the hands lie. You watch the hips, the base, where the weight is, what someone is about to do before they do it. After a year of that you can't turn it off. You watch a robot box and your brain starts grading its guard.

That way of watching is basically everything I've built since.

Kakashi is an AI that watches jiu-jitsu rolls and tells you what happened. The paper that came out of it, which got accepted at CAISc this year, is about making vision models describe human movement faithfully instead of just fluently. And what I'm in the middle of right now is the next layer down: how do you get a machine to see a body the way a trained eye does?

I've been borrowing an idea from Kahneman. You have a fast, reflexive system that reacts before you think, and a slow, deliberate one that reasons. Vision models map onto that surprisingly well. Pose estimation, segmentation, classifiers - those are fast and cheap and instinctive. The big vision-language models are slow and expensive and good at reasoning. My paper showed they're much better together than apart. Now I'm trying to build that marriage properly rather than bolting one onto the other - pairing Laya Vision with a small VLM and a fine-tuned Qwen, pulling the vision tower out and probing its layers to see how much spatial information actually survives, and where. The hardest case I keep coming back to is two people in close contact, and a model keeping track of whose limbs are whose.

(Yes, I'm aware I've just described my entire personality as a stack of vision models.)

Here's why this matters beyond the mat. Watching the robots box, it hit me that the fast system is exactly what they need. A robot that has to think for three seconds before reacting to a punch has already been punched. But a robot that only reacts, with nothing slower underneath to understand what's going on over time, is going to be stuck being a clever toy. The interesting machines of the next decade are going to need both - reflexes and understanding - and they're going to need them for the thing that's hardest to see, which is people.

That's the direction I keep drifting in, and I've stopped pretending otherwise. For years I've been building machines that watch humans. The obvious next step is machines that understand humans well enough to be in the room with them, and to interact - to spar, to help someone up, to hand over a cup without knocking it out of your grip. Through vision, sure, and eventually through every other sense we can give them. Teaching machines how humans interact.

I didn't plan any of this. I went to the mat for my health and a sport I could do for the rest of my life, and it quietly rewired how I see. The things I love have a habit of turning into things I build, and this one has been growing for a while.

People laughed at the boxing robots. I think they'll stop laughing sooner than they expect.

I'll be watching the feet.
