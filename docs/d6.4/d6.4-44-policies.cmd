
pandoc --filter pandoc-citeproc -f markdown -t docx --data-dir=. https://raw.githubusercontent.com/reTHINK-project/dev-runtime-core/develop/docs/evaluation/policy-engine/README.md -o D6.4-441-polithink.docx

pandoc --filter pandoc-citeproc -f markdown -t docx --data-dir=. https://raw.githubusercontent.com/reTHINK-project/specs/master/tests/policy/jacpol.md -o D6.4-442-jacpol.docx

pandoc --filter pandoc-citeproc -f markdown -t docx --data-dir=. https://raw.githubusercontent.com/reTHINK-project/specs/master/tests/policy/comparison.md -o D6.4-443-comparison.docx

pandoc --filter pandoc-citeproc -f markdown -t docx --data-dir=. https://raw.githubusercontent.com/reTHINK-project/specs/master/tests/policy/references.md -o D6.4-44-references.docx
