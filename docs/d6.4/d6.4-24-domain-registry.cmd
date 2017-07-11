
pushd C:\Projectos\reTHINK\WP4\git\dev-registry-domain\docs\performance_evaluation


pandoc --filter pandoc-citeproc -f markdown -t docx --data-dir=. readme.md -o C:\Projectos\reTHINK\WP6\git\testbeds\docs\d6.4\D6.4-24-domain-registry.docx

pushd C:\Projectos\reTHINK\WP6\git\testbeds\docs\d6.4
