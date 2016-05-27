import React from 'react';
import ReactDOM from 'react-dom';
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
        }
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
        this.state = {
            message: "loading",
            data: []
        };
    }
    componentDidMount() {
        this.fetchData();
    }
    fetchData() {
        window.fetch("slack_export/channels.json")
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
    handleChannelSelect(e) {
        e.preventDefault();
        let channel = this.state.data[e.target.getAttribute("data-index")];
        this.setState({activeChannel: channel.name})
        ReactDOM.render(React.createElement(DateSelector, channel), document.getElementById('date'));
        ReactDOM.render(React.createElement(HistoryView, {}), document.getElementById('history'));
    }
    render() {
        if(this.state.message) {
            return (<div>{this.state.message}</div>);
        } else {
            let nodes = this.state.data.map((c,i) => {
              return (<li key={c.id} className={(c.name == this.state.activeChannel) ? "active" : ""}><a onClick={this.handleChannelSelect.bind(this)} href="#" data-index={i}>#{c.name}</a></li>);
            })
            return (<ul>{nodes}</ul>);
        }
    }
};

class DateSelector extends React.Component {
    constructor() {
        super();
    }
    handleDateChange(e) {
        ReactDOM.render(React.createElement(HistoryView, {channel: this.props, date: e.target.value}), document.getElementById('history'));
    }
    render() {
        let created = new Date(this.props.created*1000);
        let now = new Date();
        let pad2 = n => { return ("0"+n).slice(-2); };
        let toSlackDateString = date => {
            let moment = Moment(date)
            return moment.tz("America/Los_Angeles").format("YYYY-MM-DD");
        };
        return (<div>
            <input key={this.props.name} type="date" onChange={this.handleDateChange.bind(this)} min={toSlackDateString(created)} max={toSlackDateString(now)} />
        </div>);
    }
}

class HistoryView extends React.Component {
    constructor() {
        super();
        this.initialState = {
            message: "Pick a PST/PDT date",
            data: []
        };
        this.state = this.initialState;
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.channel) {
            this.state = {
                message: "loading",
                data: []
            };
            this.fetchHistory(nextProps);
        } else {
            this.setState(this.initialState);
        }
    }
    fetchHistory(props) {
        window.fetch("slack_export/" + props.channel.name + "/" + props.date + ".json")
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
        if(this.state.message) {
            return (<div>{this.state.message}</div>);
        } else {
            let datetimeFormatter = dt => {
                return dt.toLocaleString();
            };
            let nodes = this.state.data.map((m,i) => {
                let user = userResolver.find(m.user);
                let header = <span className="header">{datetimeFormatter(new Date(m.ts*1000))} <img src={user.profile.image_24} width="12" height="12"/>{user.name}</span>;
                return (<li key={m.ts}><ReactMarkdown source={userResolver.replaceAll(m.text)} softBreak="br" childBefore={header} /></li>);
            })
            return (<ul>{nodes}</ul>);
        }
    }
}

var userResolver = new UserResolver();
userResolver.fetchUsers();
ReactDOM.render(<Channels />, document.getElementById('channels'));
