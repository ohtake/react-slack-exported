import * as util from './util.js';

class ResolverBase {
  constructor() {
    this.array = [];
    this.map = {};
  }
  find(key) {
    return this.map[key];
  }
  fetch() {
    return window.fetch(this.filename)
    .then(util.checkStatus)
    .then(util.parseJSON)
    .then(data => {
      this.array = data;
      this.map = {};
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        this.map[this.keySelector(item)] = item;
      }
    });
  }
}

export class ChannelResolver extends ResolverBase {
  constructor() {
    super();
    this.filename = 'slack_export/channels.json';
    this.keySelector = item => item.name;
  }
  listChannels() {
    return this.array;
  }
}

export class UserResolver extends ResolverBase {
  constructor() {
    super();
    this.filename = 'slack_export/users.json';
    this.keySelector = item => item.id;
  }
  replaceAll(message) {
    const userRegex = /<@U[0-9A-Z]{8}(\|[-_.A-Za-z0-9]+)?>/;
    const callback = match => `@${this.find(match.substring(2, 11)).name}`;
    return message.replace(userRegex, callback);
  }
}
