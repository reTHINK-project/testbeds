
pushd C:\Projectos\reTHINK\WP7 Dissemination\git\hackathons\2017-internal\hyperty-survey-results

pandoc --filter pandoc-citeproc -f markdown -t docx --data-dir=. hyperty-survey-results.md -o C:\Projectos\reTHINK\WP6\git\testbeds\docs\d6.4\D6.4-31-hyperty-development.docx

pushd ..\dev-app-survey-results

pandoc --filter pandoc-citeproc -f markdown -t docx --data-dir=. app-survey-results.md -o C:\Projectos\reTHINK\WP6\git\testbeds\docs\d6.4\D6.4-32-app-development.docx

pushd C:\Projectos\reTHINK\WP6\git\testbeds\docs\d6.4
