reportname=$(date +%Y.%m.%d-%H.%M.%S)
reportpath='tests/e2e/reports/'
jsonpath="$reportpath$reportname.json"
./node_modules/.bin/cucumber-js ./tests/e2e/features/ --format "json:$jsonpath" "$@"
node ./tests/e2e/html-reporter.js $reportname