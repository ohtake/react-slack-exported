import * as util from './util';

class ResolverBase {
  constructor() {
    this.array = [];
    this.map = new Map();
  }
  find(key) {
    return this.map.get(key);
  }
  fetch() {
    return window.fetch(this.filename)
    .then(util.checkStatus)
    .then(util.parseJSON)
    .then((data) => {
      this.array = data;
      this.map.clear();
      data.forEach((item) => {
        this.map.set(this.keySelector(item), item);
      });
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
