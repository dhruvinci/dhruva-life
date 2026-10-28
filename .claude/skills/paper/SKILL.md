---
name: paper
description: Write, revise or package a research paper or arXiv preprint with Dhruva, in his voice (sole-author, independent researcher). Use for his preprints (engage3D, labelling, VLM probing, layered engagement, the agenda paper), for turning a research thread into a paper, or for arXiv packaging.
---

You're writing a paper with Dhruva, not for him. He brings the research, the judgement and the stance; the numbers come from his repos and notes. You bring structure, literature, LaTeX and restraint. A paper that reads like an AI wrote it, or claims one number more than the evidence supports, hurts him more than no paper.

## Load the context first, every time

1. `../essay/voice.md` and `../essay/story.md` - who he is on the page. Papers use the **research register** (below), but it's the same person.
2. `register.md` (this folder) - how his papers are written: the playbook learned from twelve DeepMind and OpenAI papers, his voice inside it, and the AI tells to cut.
3. `~/.claude/essay-private/context.md` - private context. Never quote it in a paper.
4. The paper's plan in `~/Documents/Code/preprints/PLAN.md` (thesis, outline, sources, open questions, decisions).
5. The sources it names: the public research repos cloned in `~/Documents/Code/preprints/sources/<repo>` (README, FINDINGS, each experiment's PREREG/RESULTS), and the private notes in `dhruva-life/.notes/` (research briefs, inventory, rules). If a repo may have moved on, `git pull` it first.
6. His own words on the topic: `.notes/career-dossier.md`, the essays in `content/blog/` closest to it, and MemPalace (`mcp__mempalace__mempalace_search`) for his lines. Only what he wrote counts as his voice.

## How a paper gets made

1. **Plan before prose.** Agree the title, the one-sentence claim, the contribution list and the section outline with him in `PLAN.md`. His title wins.
2. **Every number has an address.** Before a number goes in, find it in a RESULTS/FINDINGS file or note and keep the path in a comment next to it in the `.tex` (`% src: engage3d/experiments/E06.../RESULTS.md`). No source, no number - ask him or the research agent. Check what metric each number is (IoU, F1, %, cm) and read the repo's audit notes: a result an audit voided stays out even if a README still prints it. Limb-entanglement's pre-fix Qwen vision IoUs (0/27, 0.665 → 0.066) are void; only the qualitative findings held. Raw logs beat READMEs; when Dhruva doubts a count, ask the Researcher session.
3. **Measured vs defined vs proposed.** Say which each quantity is. Never let a definition or an idea read like a result.
4. **No disclosures; results stated flatly** (see `register.md`). Describe what was done and measured, specifically. Never write about the author, reviewer identity or count, data availability, model access, or what wasn't run. Limits appear only as narrow next steps, the way the lab papers write them.
5. **Related work is real and verified.** Search for it, read the abstract, check the venue and year, and put a working link or DOI in the `.bib`. Never cite from memory. Position his work honestly against the closest work, including where others are ahead.
6. **Draft section by section to the playbook in `register.md`:** question → answer → key findings up front → Figure 1 with a concrete example → experiments framed as questions → claim captions. Then do the voice pass, a numbers pass against the sources, and the self-check below. Then build the PDF.
7. **Show him, iterate.** Say outside the draft what you weren't sure of. When he edits a paragraph, fix typos only. His lines verbatim.
8. **Readability review** (see "Reading playbook" below). Fix only where the reader lost the story.
9. **Package for arXiv only when he says.** See "Build and package" below.

## Hard lines

- **Data rules (binding):** never name the technique-clip source app or link it, anywhere (text, figures, metadata). Research datasets are private (on the site: "available on request"; in papers, no availability statement at all) except the MoveBench v0 seed, which is public in the moveharness repo. No numbers measured only on private Kakashi footage beyond what the CAISc paper already reports; nothing about individual uploads. No MAMMA media (cite only). Respect licences: Harmony4D (MIT, cite), ViCoS (CC BY-NC-SA 4.0). Nothing about Physova.
- **No invented facts, numbers, citations, dates or collaborators.** A gap is a question.
- **No priority claims** he can't back ("first", "only") - say what he did and when, and let readers judge.
- **No AI-involvement statement and no acknowledgements** in the preprints (his decision, 2026-10-28: AI-assisted research is the norm now). The CAISc paper keeps its own as accepted.
- **Sole author:** "Dhruva Chakravarthi, Independent Researcher, Bangalore, India" + 0xdhruva@gmail.com, unless he says otherwise.
- **Short and to the point.** No page target; the main text is usually 6-12 pages and carries the argument and the key figures. Supporting detail goes to appendices.
- **Figures that carry the work:** a pipeline/concept diagram, the key results as charts, and qualitative examples where licences allow (Harmony4D yes, with credit; no MAMMA media; nothing from private footage). Draw diagrams in TikZ or generate charts from the source numbers (matplotlib to PDF), never from memory.
- **A real literature review** in every paper: a related-work section that positions the work against the closest prior art, with modern citation density (typically 30-60 verified references for a research paper, fewer for a short one). Cite generously and accurately; every entry verified (title, authors, venue, year, arXiv id or DOI).
- **Readability review before he sees it:** see "Reading playbook".

## Reading playbook (how to review)

Learned by giving the same lay-reader brief to twelve DeepMind and OpenAI papers (2026-10-28). The reader passed every one of them: it followed the story and lost only the method details. That is the bar for his papers too.

**The brief:** a fresh agent with the PDF only. Use these words:

> You are a curious reader with no science background: think of a student, someone who trains jiu-jitsu, or a parent who reads the news. Someone has handed you a research paper and asked what you got out of it. Read [path] (Read tool, pages "1-N"). Don't open other files or edit anything. Skim technical parts if you like; you're not expected to follow every detail. Answer in your own plain words: 1. What were they trying to do, and why? 2. What did they build or try? 3. What did they find? 4. Did you get lost so badly anywhere that you couldn't follow the main story? Where? 5. What helped you follow it (a figure, a table, an example, a sentence that restated the point)? Under 250 words.

**Pass:** answers 1-3 are broadly right. Missing the depth, or getting lost in the method, equations or appendix, is fine; the lab papers read that way too.

**Act on:**
- the main story was lost;
- a headline number with no plain meaning, or no sign of whether high or low is good;
- a term in the abstract or intro used before it is explained;
- a figure the reader couldn't decode;
- a word that reads two ways ("right fighter" read as the fighter on the right).

**Don't act on:** anything else. Never brief the reader to judge the evidence, look for unsupported claims or ask for caveats. That brief produced a pile of hedges once and was dropped (his decision).

**Self-check before the review** (you, against `register.md`): the question stated by paragraph 2-3; bold findings up front; Figure 1 by page 2 with a concrete example; claim captions; every metric defined in words with its direction; one or two numbers per paragraph, each against a baseline; no disclosures; active "we".

## Build and package

- Template: `~/Documents/Code/preprints/_template/` (`preprint.sty`, a NeurIPS-style layout, `[preprint]` footer). Copy it to `~/Documents/Code/preprints/<nn>-<slug>/`.
- References: generate `.bib` entries from the arXiv API with a script (see `06-machine-in-a-mans-world/make_bib.py`, `03-modern-labelling/verify_refs.py`), never by hand. Take a venue only from the arXiv comment or journal-ref field or the publisher; otherwise cite the arXiv preprint.
- Figures from repo assets: crop title strips (they can carry sequence IDs) and move the values into the caption. A repo's experiment-verdict table makes a good appendix table. Render every chart and offset coincident points.
- Shell: in zsh, `echo ====` fails (`=` expansion); use `printf`. Don't name a TikZ style `x`, which clashes with TikZ's built-in key.
- Build with `tectonic --keep-intermediates paper.tex` (no pdflatex/bibtex installed). It writes the `.bbl` that arXiv needs.
- **Numbered citations** (his choice, 2026-10-28): `\PassOptionsToPackage{numbers,sort&compress}{natbib}` before `\usepackage[preprint]{preprint}`, and `\bibliographystyle{unsrtnat}`. Cite with `\citep{}`; this gives [2, 5, 17] or [9–11], numbered in order of first appearance. The template already has both.
- arXiv upload: `paper.tex`, the `.sty`, the `.bbl`, and only the figures used. Check the PDF page count and that every figure renders. Primary category cs.CV; cross-list cs.RO for engagement/robotics papers. arXiv versions are permanent, so read the final PDF in full before he uploads.
