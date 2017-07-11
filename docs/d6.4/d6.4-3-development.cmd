

pandoc --filter pandoc-citeproc -f markdown -t docx --data-dir=. https://raw.githubusercontent.com/reTHINK-project/hackathons/master/2017-internal/hyperty-survey-results/hyperty-survey-results.md -o D6.4-31-hyperty-development.docx

pandoc --filter pandoc-citeproc -f markdown -t docx --data-dir=. https://raw.githubusercontent.com/reTHINK-project/hackathons/master/2017-internal/dev-app-survey-results/app-survey-results.md -o D6.4-32-app-development.docx
