# How his papers are written

Dhruva's preprints follow the best AI-lab papers. Twelve were studied on 2026-10-28; their writing and their readability for a lay reader were analysed by agents. OpenAI: Whisper, CLIP, InstructGPT, Let's Verify Step by Step, Weak-to-Strong Generalization, Scaling Laws. DeepMind: Chinchilla, Flamingo, RT-2, TAPIR, Sparrow, Perception Test. arXiv ids: 2212.04356, 2103.00020, 2203.02155, 2305.20050, 2312.09390, 2001.08361, 2203.15556, 2204.14198, 2307.15818, 2306.08637, 2209.14375, 2305.13786.

Where the lab papers and his earlier rules differ, he decided to follow the lab papers (2026-10-28). His own voice still shows in his phrases, his concrete examples and his honesty.

## Voice

- **Active "we" throughout**, as in all twelve. Never "I". Passive only for routine procedure.
- **Tense:** present for what results show ("we find", "X outperforms Y"), past for one-off things done ("we downloaded", "we trained").
- **Sentences of 15-25 words.** One claim per paragraph.
- **Results are stated flatly.** Light, specific hedges belong only on explanations ("we attribute this to", "likely because", "suggesting"). "Significantly" only with a statistic.
- **Nothing personal, no disclosures.** Nothing about the author, who reviewed, how many reviewers, data availability or model access, and no "not measured / not claimed" lines. The labs describe the *task*, not the people (Let's Verify defines its label scheme precisely and barely mentions its labellers).
- **Coin and name things.** Name the system once with its expansion ("AutoLabeller"). Introduce new terms in italics with a one-clause definition, then use them consistently.
- **His phrases, sparingly:** "the last mile", "naming isn't locating", "fluent is not faithful". At most one per section. No slogans.

## Shape

- **Abstract (6-10 sentences):** the gap or question → "We build / study X" → how, with one or two scale numbers → the headline result in words, with at most about three numbers, each against a baseline → one secondary result or contrast → what it means or what is released. Define any term in a relative clause. No background paragraph.
- **Introduction:**
  - the broad problem, then the specific failure, with a number or a concrete example;
  - the question or goal in one plain sentence by paragraph 2-3 (RT-2: "in this paper we ask: …");
  - the idea in plain words, pointing to Figure 1;
  - **key findings up front:** each a bold claim sentence, then 2-3 sentences with one rounded number, ending in a section pointer (Scaling Laws, InstructGPT, Weak-to-Strong);
  - optionally a one-line roadmap.
- **Figure 1 by page 2, before the method:** a concrete example a non-specialist can see working or failing (CLIP's puppy diagram, Let's Verify's one red step, RT-2's donkey question next to a robot command, Flamingo's examples). A method diagram comes second.
- **Related work:** short, one bold lead-in paragraph per neighbouring field, each ending with how this work differs. It can go after the method (Let's Verify, Scaling Laws).
- **Method:** a short terms paragraph or glossary for non-specialists, then the method in pipeline order. The detail goes to appendices.
- **Experiments framed as questions:** list the research questions, then use them, or the findings answering them, as subsection headings (RT-2). Headings can be claims ("Improving weak-to-strong generalization is tractable"), so the headings alone tell the story.
- **Results paragraphs:** intuition → "Figure X shows …" → "we find …" → one sentence on why, if needed. One or two rounded numbers per paragraph, always against a named baseline, with the direction of good ("higher is better"). Prefer ratios and rules of thumb ("about twice as often", "from about 25% to nearly 80%") over decimals. The full grid of numbers goes in a figure, a small table or an appendix.
- **Negative results:** stated flatly beside the wins, each with its cause or what it still tells us; collected in a short section when there are several. An appendix of "methods that did not work" is good practice.
- **Limits as next steps:** a few narrow ones, each paired with the direction it opens (RT-2: "an exciting direction for future work"; Flamingo: First/Second/Third, a third of a page). No boilerplate and no disclosures.
- **Human labels:** describe the task, the interface and the quality control in the main text (what the reviewer saw, what they marked, how agreement or quality was checked). Full instructions and examples go in an appendix.
- **Conclusion:** one short paragraph restating the answer in words, never a copy of the abstract.
- **Appendices** hold hyperparameters, per-experiment tables, prompts, dataset construction and extra figures. The main text keeps what a reader needs to believe the claims. Most main texts run 10-18 pages; his can be shorter.
- **No acknowledgements or AI-involvement sections** in the preprints.

## Layout (from the same papers; fixed in the template, 2026-10-28)

- **Numbered subsections, titled with their claims, hold plain paragraphs** (InstructGPT, Weak-to-Strong, RT-2). Bold run-in headings (`\paragraph{}`) go only where the labs use them: related work, a terms paragraph, appendix details, short lists of named items. A run-in heading on every paragraph makes the page look gappy and broken up.
- **Tight spacing.** `preprint.sty` keeps 5.5pt between paragraphs and only 0.6ex before a run-in heading.
- **No stranded headings.** `preprint.sty` moves a section heading to the next page unless 7 lines fit under it, and a subsection heading unless 5 fit. Single stranded lines at the top or bottom of a page are blocked.
- **One list style.** Use bullets for unordered sets, each item a bold lead-in phrase plus a sentence or two (InstructGPT, Scaling Laws, Weak-to-Strong). Use numbers only for a sequence or for items referred to by number later (RT-2's research questions). Findings, negative results and recommendations all use the same bulleted, bold-lead-in style. Bare lists with no lead-ins look like notes.
- **Few floats.** Never put a table that repeats the text. Aim for one or two floats per page, full width, at the top.
- **Look at every page before sending.** Render all pages to one montage (`pdftoppm` + PIL) and check for gaps, stranded headings, stacked floats and empty-looking appendix headings (pin appendix tables with `[H]`).

## Figures and captions

- **The caption opens with the claim** as a short bold title or full sentence ("Zero-shot CLIP is competitive with a fully supervised baseline"). Then how to read it (axes, colours, markers), then one line of takeaway if the title didn't say it.
- **Captions alone should carry the argument** (CLIP, Flamingo).
- **Put the takeaway on the plot itself** where it helps (Scaling Laws), and plain titles on panels.
- Avoid reversed axes, tiny text and many-panel log plots without a guide. They lost the lay reader in Sparrow, Let's Verify and Weak-to-Strong.
- **Qualitative grids** of real cases carry the "it works on messy data" argument; numbers back them up (TAPIR, RT-2).
- **A plain-English table** that maps each task to an everyday situation (Perception Test's Table 2) is the single most lay-friendly device found.

## What lost the lay reader in every paper (avoid)

- Metrics never defined in words (WER, BLEU, Average Jaccard, HOTA, mAP), or numbers with no sign of whether high or low is good.
- Acronym stacks and model-name walls (SFT/RM/PPO-ptx, PaLI-X/PaLM-E/VC-1).
- Equations and notation early in the paper (Scaling Laws p.4).
- Citation clusters.
- Related work placed before the reader knows the setup.

## What helped the lay reader in every paper (do)

- An early picture of one concrete example with an everyday sentence next to it.
- Bold findings near the start, in plain sentences.
- One plain line contrasting the old approaches ("TAP-Net is jittery, PIPs is slow").
- An analogy ("a 3rd-grade teacher supervising a 12th-grader").
- Restating the point in plain words at the start of each section.

## AI tells (cut on sight)

- Em dashes as clause glue (in LaTeX, `---`). The labs use some; his papers don't. Use commas, colons, parentheses or a new sentence. En dashes in ranges (`2--4`) are fine.
- Grand openings ("In recent years...", "has garnered significant attention", "plays a pivotal role", "paradigm shift").
- Inflated words: novel, groundbreaking, crucial, pivotal, robust (unless measured), leverage, delve, harness (as a verb), unlock, landscape, holistic, seamless, comprehensive, "a testament to".
- Neat triads he didn't say. Bold mini-headings everywhere, except deliberate claim lead-ins.
- Priority or completeness claims ("first", "only", "solves").
- Restating the previous paragraph as a takeaway.

## Domain

- **Jiu-jitsu is the test, not the topic.** Grappling is the hardest case of people in contact; the contribution is about people in contact generally.
- **Show range.** A paper whose topic isn't contact (paper 04, the VLM probe) uses no jiu-jitsu, no armbars and no third-party models he only tested (Laya Vision). Pick illustrative examples from a different domain (a baseball slide, a street, a room) so readers see he studies more than one thing (his call, 2026-10-28).
- Define each grappling term once, in plain words (guard, mount, underhook, inside position, base, frames).
- Use his concrete examples: "a trapped foot sits inside the other person's outline".
