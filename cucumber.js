module.exports = {
    default: `--parallel 2 --world-parameters '{ "headless": true, "testUrl": "http://localhost:8080" }'`,
    debug: `--world-parameters '{ "headless": false, "testUrl": "http://localhost:8080" }'`,
}