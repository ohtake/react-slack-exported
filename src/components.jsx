import React from 'react';
import { Link } from 'react-router';
import ReactMarkdown from 'react-markdown';
import moment from 'moment-timezone';
import * as util from './util.js';

const propTypesRoute = {
  children: React.PropTypes.object,
  route: React.PropTypes.object,
  params: React.PropTypes.object,
};

export const Channels = (props) => {
  let nodes = props.route.channelResolver.listChannels().map(c =>
    <li key={c.id}><Link to={`/channel/${c.name}`} activeClassName="active">#{c.name}</Link></li>
  );
  return <div><h2>Channels</h2><ul id="channels">{nodes}</ul>{props.children}</div>;
};
Channels.propTypes = propTypesRoute;

export class DateSelector extends React.Component {
  constructor() {
    super();
    this.handleDateChange = this.handleDateChange.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    this.refs.input.value = nextProps.params.date;
  }
  handleDateChange(e) {
    const channel = this.props.route.channelResolver.find(this.props.params.channelName);
    this.context.router.push(`/channel/${channel.name}/date/${e.target.value}`);
  }
  render() {
    const channel = this.props.route.channelResolver.find(this.props.params.channelName);
    const created = new Date(channel.created * 1000);
    const now = new Date();
    const toSlackDateString = date => {
      const m = moment(date);
      return m.tz('America/Los_Angeles').format('YYYY-MM-DD');
    };
    return (<div>
      <h2>Date</h2>
      <p>Pick a PST/PDT date (If your browser does not recognize type=date, please input a date in YYYY-MM-DD format)</p>
      <input ref="input" type="date" onChange={this.handleDateChange} min={toSlackDateString(created)} max={toSlackDateString(now)} defaultValue={this.props.params.date} />
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
      message: 'Loading...',
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
    window.fetch(`slack_export/${props.params.channelName}/${props.params.date}.json`)
    .then(util.checkStatus)
    .then(util.parseJSON)
    .then(data => {
      this.setState({
        message: '',
        data,
      });
    })
    .catch(err => {
      this.setState({
        message: err.toString(),
        data: [],
      });
    });
  }
  render() {
    const datetimeFormatter = dt => dt.toLocaleString();
    let nodes = this.state.data.map(m => {
      const user = this.props.route.userResolver.find(m.user);
      let header = <span className="header">{datetimeFormatter(new Date(m.ts * 1000))} <img src={user.profile.image_24} alt="*" width="12" height="12" />{user.name}</span>;
      return (<li key={m.ts}><ReactMarkdown source={this.props.route.userResolver.replaceAll(m.text)} softBreak="br" childBefore={header} /></li>);
    });
    return (<div><h2>History</h2><div>{this.state.message}</div><ul id="history">{nodes}</ul></div>);
  }
}
HistoryView.propTypes = propTypesRoute;
