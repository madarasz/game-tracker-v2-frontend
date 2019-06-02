module.exports = {
    "preset": "jest-puppeteer",
    "reporters": [
        "default",
        [
            "./node_modules/jest-html-reporter",
            {
                "pageTitle": "Test Report",
                "outputPath": "./tests/e2e/reports/index.html",
                "includeFailureMsg": false,
                "includeConsoleLog": false,
                "theme": "defaultTheme"
            }
        ]
    ],
    "testResultsProcessor": "./node_modules/jest-html-reporter",
    "moduleFileExtensions": [
        "js",
        "jsx",
        "json",
        "vue"
    ],
    "transform": {
        "^.+\\.vue$": "vue-jest",
        ".+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$": "jest-transform-stub",
        "^.+\\.jsx?$": "babel-jest"
    },
    "transformIgnorePatterns": [
        "/node_modules/"
    ],
    "moduleNameMapper": {
        "^@/(.*)$": "<rootDir>/src/$1"
    },
    "snapshotSerializers": [
        "jest-serializer-vue"
    ],
    "testMatch": [
        "**/tests/e2e/steps/*.steps.(js|jsx|ts|tsx)"
    ],
    "testURL": "http://localhost:8080/",
    "watchPlugins": [
        "jest-watch-typeahead/filename",
        "jest-watch-typeahead/testname"
    ]
}