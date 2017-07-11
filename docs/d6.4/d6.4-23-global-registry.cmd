
pushd C:\Projectos\reTHINK\WP4\git\dev-registry-global\docs


pandoc --filter pandoc-citeproc -f markdown -t docx --data-dir=. evaluation.md -o C:\Projectos\reTHINK\WP6\git\testbeds\docs\d6.4\D6.4-23-global-registry.docx

pushd C:\Projectos\reTHINK\WP6\git\testbeds\docs\d6.4
