import React from 'react';
import ReactDOM from 'react-dom';
import * as RR from 'react-router';
import ReactMarkdown from 'react-markdown';
import Moment from 'moment-timezone';
import Promise from 'es6-promise'; // For older browsers http://caniuse.com/#feat=promises
import fetch from 'whatwg-fetch';

function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    } else {
        let error = new Error(response.statusText);
        error.response = response;
        throw error;
    }
}
function parseJSON(response) {
    return response.json();
}

class ChannelResolver {
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
        .then(checkStatus)
        .then(parseJSON)
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

class UserResolver {
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
    fetchUsers() {
        window.fetch("slack_export/users.json")
        .then(checkStatus)
        .then(parseJSON)
        .then(data => {
            this.users = data;
            this.userMap = {};
            for(let i=0; i<data.length; i++) {
                let user = data[i];
                this.userMap[user.id] = user;
            }
        })
        .catch(err => {
            console.error(err);
        });
    }
}

class Channels extends React.Component {
    constructor() {
        super();
    }
    render() {
        let nodes = channelResolver.listChannels().map(c => {
            return (<li key={c.id}><RR.Link to={`/channel/${c.name}`} activeClassName="active">#{c.name}</RR.Link></li>);
        });
        return <div><h2>Channels</h2><ul id="channels">{nodes}</ul>{this.props.children}</div>;
    }
}

class DateSelector extends React.Component {
    constructor() {
        super();
    }
    componentWillReceiveProps(nextProps) {
        this.refs.input.value = nextProps.params.date;
    }
    handleDateChange(e) {
        let channel = channelResolver.find(this.props.params.channelName);
        this.context.router.push(`/channel/${channel.name}/date/${e.target.value}`);
    }
    render() {
        let channel = channelResolver.find(this.props.params.channelName);
        let created = new Date(channel.created*1000);
        let now = new Date();
        let toSlackDateString = date => {
            let moment = Moment(date);
            return moment.tz("America/Los_Angeles").format("YYYY-MM-DD");
        };
        return (<div>
            <h2>Date</h2>
            <p>Pick a PST/PDT date (If your browser does not recognize type=date, please input a date in YYYY-MM-DD format)</p>
            <input ref="input" type="date" onChange={this.handleDateChange.bind(this)} min={toSlackDateString(created)} max={toSlackDateString(now)} defaultValue={this.props.params.date} />
            {this.props.children}
        </div>);
    }
}
DateSelector.contextTypes = {
    router: React.PropTypes.object,
};

class HistoryView extends React.Component {
    constructor() {
        super();
        this.initialState = {
            message: "Loading...",
            data: [],
        };
        this.state = this.initialState;
    }
    componentDidMount() {
        this.fetchHistory(this.props);
    }
    componentWillReceiveProps(nextProps) {
        this.fetchHistory(nextProps);
    }
    fetchHistory(props) {
        window.fetch("slack_export/" + props.params.channelName + "/" + props.params.date + ".json")
        .then(checkStatus)
        .then(parseJSON)
        .then(data => {
            this.setState({
                message: "",
                data: data
            });
        })
        .catch(err => {
            this.setState({
                message: err.toString(),
                data: []
            });
        });
    }
    render() {
        let datetimeFormatter = dt => {
            return dt.toLocaleString();
        };
        let nodes = this.state.data.map(m => {
            let user = userResolver.find(m.user);
            let header = <span className="header">{datetimeFormatter(new Date(m.ts*1000))} <img src={user.profile.image_24} width="12" height="12"/>{user.name}</span>;
            return (<li key={m.ts}><ReactMarkdown source={userResolver.replaceAll(m.text)} softBreak="br" childBefore={header} /></li>);
        });
        return (<div><h2>History</h2><div>{this.state.message}</div><ul id="history">{nodes}</ul></div>);
    }
}

var channelResolver = new ChannelResolver();
channelResolver.fetchChannels(() => {
    ReactDOM.render((
      <RR.Router history={RR.hashHistory}>
        <RR.Route path="/" component={Channels}>
          <RR.Route path="channel/:channelName" component={DateSelector}>
            <RR.Route path="date/:date" component={HistoryView}/>
          </RR.Route>
        </RR.Route>
      </RR.Router>
    ), document.getElementById('app'));
});
var userResolver = new UserResolver();
userResolver.fetchUsers();
