# react-slack-exported

[![Build Status](https://travis-ci.org/ohtake/react-slack-exported.svg?branch=master)](https://travis-ci.org/ohtake/react-slack-exported)

[![Dependency Status](https://david-dm.org/ohtake/react-slack-exported.svg)](https://david-dm.org/ohtake/react-slack-exported) [![devDependency Status](https://david-dm.org/ohtake/react-slack-exported/dev-status.svg)](https://david-dm.org/ohtake/react-slack-exported#info=devDependencies) [![peerDependency Status](https://david-dm.org/ohtake/react-slack-exported/peer-status.svg)](https://david-dm.org/ohtake/react-slack-exported#info=peerDependencies)

You can view [exported Slack history json](https://get.slack.help/hc/en-us/articles/201658943-Exporting-your-team-s-Slack-history) with React.

I have tested this application with [export option for Free plan](https://get.slack.help/hc/en-us/articles/204897248), never tested with other options.

## Export

1. [Export Slack history](https://my.slack.com/services/export) and wait its completion.
1. Download and extract the zip file into `slack_export` directory.

## Develop

Install [Node.js and npm](https://nodejs.org/en/download/). Execute `npm install` to install dependencies.

Run `npm start`. Now you can visit http://localhost:8080/ to view the application.

I recommend [Visual Studio Code](https://code.visualstudio.com/) and [ESLint extention](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) to edit source code.

## Publish

```bash
git checkout -B gh-pages
npm run-script build
git add -f build.js slack_export
git commit -m "Build"
git push origin gh-pages -f
git checkout -
```
