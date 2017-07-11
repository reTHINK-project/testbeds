
pushd C:\Projectos\reTHINK\WP3\git\specs\tests\policy

pandoc --filter pandoc-citeproc -f markdown -t docx --data-dir=. readme.md -o C:\Projectos\reTHINK\WP6\git\testbeds\docs\d6.4\D6.4-44-policies.docx

pandoc --filter pandoc-citeproc -f markdown -t docx --data-dir=. polithink.md -o C:\Projectos\reTHINK\WP6\git\testbeds\docs\d6.4\D6.4-441-polithink.docx

pandoc --filter pandoc-citeproc -f markdown -t docx --data-dir=. jacpol.md -o C:\Projectos\reTHINK\WP6\git\testbeds\docs\d6.4\D6.4-442-jacpol.docx

pandoc --filter pandoc-citeproc -f markdown -t docx --data-dir=. comparison.md -o C:\Projectos\reTHINK\WP6\git\testbeds\docs\d6.4\D6.4-443-comparison.docx

pandoc --filter pandoc-citeproc -f markdown -t docx --data-dir=. references.md -o C:\Projectos\reTHINK\WP6\git\testbeds\docs\d6.4\D6.4-44-references.docx

pushd C:\Projectos\reTHINK\WP6\git\testbeds\docs\d6.4
