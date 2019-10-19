# Template

## Requirements

- Node 10.15.3+
- Yarn or npm
- Sentry `https://sentry.io`
- Mongo database, I recommend `https://www.mongodb.com/cloud/atlas`
- Firebase Authentication `https://firebase.google.com/`

## Setting environment variables

In the /config folder there is a configuration file `config.js` which has the default values to configure the project.

`HOST`: default http://localhost
`PORT`: default :9000
`corsOrigins`: HTTP access control default http://localhost:9000
`sentry`: You need to inform the Sentry Node SDK about your DSN
`mongodb`: database URL from MongoDB
`postgres`: postgres database connection

**Observation:** you don't need the schemes if you use a mongo as database repository and you can delete all the schemas folders.

## How to Set up

**Step 1:** Install the Application's dependencies
Please use yarn instead of npm for this process.
with `yarn` or `npm i`.

### How to Run DEV

    with `yarn dev` or `npm run dev`.

## How to modify console.log colors

Reset = "\x1b[0m"
Bright = "\x1b[1m"
Dim = "\x1b[2m"
Underscore = "\x1b[4m"
Blink = "\x1b[5m"
Reverse = "\x1b[7m"
Hidden = "\x1b[8m"

FgBlack = "\x1b[30m"
FgRed = "\x1b[31m"
FgGreen = "\x1b[32m"
FgYellow = "\x1b[33m"
FgBlue = "\x1b[34m"
FgMagenta = "\x1b[35m"
FgCyan = "\x1b[36m"
FgWhite = "\x1b[37m"

BgBlack = "\x1b[40m"
BgRed = "\x1b[41m"
BgGreen = "\x1b[42m"
BgYellow = "\x1b[43m"
BgBlue = "\x1b[44m"
BgMagenta = "\x1b[45m"
BgCyan = "\x1b[46m"
BgWhite = "\x1b[47m"
