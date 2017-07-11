
pushd C:\Projectos\reTHINK\WP3\git\dev-runtime-core\docs\evaluation


pandoc --filter pandoc-citeproc -f markdown -t docx --data-dir=. readme.md -o C:\Projectos\reTHINK\WP6\git\testbeds\docs\d6.4\D6.4-22-runtime.docx

pushd C:\Projectos\reTHINK\WP6\git\testbeds\docs\d6.4
