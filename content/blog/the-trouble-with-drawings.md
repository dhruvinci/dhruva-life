---
title: The Trouble with Drawings
date: 2025-05-25
excerpt: "A picture says a thousand words. The problem is working out which thousand."
---

Draw a box. Now tell me what it is.

It could be a server. It could be a phone screen, or a web page, or a button on that page. It could be a person, if you're the kind of person who draws people as boxes (I am). It could be a database, a team, a step in a process, or just a box you drew because your hand needed something to do while you thought. To you it's obvious. To a model looking at the same four lines, it's a coin toss with about twenty sides.

I still believe drawing is the right way for most people to talk to AI, maybe more than ever. But I've spent enough late nights staring at boards the model completely misread to know the other half of the story. Visual prompts are better than text prompts, and they're also worse, and the interesting work lives right in the gap between the two.

The better part is easy to feel. People think in pictures. A sketch carries layout and relationships and hierarchy all at once, stuff that would take a paragraph to type out and that most people would never bother typing anyway. One arrow from a little phone to a little cylinder says "the app saves stuff somewhere" faster than any prompt ever could. You get a thousand words for free.

The worse part is that you don't get to pick which thousand. Drawings are abstract by nature - that's what makes them fast - and abstraction is just ambiguity with good manners. An arrow might mean data flowing, or time passing, or "the user clicks this and goes there", or "this thing depends on that thing". A scribbled word next to a shape might be its name, or a note to self, or a crossed-out old idea nobody bothered to erase. Humans resolve all of this without noticing, because we've got context, we know the person, we can see which box they drew first and which one they keep tapping with the marker while they talk. The model gets a still image and a lot of hope.

So what does it take for a model to read intent from a drawing? Honestly I'm still working it out, but a few things have become clear. You can't treat the drawing as one picture, you have to treat it as a lot of small decisions that add up to a picture - what are the shapes, what's written on them, what's connected to what, and which of those connections actually matter. The labels do more work than the shapes, almost always. Position means something, since people tend to put the important thing in the middle and the afterthoughts on the edges. And the board around a drawing is context too, the stuff someone drew five minutes ago usually explains the stuff they're drawing now. None of this is magic. It's what any of us would do if someone handed us a photo of a whiteboard and left the room - squint, make a guess, check the guess against everything else on the board.

Then there's the unglamorous side, which is most of the job. It's not one model reading these boards, it's several, and each one has its own strengths and its own ways of being confidently wrong. Getting them to hand work to each other cleanly, deciding which one is worth calling for which part, making the whole chain fast enough that a person drawing on a board doesn't sit there watching a spinner, keeping all of it running on our own servers without the costs running away from us - that's where the weeks actually go. Every time I shave time off one step, another step becomes the slow one. It's whack-a-mole with GPUs, and I love it more than I probably should.

The more time I spend on how models see drawings, the more I catch myself reading about how models see anything at all. A model can describe a picture beautifully and still miss the one thing a five-year-old would point at straight away. That bugs me more than it should.

A drawing is a half-finished thought. The job is to finish it the way the person meant to, not the way that's easiest to guess.

Still working on that part.
