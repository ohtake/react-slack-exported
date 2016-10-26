# react-slack-exported

[![Build Status](https://travis-ci.org/ohtake/react-slack-exported.svg?branch=master)](https://travis-ci.org/ohtake/react-slack-exported)
[![Code Climate](https://codeclimate.com/github/ohtake/react-slack-exported/badges/gpa.svg)](https://codeclimate.com/github/ohtake/react-slack-exported)
[![Dependency Status](https://www.versioneye.com/user/projects/5785effb6edb08003d1085e2/badge.svg)](https://www.versioneye.com/user/projects/5785effb6edb08003d1085e2)

You can view [exported Slack history json](https://get.slack.help/hc/en-us/articles/201658943-Exporting-your-team-s-Slack-history) with React.

I have tested this application with [export option for Free plan](https://get.slack.help/hc/en-us/articles/204897248), never tested with other options.

## Export

1. [Export Slack history](https://my.slack.com/services/export) and wait its completion.
1. Download and extract the zip file into `slack_export` directory.

## Develop

Install [Node 6 and npm](https://nodejs.org/en/download/). Execute `npm install` to install dependencies.

Run `npm run-script build:summary` to create intermediate data.

Run `npm start`. Now you can visit `http://localhost:8080/` to view the application.

I recommend [Visual Studio Code](https://code.visualstudio.com/) and [ESLint extention](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) to edit source code.

## Publish

```bash
git checkout -B gh-pages
npm run-script build
git add -f assets slack_export
git commit -m "Build"
git push origin gh-pages -f
git checkout -
```
