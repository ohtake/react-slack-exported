import React from 'react';
import ReactDOM from 'react-dom';
import ReactMarkdown from 'react-markdown';
import $ from 'jquery';

class UserResolver {
    constructor() {
        this.users = [];
        this.userMap = {};
    }
    find(userId) {
        return this.userMap[userId];
    }
    replaceAll(message) {
        let userRegex = /<@U[0-9A-Z]{8}>/;
        let callback = match => {
            return "@" + this.find(match.substring(2,11)).name;
        }
        return message.replace(userRegex, callback);
    }
    fetchUsers() {
        $.getJSON("slack_export/users.json")
        .done(data => {
            this.users = data;
            this.userMap = {};
            for(let i=0; i<data.length; i++) {
                let user = data[i];
                this.userMap[user.id] = user;
            }
        })
        .fail(err => {
            console.error(err.status + " " + err.statusText);
        });
    }
}

class Channels extends React.Component {
    constructor() {
        super();
    }
    componentDidMount() {
        this.setState({
            message: "loading",
            data: []
        });
        this.fetchData();
    }
    fetchData() {
        $.getJSON("slack_export/channels.json")
        .done(data => {
            this.setState({
                message: "",
                data: data
            });
        })
        .fail(err => {
            this.setState({
                message: err.status + " " + err.statusText,
                data: []
            });
        });
    }
    handleChannelSelect(e) {
        e.preventDefault();
        let channel = this.state.data[$(e.target).data("index")];
        this.setState({activeChannel: channel.name})
        ReactDOM.render(React.createElement(DateSelector, channel), document.getElementById('date'));
    }
    render() {
        if(! this.state) return <div>?? no state</div>;
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
        let toDateString = date => { return date.getFullYear() + "-" + pad2(date.getMonth()+1) + "-" + pad2(date.getDate()); };
        return (<div>
            <input key={this.props.name} type="date" onChange={this.handleDateChange.bind(this)} min={toDateString(created)} max={toDateString(now)} />
        </div>);
    }
}

class HistoryView extends React.Component {
    constructor() {
        super();
    }
    componentDidMount() {
        this.setState({
            message: "loading",
            data: []
        });
        this.fetchHistory(this.props);
    }
    componentWillReceiveProps(nextProps) {
        this.fetchHistory(nextProps);
    }
    fetchHistory(props) {
        $.getJSON("slack_export/" + props.channel.name + "/" + props.date + ".json")
        .done(data => {
            this.setState({
                message: "",
                data: data
            });
        })
        .fail(err => {
            this.setState({
                message: err.status + " " + err.statusText,
                data: []
            });
        });
    }
    render() {
        if(! this.state) return <div>?? no state</div>;
        if(this.state.message) {
            return (<div>{this.state.message}</div>);
        } else {
            let datetimeFormatter = dt => {
                return dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
            };
            let nodes = this.state.data.map((m,i) => {
                let header = <span className="header">{datetimeFormatter(new Date(m.ts*1000))} {userResolver.find(m.user).name}</span>;
                return (<li key={m.ts}><ReactMarkdown source={userResolver.replaceAll(m.text)} softBreak="br" childBefore={header} /></li>);
            })
            return (<ul>{nodes}</ul>);
        }
    }
}

var userResolver = new UserResolver();
userResolver.fetchUsers();
ReactDOM.render(<Channels />, document.getElementById('channels'));
