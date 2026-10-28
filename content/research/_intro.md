**I work on getting machines to understand how people move, and how they interact.**

Two people in contact are one of the hardest things to see: bodies hide each other, limbs wrap and thread, and one camera can't tell you how far apart they really are. I started by asking whether a vision-language model could follow my own jiu-jitsu footage, and when it couldn't, I went after why - building harnesses, datasets, auto-labellers and 3D pipelines that measure engagement directly: where two people touch, how their limbs wrap, how far apart they are, over time, from ordinary video. What I've found so far is that engagement has a difficulty ladder - a handshake or a hug is easier than a dance, and a dance is easier than a scramble on the ground - and that one camera can now measure the distance between two people to within about 3 cm on held-out sequences, given the person boxes - an optimistic number, since the body model I build on saw that dataset in training, so testing on footage it has never seen is next. Over the next few years I want to turn that into large datasets of engagement in the wild, a layered model that reads every kind of human contact, and eventually the simulations robots will need to learn to be a dance partner, a caregiver, or a training partner that never hurts you.

I've done this as an independent researcher, self-funded, because I'm obsessed with this problem and have the freedom to chase it - with real help from the coaches at my gym, the founders of Zopu, and the folks at Lossfunk who pushed me to publish.

## Questions I'm chasing

In the order I want to answer them:

1. **Bodies as building blocks.** My measurements already treat each person's arms and legs as loops the other body can thread. Can a handful of body primitives describe every kind of engagement?
2. **A dataset of engagement.** Easier engagement - a handshake, a hug - is far more understandable than a dance or a scramble on the ground. What does a dataset need to cover that whole ladder, in the wild, well enough to train models and simulations?
3. **A layered decoder of engagement.** With that data, which models do you fine-tune? Decoders on top of VLMs like Qwen, VLMs fine-tuned on spatial movement, computer-vision models like SAM tuned for tight contact - layered, each doing the part it's best at.
4. **Depth from one camera.** How far can a single ordinary video go, if you use where two people meet and not just how big they look?
5. **An engagement API.** Four-dimensional analysis from any regular video - who, where, contact and depth, over time - that anyone can test on their own engagement scenarios.
6. **From seeing to acting.** How do you carry that into simulation and vision-language-action models, so a robot learns how to engage?
7. **Touch.** What does a robot need to learn to be in contact with a person safely - how close, how much force, when to hold back?
