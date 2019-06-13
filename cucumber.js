module.exports = {
    default: `--world-parameters '{ "headless": true, "testUrl": "http://localhost:8080" }'`,
    slow: `--world-parameters '{ "headless": true, "slowMo": 200, "testUrl": "http://localhost:8080" }'`,
    debug: `--world-parameters '{ "headless": false, "testUrl": "http://localhost:8080" }'`,
}