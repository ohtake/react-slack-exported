// Read 'slack_export/{channel_name}/*.json' and
// emit number of messages for each day to 'assets/channel_summary/{channel_name}.json'.

/* eslint-disable no-console */

import fs from 'fs';
import path from 'path';

function listChannelsSync() {
  const filenames = fs.readdirSync('slack_export');
  return filenames.filter((f) => {
    const stat = fs.statSync(path.join('slack_export', f));
    return stat.isDirectory();
  });
}

class DayInfo {
  constructor(date, count) {
    this.date = date;
    this.count = count;
  }
}

class ChannelSummary {
  constructor(channelName, counts) {
    this.channelName = channelName;
    this.counts = counts;
  }
}

function readFiles(dir, files) {
  const promises = [];
  files.forEach((file) => {
    const promise = new Promise((onFulfilled, onRejected) => {
      fs.readFile(path.join(dir, file), (err, data) => {
        if (err) {
          onRejected(err);
          return;
        }
        const messages = JSON.parse(data);
        const date = path.basename(file, '.json');
        onFulfilled(new DayInfo(date, messages.length));
      });
    });
    promises.push(promise);
  });
  return promises;
}

function readChannels(channelNames) {
  const promises = [];
  channelNames.forEach((channelName) => {
    const dir = path.join('slack_export', channelName);
    promises.push(new Promise((onFulfilled, onRejected) => {
      fs.readdir(dir, (err, files) => {
        if (err) {
          onRejected(err);
          return;
        }
        const promises2 = readFiles(dir, files);
        Promise.all(promises2).then(
          (days) => {
            onFulfilled(new ChannelSummary(path.basename(dir), days));
          },
          (err2) => {
            onRejected(err2);
          },
        );
      });
    }));
  });
  return promises;
}

function mkdirSync(dir) {
  try {
    fs.accessSync(dir, fs.F_OK);
    // nop
  } catch (ex) {
    fs.mkdirSync(dir);
  }
}

function prepareOutputDirectorySync() {
  mkdirSync('assets');
  mkdirSync(path.join('assets', 'channel_summary'));
}

function writeSummaries(summaries) {
  const promises = [];
  summaries.forEach((summary) => {
    promises.push(new Promise((onFulfilled, onRejected) => {
      const filename = path.join('assets', 'channel_summary', `${summary.channelName}.json`);
      const data = JSON.stringify(summary);
      fs.writeFile(filename, data, (err) => {
        if (err) onRejected(err);
        else onFulfilled();
      });
    }));
  });
  return promises;
}

const channelNames = listChannelsSync();
const promisesRead = readChannels(channelNames);

Promise.all(promisesRead)
  .then((summaries) => {
    prepareOutputDirectorySync();
    const promisesWrite = writeSummaries(summaries);
    return Promise.all(promisesWrite);
  })
  .then(() => {
    console.log('done');
  })
  .catch((err) => {
    console.error(err);
  });
