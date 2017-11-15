# react-slack-exported

[![Build Status](https://travis-ci.org/ohtake/react-slack-exported.svg?branch=master)](https://travis-ci.org/ohtake/react-slack-exported)
[![Maintainability](https://api.codeclimate.com/v1/badges/8407db0613919952d1ce/maintainability)](https://codeclimate.com/github/ohtake/react-slack-exported/maintainability)
[![dependencies Status](https://david-dm.org/ohtake/react-slack-exported/status.svg)](https://david-dm.org/ohtake/react-slack-exported)
[![devDependencies Status](https://david-dm.org/ohtake/react-slack-exported/dev-status.svg)](https://david-dm.org/ohtake/react-slack-exported?type=dev)

You can view [exported Slack history json](https://get.slack.help/hc/en-us/articles/201658943-Exporting-your-team-s-Slack-history) with React.

I have tested this application with [export option for Free plan](https://get.slack.help/hc/en-us/articles/204897248), never tested with other options.

## Export

1. [Export Slack history](https://my.slack.com/services/export) and wait its completion.
1. Download and extract the zip file into `slack_export` directory.

## Develop

Install [Node 6](https://nodejs.org/en/download/) and [yarn](https://yarnpkg.com/en/docs/install). Execute `yarn install` to install dependencies.

Run `yarn run-script build:summary` to create intermediate data.

Run `yarn start`. Now you can visit `http://localhost:8080/` to view the application.

## Publish

```bash
git checkout -B gh-pages
yarn run build
git add -f assets slack_export
git commit -m "Build"
git push origin gh-pages -f
git checkout -
```
