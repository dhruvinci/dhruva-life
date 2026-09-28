I work on getting machines to understand how people move - and eventually, how they interact. So far that mostly means vision-language models on long, messy, contact-heavy video. Mostly grappling - jiu-jitsu and MMA - because two bodies tangled together is about as hard as vision gets, and I can actually check the answers.

The short version of what I've learned: VLMs are fluent, but not faithful. They'll narrate a scramble in perfect English and get the position wrong. What's fixed it so far isn't a bigger model, it's the harness around it. And the harder I look, the more the problem narrows to one question: whose arm is it?

Questions I'm chasing next:

- How do you give a model's sense of *who's who* a genuinely spatial interface, so it assigns the right limb to the right person?
- How do you put fast, reflexive vision (classifiers, pose, segmentation) and slow reasoning (VLMs) into one system?
- Can the right grounding make *small* models faithful, not just big ones?
- What does it take to go from watching people to working alongside them?
