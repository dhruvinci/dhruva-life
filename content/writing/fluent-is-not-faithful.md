---
title: Fluent Is Not Faithful
date: 2026-01-18
excerpt: "The model told me a beautiful story about the match. It just wasn't the match I'd watched."
---

Last summer I fed an open vision model a few minutes of an Andrew Tackett match and asked it a simple question - what happened? It came back with a gorgeous paragraph, guard pulls and sweeps and a patient pass, written with the calm confidence of a commentator who's seen ten thousand matches, and a good chunk of it never happened. Two bodies tangled up on a mat is apparently where these models lose their eyesight, and instead of saying "I can't tell whose leg that is", it just told me something that sounded right.

That paragraph has followed me around ever since.

I started Kakashi in October as a side hobby, an AI that watches your jiu-jitsu rolls and tells you what actually happened. This month it grew wings and became a real product, which is exciting and a little terrifying, because now the gap between sounding right and being right isn't something I get to be curious about on a Sunday. It's somebody's training. If you drill six days a week and upload a roll, you deserve to hear what actually happened, not a nice story about it.

Here's what I keep coming back to. These models don't understand you in the way we'd like to believe - they predict the most probable next token, and they're astonishingly good at it. But when they don't know something, they have two options. They can admit they're uncertain, which almost never gets rewarded. Or they can generate something plausible, which gets rewarded constantly, by the benchmarks, by the way they're trained, and honestly by us, because we like confident answers. So they learn to be fluent. Nobody really taught them to be faithful.

You see it in the silly stuff (ask one how many r's are in strawberry and watch it squirm), and you see it in the serious stuff. It's pattern-matching at scale, and it works remarkably well, until it doesn't. In my little corner of the world, "until it doesn't" happens every single time someone's arm disappears behind someone else's back.

Now the confession. A couple of weeks ago I was going through a pile of Kakashi's outputs, trying to figure out which parts were actually earning their keep, and the answer wasn't flattering to the fancy part. The cheap, boring computer vision - where the bodies are, how things are moving, who's touching whom - was doing most of the heavy lifting, and the big model was mostly turning that into sentences. I wrote this down in my notes that night: "The more I analyze these insights, it makes me wonder if I'm doing visual intelligence at all… and if AI is needed anywhere here at all."

Strange thing to feel in the same month your side project becomes a real product.

I sat with it for a few days, and I think I was asking the wrong question. The question isn't whether the model is needed. It's what the model should be asked to do. When I roll and lose track of a scramble, I don't make something up - I rewind, I look at the hips, I figure out where the weight was, and only then do I say what happened. The model was being asked to do all of that in one go, from raw pixels, over minutes of footage, and it did what anyone would do under that pressure. It bluffed.

So I've been giving it less, not more. Small hints from the cheap vision tools, treated as hints and not gospel. A shorter answer instead of an essay. Room to say "not sure" without being punished for it. It's early, and it's messy, but the outputs are getting quieter and more honest, and quieter is exactly what I want.

I think this is a bigger deal than jiu-jitsu. Physio, injury prevention, elder care, coaching - anywhere a machine watches a human body and tells another human what it saw, a confident wrong answer is worse than no answer at all. A beautifully written wrong answer is worse still, because it's so easy to believe.

We need AIs that know what they don't know. That's the whole wish, really. Everything else - the bigger models, the longer context, the prettier demos - is nice, but it's built on sand if the thing can't tell you when it's lost the plot.

For now I'd settle for one that can tell me when it's lost a leg.
