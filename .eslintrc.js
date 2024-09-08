module.exports = {
    "extends": "airbnb",
    "plugins": [
        "react"
    ],
    "rules": {
        "react/jsx-filename-extension": [2, { extensions: ['.js','.jsx'] }],
        "func-names": [0],
        "new-cap": [2, { newIsCap: true ,capIsNew: true, capIsNewExceptions: ['List', 'Map']}],
        "linebreak-style": [0],
        "quotes": [0]
    },
    "env": {
        "browser": true,
        "es6": true
    }
};