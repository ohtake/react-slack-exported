// Read 'slack_export/{channel_name}/*.json' and
// emit number of messages for each day to 'assets/channel_summary/{channel_name}.json'.

import fs from 'fs';
import util from 'util';
import path from 'path';

const accessP = util.promisify(fs.access);
const mkdirP = util.promisify(fs.mkdir);
const readFileP = util.promisify(fs.readFile);
const readdirP = util.promisify(fs.readdir);
const statP = util.promisify(fs.stat);
const writeFileP = util.promisify(fs.writeFile);

async function listChannels() {
  const filenames = await readdirP('slack_export');
  const directories = await Promise.all(filenames.map(async (f) => {
    const stat = await statP(path.join('slack_export', f));
    return stat.isDirectory() ? f : null;
  }));
  return directories.filter(d => d !== null);
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

async function readDayInfo(dir, file) {
  const data = await readFileP(path.join(dir, file));
  const messages = JSON.parse(data);
  const date = path.basename(file, '.json');
  return new DayInfo(date, messages.length);
}

async function readChannelSummary(channelName) {
  const dir = path.join('slack_export', channelName);
  const files = await readdirP(dir);
  const days = await Promise.all(files.map(f => readDayInfo(dir, f)));
  return new ChannelSummary(path.basename(dir), days);
}

async function mkdir(dir) {
  try {
    await accessP(dir, fs.F_OK);
    // nop
  } catch (ex) {
    await mkdirP(dir);
  }
}

async function prepareOutputDirectory() {
  await mkdir('assets');
  await mkdir(path.join('assets', 'channel_summary'));
}

async function writeChannelSummary(summary) {
  const filename = path.join('assets', 'channel_summary', `${summary.channelName}.json`);
  const data = JSON.stringify(summary);
  await writeFileP(filename, data);
}

async function main() {
  const channelNames = await listChannels();
  const summaries = await Promise.all(channelNames.map(n => readChannelSummary(n)));
  await prepareOutputDirectory();
  await Promise.all(summaries.map(s => writeChannelSummary(s)));
}

main();
