---
title: Leg Spaghetti
date: 2026-10-14
category: research
excerpt: "A berimbolo takes about four seconds. Getting a machine to see whose foot is whose is taking a lot longer."
---

<figure>
<img src="/images/blog/leg-spaghetti/berimbolo.gif" alt="A no-gi berimbolo: the bottom player inverts underneath the standing opponent, their legs tangle, and four seconds later they're sitting on the opponent's back" width="288" height="320">
<figcaption>Lachlan Giles, <a href="https://www.youtube.com/shorts/Q2peQG4dNR4">The NOGI Berimbolo</a> (BJJ Fanatics)</figcaption>
</figure>

This is a berimbolo.

Did you catch that? Watch it again. One second he's on his back under someone standing over him, the next he's upside down, and then somehow he's sitting on the guy's back. Blink and you miss it.

It took me three months to learn this. And I still remember the first time I saw one, because I wasn't even watching the back take. I was watching the legs. Four legs folding into each other, hooking, crossing, threading through.

There's a whole part of the game built around this. Leg entanglements - ashi garami, 50/50, saddle, all the positions where your legs and your partner's legs turn into one big knot. Most people on the mats just call it leg spaghetti.

I've been trying to teach a computer to see it.

<hr>

Honestly, I'm still figuring out how to say what I'm working on in one line. The closest I've got is visual intelligence for human movement - machines that can watch people move and actually understand it. [Kakashi](/work/kakashi) watches your rolls. [My paper](/research/faithful-movement) was about getting vision-language models to describe movement faithfully. And the further I go, the more everything keeps coming back to one stupidly simple question.

Whose limb is that?

Before a coach, a physio or a robot can tell you anything about how you moved, it needs to know which arm is yours and which leg is mine. Get that wrong and everything built on top of it is wrong too. I've watched the big models describe a scramble beautifully and still hand the trapped arm to the wrong person (that was [whose arm is it?](/research/whose-arm-is-it)). So this time I went down a level, to pixels.

The plan was an auto-labeller. Something that draws a mask over each athlete on every frame, so I can train models on top of it later. Standing up, it works. Most ground positions, it works. Then the legs get involved.

<figure>
<img src="/images/blog/leg-spaghetti/tracker-swap.jpg" alt="Two athletes in a leg entanglement, and the tracker's masks, which give the leg pointing up to the wrong person" width="760" height="338">
<figcaption>That leg pointing at the ceiling? My tracker says it's <span class="ath-red">red</span>'s. It's <span class="ath-blue">blue</span>'s.</figcaption>
</figure>

In a leg entanglement, one person's foot is usually sitting right between the other person's legs. Bare foot, bare shin, same skin. So if you ask "which body is this foot closest to?", you get the wrong answer every time, because the foot is surrounded by the wrong person. It's inside one body and belongs to the other.

On the hardest frames my tracker got about 72% of points right. On feet and knees, 55%. Basically a coin flip.

<hr>

My first thought was that the machine needs to understand how bodies are built. So I tried that, twice.

First, 3D bodies. I fit a 3D human to each athlete with [SAM 3D Body](https://github.com/facebookresearch/sam-3d-body), rendered both, and let whichever one was in front own the pixel. It was the best fully automatic thing I tried, 77% against 72%. But it got there by filling gaps, not by fixing who owns what. It actually swapped more limbs than before. And every now and then it put a leg in front of a torso it was clearly behind.

Second, body parts. Meta has a model called [Sapiens](https://github.com/facebookresearch/sapiens) that labels every pixel of a person - thigh, shin, foot. If it knows a foot is a foot, and which shin it's attached to, ownership should just fall out. It found nobody. No feet, no shins, no people. For a while I thought jiu-jitsu footage was just weird for it.

Turns out it has a size limit. On Meta's own demo photo it works beautifully. Shrink that same photo until the person is 512 pixels tall and it sees almost nothing. My athletes are 150 to 400 pixels tall.

<figure>
<svg class="chart" viewBox="0 0 640 250" role="img" aria-label="Share of pixels Sapiens labels as human: 53.9% at 1024 px person height, 0.1% at 512 px, 0% at 300 px and 200 px">
<line x1="56" x2="630" y1="220" y2="220" class="grid"/><text x="48" y="224" text-anchor="end" class="axis-label">0%</text>
<line x1="56" x2="630" y1="156" y2="156" class="grid"/><text x="48" y="160" text-anchor="end" class="axis-label">20%</text>
<line x1="56" x2="630" y1="92" y2="92" class="grid"/><text x="48" y="96" text-anchor="end" class="axis-label">40%</text>
<line x1="56" x2="630" y1="28" y2="28" class="grid"/><text x="48" y="32" text-anchor="end" class="axis-label">60%</text>
<rect x="322" y="28" width="248" height="192" class="band"/>
<text x="446" y="50" text-anchor="middle" class="axis-label">my athletes: ~150-400 px</text>
<rect x="76" y="47.5" width="90" height="172.5" class="right"/>
<text x="121" y="41" text-anchor="middle">53.9%</text>
<text x="121" y="238" text-anchor="middle" class="axis-label">1024 px</text>
<rect x="206" y="219.7" width="90" height="0.3" class="right"/>
<text x="251" y="213" text-anchor="middle">0.1%</text>
<text x="251" y="238" text-anchor="middle" class="axis-label">512 px</text>
<text x="381" y="213" text-anchor="middle">0%</text>
<text x="381" y="238" text-anchor="middle" class="axis-label">300 px</text>
<text x="511" y="213" text-anchor="middle">0%</text>
<text x="511" y="238" text-anchor="middle" class="axis-label">200 px</text>
</svg>
<figcaption>Sapiens on Meta's own demo photo, shrunk down. My athletes live in the shaded bit.</figcaption>
</figure>

Right idea, wrong tools. At least at this resolution.

<hr>

So I started dotting.

My review pages show two versions of a mask side by side, and I pick the better one. That tells me which one's better, but not where either one is wrong. So I added dots. A <span class="ath-red">red</span> dot means "this pixel is red's", a <span class="ath-blue">blue</span> dot means it's blue's. Sometimes I'm pointing at a mistake. Sometimes I'm just tracing a leg through the knot so the truth is written down somewhere. By the end of the day I'd placed 545 of them.

<figure>
<img src="/images/blog/leg-spaghetti/dots.jpg" alt="Red and blue dots on a tangle, shown on the raw frame and on two versions of the masks" width="1140" height="366">
<figcaption>Same dots, two versions of the masks. The second one fixes the leg but loses <span class="ath-red">red</span>'s other one.</figcaption>
</figure>

The dots ended up doing two jobs.

The first was keeping score. I can check any version of the masks against them, even ones I build later. And that's where the first surprise came from. The mistakes were there before tracking even started. On the frames the tracker starts from, it got 66% of my dots right, and it matched the raw per-frame masks on every single one. The tracker wasn't making mistakes, it was faithfully carrying them forward. Two models agreeing just meant they were wrong the same way.

The second was fixing things. A dot is exactly the kind of hint [SAM](https://github.com/facebookresearch/sam3) is built to take - here's a mask, here are a few clicks, fix it. So every dotted frame gets redrawn, and the tracker carries the fix to the frames around it.

Except it didn't. I hid one corrected frame at a time to see if the fixes around it would reach it, and they didn't, not even from 1.5 seconds away. Every second or so the tracker restarted from its old automatic starting points, and those brought all the mistakes straight back. Once I cleared those out for a few seconds around each correction, it worked. The hidden frames went from 74% to 82%.

Then I reviewed it blind. 21 to 0.

<figure>
<img src="/images/blog/leg-spaghetti/corrected.jpg" alt="Three tangles, each shown raw, with the old masks and with the corrected masks" width="1140" height="837">
<figcaption>Not a single dot on any of these. The fixes came from frames up to 3.6 seconds away.</figcaption>
</figure>

My note from that review, word for word:

> A is near perfect! I'm astounded, this is insane!

All of that from two or three dotted frames per clip.

Now, I do want to be honest about what this is, because it took me a minute to get it straight myself. Nothing learned anything. No model was trained, no weights changed. It's the same trick as clicking on something in SAM's video demo and watching it follow along. Which also means it doesn't carry over. A clip I haven't dotted still gets the old, wrong masks. Getting the machine to do this on its own is a whole different problem, and I haven't cracked it.

<hr>

The corrections did something I didn't expect, too. They mostly stopped giving limbs to the wrong person, but a lot of the time they didn't give them to anyone. On dots no method had ever seen, swaps dropped from 88 to 33, and holes went up from 43 to 74.

I'm honestly fine with that. A hole can be marked "not sure" later. A swap teaches the next model the wrong thing.

So who gets the hole? I tried two ways.

**By outline:** give the pixel to whoever's body it sits inside. Right 40% of the time, worse than a coin flip. Which makes sense if you think about it - a trapped foot sits inside the other person's outline. Same problem as before.

**By bones:** draw each athlete's skeleton (hip to knee to ankle) as thick lines, and give the pixel to whoever's bone runs through it. Right 62% of the time.

<figure>
<img src="/images/blog/leg-spaghetti/fill-by-bones.jpg" alt="A trapped leg in grey leggings, left unowned, then filled by outline (wrong) and by bones (right)" width="1320" height="455">
<figcaption>The leg in grey leggings is <span class="ath-blue">blue</span>'s. Outline gives it to <span class="ath-red">red</span>. Bones give it back.</figcaption>
</figure>

<figure>
<svg class="chart" viewBox="0 0 640 215" role="img" aria-label="101 held-out dots. Baseline: 24 right, 53 swapped, 24 nobody's. Pose-guided SAM: 46 right, 55 swapped. Corrections: 40 right, 17 swapped, 44 nobody's. Corrections plus fill by outline: 60 right, 41 swapped. Corrections plus fill by bones: 65 right, 30 swapped, 6 nobody's.">
<text x="180" y="21" text-anchor="end">baseline</text>
<rect x="190" y="8" width="102.2" height="20" class="right"/><text x="241.1" y="23" text-anchor="middle" class="in-bar">24</text>
<rect x="292.2" y="8" width="225.6" height="20" class="swap"/><text x="405" y="23" text-anchor="middle" class="in-bar">53</text>
<rect x="517.8" y="8" width="102.2" height="20" class="hole"/><text x="568.9" y="23" text-anchor="middle" class="in-bar">24</text>
<text x="180" y="51" text-anchor="end">pose-guided SAM</text>
<rect x="190" y="38" width="195.8" height="20" class="right"/><text x="287.9" y="53" text-anchor="middle" class="in-bar">46</text>
<rect x="385.8" y="38" width="234.2" height="20" class="swap"/><text x="502.9" y="53" text-anchor="middle" class="in-bar">55</text>
<text x="180" y="81" text-anchor="end">corrections</text>
<rect x="190" y="68" width="170.3" height="20" class="right"/><text x="275.1" y="83" text-anchor="middle" class="in-bar">40</text>
<rect x="360.3" y="68" width="72.4" height="20" class="swap"/><text x="396.5" y="83" text-anchor="middle" class="in-bar">17</text>
<rect x="432.7" y="68" width="187.3" height="20" class="hole"/><text x="526.3" y="83" text-anchor="middle" class="in-bar">44</text>
<text x="180" y="111" text-anchor="end">+ fill by outline</text>
<rect x="190" y="98" width="255.4" height="20" class="right"/><text x="317.7" y="113" text-anchor="middle" class="in-bar">60</text>
<rect x="445.4" y="98" width="174.6" height="20" class="swap"/><text x="532.7" y="113" text-anchor="middle" class="in-bar">41</text>
<text x="180" y="141" text-anchor="end">+ fill by bones</text>
<rect x="190" y="128" width="276.7" height="20" class="right"/><text x="328.4" y="143" text-anchor="middle" class="in-bar">65</text>
<rect x="466.7" y="128" width="127.7" height="20" class="swap"/><text x="530.6" y="143" text-anchor="middle" class="in-bar">30</text>
<rect x="594.5" y="128" width="25.5" height="20" class="hole"/>
<line x1="190" x2="620" y1="158" y2="158" class="grid"/>
<text x="190" y="175" text-anchor="middle" class="axis-label">0</text>
<text x="275.1" y="175" text-anchor="middle" class="axis-label">20</text>
<text x="360.3" y="175" text-anchor="middle" class="axis-label">40</text>
<text x="445.4" y="175" text-anchor="middle" class="axis-label">60</text>
<text x="530.6" y="175" text-anchor="middle" class="axis-label">80</text>
<text x="615.7" y="175" text-anchor="middle" class="axis-label">100</text>
<text x="620" y="200" text-anchor="end" class="axis-label">dots (n = 101)</text>
</svg>
<div class="legend"><span style="--swatch: var(--olive)">right</span><span style="--swatch: var(--accent)">swapped</span><span style="--swatch: var(--muted-foreground)">nobody's</span></div>
<figcaption>101 dots none of these methods ever saw.</figcaption>
</figure>

Which is pretty much what I'd been saying the whole time, just with a number on it now. A foot belongs to whoever's leg leads to it.

<hr>

But 62% isn't 90%. This isn't done, not even close.

The skeletons are guessed from the masks, so a bad mask bends the skeleton. The skeleton model stops at the ankle - no feet at all, so I faked them. When your shin crosses my foot, two bones claim the same pixel, and only depth can settle that. Every clip still needs me to sit there and dot it. And the really tangled stuff, the actual spaghetti, still comes out with holes in it, or worse.

When I dot a trapped foot myself, I think I'm using three things. What it looks like, what it's attached to, and where it was a second ago. Skin kills the first one. Bones are a rough version of the second. Nothing in the system uses the third yet, and I'm pretty sure that's the one I lean on most when I'm scrubbing back and forth through a roll.

So here's what I want to try next:

- **Bodies that fit together.** Two people can't be in the same place at the same time. A 3D fit that knows that should stop putting legs through torsos.
- **Better 3D.** The 3D bodies were my best automatic result, just for the wrong reasons. When two bones fight over the same pixel, depth is the tiebreaker, so I think they deserve a second shot.
- **Human primitives.** Break the body into simple parts - thigh, shin, foot - and work out how they connect, instead of treating each person as one big blob.
- **Real foot points.** A skeleton that actually has feet, not the ones I made up.
- **Track limbs, not just people.** A foot moves with its own shin, not with the leg it's stuck under. Follow pixels through time, not just shapes.
- **Let it be unsure.** If it doesn't know whose foot that is, it should say so and wait. Then when the knot comes apart a few seconds later and it's obvious, go back and fill in the frames it skipped. That's literally what I do when I rewind.
- **Learn from the dots.** Fine-tune on everything I've dotted so far, so the next clip starts out better than this one did.

Three months to learn the berimbolo. Probably longer to teach machines to see it.

<details>
<summary>The numbers, for the curious</summary>

- **Setup:** 11 leg-entanglement clips, about 21 s each, 720p. 545 dots on 62 frames. Where my notes in a blind review disagree with the key I pressed, the notes win.
- **Before corrections, on 362 dots:** 72% right. Feet 55%, knees 55%, hips 70%, hands 78%. On the tracker's own starting frames: 66%, identical dot for dot to the raw per-frame masks.
- **3D bodies:** 77% right, with 69 swaps against the tracker's 54. Pose-guided masks ([BBoxMaskPose](https://github.com/MiraPurkrabek/BBoxMaskPose)): 59-63%, and they lost a blind review 6-0. Sapiens: no change, because it found no people.
- **Hidden-frame test:** with the old starting points left in, 73% → 73% (22 frames). With them cleared for ±3.6 s, 74% → 82% (8 frames, 1.5-3 s from a correction).
- **Blind reviews:** frames right next to a correction, 12-5 for the corrected version (1 the same). Frames where the two differ most, 21-0.
- **Filling holes:** by outline, 37 of 92 right (40%). By bones, 44 of 71 (62%).
- **Sapiens on its own demo photo:** 54% of pixels human at full size, 0.1% when the person is 512 px tall, 0% at 300 px.

</details>

<details>
<summary>Papers, for those who can read</summary>

- **[SAM 2: Segment Anything in Images and Videos](https://arxiv.org/abs/2408.00714)** (2024) - where the click-on-it-and-it-follows video tracking comes from.
- **[SAM 3: Segment Anything with Concepts](https://arxiv.org/abs/2511.16719)** (2025) - I used 3.1 for the masks and the dot fixes. [Code](https://github.com/facebookresearch/sam3).
- **[SAM 3D Body: Robust Full-Body Human Mesh Recovery](https://arxiv.org/abs/2602.15989)** (2026) - the 3D bodies. [Code](https://github.com/facebookresearch/sam-3d-body).
- **[Sapiens: Foundation for Human Vision Models](https://arxiv.org/abs/2408.12569)** (2024) - the one that found nobody. [Code](https://github.com/facebookresearch/sapiens).
- **[Detection, Pose Estimation and Segmentation for Multiple Bodies: Closing the Virtuous Circle](https://arxiv.org/abs/2412.01562)** (ICCV 2025) - BBoxMaskPose. The pose-guided masks, and the outlines behind "by outline". [Code](https://github.com/MiraPurkrabek/BBoxMaskPose).
- **[Harmony4D: A Video Dataset for In-The-Wild Close Human Interactions](https://arxiv.org/abs/2410.20294)** (NeurIPS 2024) - wrestling, MMA and dancing, people in close contact. I used it for earlier benchmarks. [Project](https://jyuntins.github.io/harmony4d/).

And a few terms, if you need them:

- **Mask:** which pixels in a frame belong to which person. Red's, blue's, or nobody's.
- **Swap / hole:** a swap is a pixel given to the wrong person. A hole is a pixel given to nobody.
- **Tracking:** draw masks on a few frames and let the model carry them through the rest of the clip.
- **Skeleton / pose:** points on each joint (hip, knee, ankle) joined up with lines.
- **Blind review:** two versions side by side in random order, and I pick the better one without knowing which is which.

</details>
