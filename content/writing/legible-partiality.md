---
title: Legible Partiality
date: 2026-04-26
excerpt: "Every model sees from somewhere. I'd rather it told me where it's standing."
---

In 2017, during my Masters at Syracuse, where I was majoring in AI, I put my hand up in class and asked my professor a question I thought was pretty obvious. Were there any studies that factored in the biases of the humans who build these models? Not the bias in the data, which people were already talking about, but the people themselves - what they chose to measure, what they thought was normal, what they never thought to ask.

There weren't. And that scared me.

It's been nine years and the question hasn't left me. If anything it got louder, because back then the models were classifiers in a lab and now they're the thing half the world talks to before breakfast.

The way I see it, there are two schools of thought on what to do about bias in AI. The first is the dream of neutrality - Thomas Nagel's "View from Nowhere", the idea that if we're careful enough we can build something that sees the world from no particular point of view. It's a beautiful idea, and Nietzsche had already taken it apart long before: knowledge from no point of view is incoherent. There's no seeing without a seer. Every model is trained on something, by someone, scored against somebody's idea of right.

The second school accepts that and tries to manage it. There's a proposal out of Berkeley for a "Dynamic Center of Bias", the idea that instead of pretending to be neutral, a model should keep adjusting toward some balanced middle. It's more honest than the first, but it still assumes there's a centre worth finding and that someone gets to decide where it is.

I think both are wrong.

What I want is legible partiality. A model that is partial, because everything is, but partial in a way users can see and reason about. Tell me where you're standing. Let me move you somewhere else if I need to. And have something checking your work that doesn't share your blind spots.

This stopped being abstract for me the day I started pointing vision models at people.

A vision model has an idea of what a body looks like, and that idea came from what it was shown. When I first ran open models on jiu-jitsu footage, they were fine with one person standing in good light. Two people wrapped around each other on a mat, limbs going in and out of view, and the models started seeing things that weren't there, or confidently narrating a completely different match. Nobody built them to be bad at grappling. My guess is they learned what a body looks like from a world where bodies are mostly upright, alone, and facing the camera. That's a point of view. It's just not a legible one.

And then there's my own partiality, which is the uncomfortable part. Kakashi sees a roll through one camera, from wherever someone happened to prop up their phone. It names positions using a vocabulary I wrote down, which reflects how I learned jiu-jitsu and how the people I train with talk about it. When a coach corrects an output, that correction carries their style and their game into the system. None of that is neutral, and pretending it was would be the worst thing I could do.

So I'm trying to make it legible instead. Say which camera angle it had. Say which list of positions it's choosing from. Say when it's unsure rather than guessing with a straight face. Let a coach who disagrees with the vocabulary push back on it, and treat that pushback as data rather than noise. And keep a second, cheaper set of eyes - the boring computer vision that tracks joints and motion - as a check on the big model, because it fails differently.

Transparency, steerability, adversarial checking. None of that makes the model unbiased. It makes the bias something you can argue with.

I think about that class in 2017 a lot. I didn't have the words for it then, just a gut feeling that something important was missing from the conversation. I still don't have a complete answer, and I'm a little suspicious of anyone who says they do. But I've stopped wishing for a model that sees from nowhere.

Somewhere is fine. Just show me the spot.
