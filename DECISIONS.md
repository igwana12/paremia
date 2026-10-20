# Paremia Decisions

## 2026-10-16: Project Uplift
- **Decision:** Create local-only repo at ~/gsd-workspaces/paremia (no GitHub yet)
- **Rationale:** Project Uplift requires provenance + validator before any public push
- **Corpus source:** ~/gsd-workspaces/niko-portfolio-fixbuild/site-next/public/mvp/paremia/proverbs.json
- **Source commits:** b71f128 (corpus 10x), dc140bf (67 concept plates)
- **License:** CC BY-SA 4.0
- **Validator:** stdlib-only, assert-based self-checks for 683/67/29

## 2026-10-16: Website Lab Card
- **Decision:** Branch fix/paremia-counts off fix/ncoded-build-20261016
- **Change:** Update Lab card from "65 proverbs, 13 clusters" to "683 proverbs, 67 clusters"
- **Constraint:** PR only, no main push, no style-v2 push

## Registry Fix Needed
- **Issue:** stage_evidence + ncoded_claim still say "65 proverbs, 13 clusters"
- **Action:** Flag on the card for the lead; do NOT edit projects.yaml
