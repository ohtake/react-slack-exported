import * as util from './util.js';

export class ChannelResolver {
    constructor() {
        this.channels = [];
        this.channelMap = {};
    }
    find(channelName) {
        return this.channelMap[channelName];
    }
    listChannels() {
        return this.channels;
    }
    fetchChannels(callback) {
        window.fetch("slack_export/channels.json")
        .then(util.checkStatus)
        .then(util.parseJSON)
        .then(data => {
            this.channels = data;
            this.userMap = {};
            for(let i=0; i<data.length; i++) {
                let channel = data[i];
                this.channelMap[channel.name] = channel;
            }
        }).then(()=> {
            callback();
        }).catch(err => {
            console.error(err);
        });
    }
}

export class UserResolver {
    constructor() {
        this.users = [];
        this.userMap = {};
    }
    find(userId) {
        return this.userMap[userId];
    }
    replaceAll(message) {
        let userRegex = /<@U[0-9A-Z]{8}(\|[-_.A-Za-z0-9]+)?>/;
        let callback = match => {
            return "@" + this.find(match.substring(2,11)).name;
        };
        return message.replace(userRegex, callback);
    }
    fetchUsers(callback) {
        window.fetch("slack_export/users.json")
        .then(util.checkStatus)
        .then(util.parseJSON)
        .then(data => {
            this.users = data;
            this.userMap = {};
            for(let i=0; i<data.length; i++) {
                let user = data[i];
                this.userMap[user.id] = user;
            }
        }).then(()=> {
            callback();
        }).catch(err => {
            console.error(err);
        });
    }
}

