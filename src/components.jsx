import React from 'react';
import * as RR from 'react-router';
import ReactMarkdown from 'react-markdown';
import Moment from 'moment-timezone';
import * as util from './util.js';

const propTypesRoute = {
    children: React.PropTypes.object,
    route: React.PropTypes.object,
    params: React.PropTypes.object,
};

export class Channels extends React.Component {
    constructor() {
        super();
    }
    render() {
        let nodes = this.props.route.channelResolver.listChannels().map(c => {
            return (<li key={c.id}><RR.Link to={`/channel/${c.name}`} activeClassName="active">#{c.name}</RR.Link></li>);
        });
        return <div><h2>Channels</h2><ul id="channels">{nodes}</ul>{this.props.children}</div>;
    }
}
Channels.propTypes = propTypesRoute;

export class DateSelector extends React.Component {
    constructor() {
        super();
    }
    componentWillReceiveProps(nextProps) {
        this.refs.input.value = nextProps.params.date;
    }
    handleDateChange(e) {
        let channel = this.props.route.channelResolver.find(this.props.params.channelName);
        this.context.router.push(`/channel/${channel.name}/date/${e.target.value}`);
    }
    render() {
        let channel = this.props.route.channelResolver.find(this.props.params.channelName);
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
DateSelector.propTypes = propTypesRoute;
DateSelector.contextTypes = {
    router: React.PropTypes.object,
};

export class HistoryView extends React.Component {
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
        .then(util.checkStatus)
        .then(util.parseJSON)
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
            let user = this.props.route.userResolver.find(m.user);
            let header = <span className="header">{datetimeFormatter(new Date(m.ts*1000))} <img src={user.profile.image_24} width="12" height="12"/>{user.name}</span>;
            return (<li key={m.ts}><ReactMarkdown source={this.props.route.userResolver.replaceAll(m.text)} softBreak="br" childBefore={header} /></li>);
        });
        return (<div><h2>History</h2><div>{this.state.message}</div><ul id="history">{nodes}</ul></div>);
    }
}
HistoryView.propTypes = propTypesRoute;
