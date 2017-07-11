
pushd C:\Projectos\reTHINK\WP3\git\specs\tests\idm

pandoc --filter pandoc-citeproc -f markdown -t docx --data-dir=. readme.md -o C:\Projectos\reTHINK\WP6\git\testbeds\docs\d6.4\D6.4-42-idm.docx

pandoc --filter pandoc-citeproc -f markdown -t docx --data-dir=. IdMEvaluation.md -o C:\Projectos\reTHINK\WP6\git\testbeds\docs\d6.4\D6.4-421-idm-evaluation.docx

pandoc --filter pandoc-citeproc -f markdown -t docx --data-dir=. future-work.md -o C:\Projectos\reTHINK\WP6\git\testbeds\docs\d6.4\D6.4-422-idm-future-work.docx

pushd C:\Projectos\reTHINK\WP6\git\testbeds\docs\d6.4
