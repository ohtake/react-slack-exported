# react-slack-exported

You can view [exported Slack history json](https://get.slack.help/hc/en-us/articles/201658943-Exporting-your-team-s-Slack-history) with React.

I have tested this application with [export option for Free plan](https://get.slack.help/hc/en-us/articles/204897248), never tested with other options.

## Export

1. [Export Slack history](https://my.slack.com/services/export) and wait its completion.
1. Download and extract the zip file into `slack_export` directory.

## Develop

Install [Node.js and npm](https://nodejs.org/en/download/). Execute `npm install` to install dependencies.

Open two terminals, and run `npm run-script watch` and `npm start` individually. Now you can visit http://localhost:8080/ to view the application.
