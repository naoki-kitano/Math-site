# MathCanvas implementation gates

Read MATHCANVAS_QA.md before modifying this site. These requirements implement the user's repeated instructions, not optional styling suggestions.

- Teach genuinely recurring fundamentals: identify the object, choose an operation and explain why, show working, check conditions, then practice independently. Do not add contrived parameters or case splits.
- Keep student-facing prose about mathematics and necessary controls. Do not display design rationales, module-production labels, or marketing explanations of the teaching system.
- Preserve the established MathCanvas navy/teal/mincho theme. Compare against the original mathIII differentiation reference before a redesign; do not replace it with a generic starter.
- Every formula, including inline variables and options, goes through MathText/Formula (KaTeX). No Unicode-as-typesetting, normal-text formulas, broad math font overrides, or manual whitespace fixes. Check real bundled fonts and visual layout, not only HTML output.
- Keep mathematical conditions (original denominator, domain, signs, all solutions) explicit. Numerical spot checks do not prove identities.
- Write or explicitly validate hints per question, including preparation questions. Do not automatically inherit a skill-family hint as a finished hint. Verify the actual task (substitution, limit, proof, condition), one-sided/domain-end cases, and every assigned supplement. Include theorem hypotheses in supplements as well as main text.
- Use concise, accurate page titles that name the mathematical content or decision; avoid repetitive instructional sentences or decorative metaphors that obscure the topic.
- Never classify hints, revealed answers, or abandoned previews as independent success. Retain them for review. Do not attribute a review variant twice. Preserve records on import errors and limit failures; never silently truncate.
- Before handoff: run tests, lint, types, and build. Preserve the verified shared math/UI components. For this chapter-content expansion the user will check simple controls; do not repeat the previous comprehensive PC/mobile interaction audit or assign it to Astra. Record the actual checked scope and remaining limitations.
- The user requires final independent mathematical/content/pedagogical review by gpt-6-astra, replacing gpt-5.6-sol. Fix findings and obtain a recheck. Simple UI/control checks are now performed by the user, not delegated to Astra. Run normal automated regression checks; do not repeat exhaustive browser QA for unchanged controls. Do not claim a review occurred without its actual result.
- Sites lifecycle belongs to the main site-owning agent. Reviewers are read-only. Publish only the validated source and preserve existing private access unless the user approves changing it.
- Latest user instruction: minimize agent use without lowering quality. Main handles writing, implementation, and normal checks. Use one Astra independent chapter reviewer at a time; do not restart parallel author/reviewer batches. Existing draft files are retained and are not approvals.
