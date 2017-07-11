

pandoc --filter pandoc-citeproc -f markdown -t docx --data-dir=. https://raw.githubusercontent.com/reTHINK-project/specs/master/tests/idm/readme.md -o D6.4-42-idm.docx

pandoc --filter pandoc-citeproc -f markdown -t docx --data-dir=. https://raw.githubusercontent.com/reTHINK-project/dev-runtime-core/develop/docs/evaluation/identity-module/IdMEvaluation.md -o D6.4-421-idm-evaluation.docx

pandoc --filter pandoc-citeproc -f markdown -t docx --data-dir=. https://raw.githubusercontent.com/reTHINK-project/specs/master/tests/idm/future-work.md -o D6.4-422-idm-future-work.docx
