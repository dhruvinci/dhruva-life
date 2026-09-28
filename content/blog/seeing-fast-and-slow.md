---
title: Seeing, Fast and Slow
date: 2026-09-27
excerpt: "Kahneman wrote about thinking fast and slow. I went looking for whether anyone had studied seeing fast and slow - and it sent me down a rabbit hole about what our models actually see."
---

You can recognise someone you love from the far end of a street.

Long before you can see their face, before you could describe their clothes, you just know it's them. It's the walk. The way their shoulders move, the rhythm of it. Ask you to explain how you knew and you'd struggle. You'd say something vague like "I just know how she walks". And you'd be right.

I've been thinking about that a lot lately, because it's exactly the kind of seeing my models are bad at.

It started with Daniel Kahneman's Thinking, Fast and Slow. His idea is that we run on two systems. System 1 is fast, automatic, instinctive - the part of you that flinches before you decide to. System 2 is slow, deliberate, effortful - the part of you that does long division. But Kahneman was writing about thinking. I wanted to know if anyone had looked at seeing the same way.

Turns out, a lot of people have.

In 1973 a psychologist called [Gunnar Johansson](https://en.wikipedia.org/wiki/Biological_motion_perception) stuck a dozen little reflective patches on a person's joints - wrists, elbows, shoulders, hips, knees, ankles - and filmed them moving in the dark. Show people a still photo of those dots and they see nothing. Just dots. But the moment the dots start moving, everyone instantly sees a person. Walking, running, even what kind of mood they're in. From twelve dots! That's the street, in a lab.

Then in 1996, [Thorpe and his colleagues](https://www.nature.com/articles/381520a0) flashed photos at people for 20 milliseconds and asked one question - is there an animal in it? People could do it, and their brains had sorted it out in about 150 milliseconds. You can't reason through anything in that time. It's just seen.

And then there's the other side. You know Where's Wally? Anne Treisman's work on [visual search](https://www.sciencedirect.com/topics/neuroscience/feature-integration-theory) explains why that book is hard. If you're looking for one red dot among blue ones, it pops out instantly, and it doesn't matter if there are ten blue dots or a hundred. But if you're looking for something defined by a combination of features - a red-and-white striped shirt, glasses, a beanie, in a crowd full of red and white - you have to go looking, one by one, and it gets slower the more stuff there is. Her explanation is that single features are processed all at once, in parallel, but binding features together into one object needs focused attention. That's slow seeing.

My favourite framing of all of this is [reverse hierarchy theory](https://www.cell.com/neuron/fulltext/S0896-6273(02)01091-7), from Hochstein and Ahissar. They split vision into "vision at a glance" and "vision with scrutiny". At a glance you get the gist first - forest before trees. Only when you need to do you go back down and scrutinise the details.

Think about a batter facing a fast bowler. They have roughly half a second from the ball leaving the hand. There's no time to scrutinise anything. Years of practice have pushed all of it into the glance - the wrist, the seam, the length. And yet the same batter can sit with the video later and explain every ball in painful detail. Same eyes, two speeds.

I feel this in jiu-jitsu too. When I started, I saw everything slowly, and I'd be on my back before I finished thinking. Almost three years in, a little of it has moved into the glance. Not most of it. A little.

So where do machines fit?

The big vision-language models feel very System 2 to me. They're slow, they reason, and they describe things beautifully in words. But ask them for the kind of thing we get at a glance - where exactly is that arm, whose is it, which way is the weight going - and they struggle. Which is funny, because in Treisman's terms, "whose arm is it" is a binding problem. It's the slow kind even for us. We just get so much practice at it that it feels fast.

So I got curious and went inside a few of these models. I probed their internal layers to see whether that spatial information, the stuff we'd call intuition, was in there at all. And I think some of it is. But not in the way I expected. I expected something abstract and conceptual, like a sense of shape or space. What I seem to be finding is that it's stored more like tokens of associated text - words and concepts the model relates to each other. The model doesn't quite hold "the arm is here". It holds something closer to words about the arm, near other words.

I'm not the only one seeing this, which was a relief. [Researchers looking inside VLMs](https://arxiv.org/abs/2410.07149) have found that visual tokens start turning into words in the middle layers of the model. And [another group](https://arxiv.org/abs/2506.08008) found that VLMs often do worse than their own vision encoders on spatial tasks like depth and correspondence. The information is right there inside the model. It just doesn't get used.

So here's the seed of a thought I'm working with, and I want to be upfront that it's still fuzzy. Maybe the problem isn't that the models can't see. Maybe it's how we encode what they see, and how we decode it back out. We squeeze an image into tokens that behave like words, and then ask a language model to reason about space using words. What if we could build more of those spatial and visual cues into the architecture itself - the glance-level stuff, the twelve dots - and keep it spatial instead of translating it into text? Would the model see a little more like we do?

I honestly don't know yet. I have hunches, and a lot of experiments that didn't go the way I hoped. Some days I feel like I'm onto something, and some days I feel like I've just rediscovered something people figured out years ago (which, to be fair, is also how you learn).

But I've never paid this much attention to my own eyes. I catch myself noticing what I see first when I walk into a room, what I miss, and what I only see the second time. It's made me a better watcher, and probably a slightly strange person to walk down a street with.

These are the seeds that got me working on this. I'll keep watching, and I'll keep writing down what I see.
