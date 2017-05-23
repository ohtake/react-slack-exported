import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';

import { ChannelResolver, UserResolver } from './resolver';

import * as util from './util';

export default class HistoryView extends React.Component {
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
    window.fetch(`slack_export/${props.match.params.channelName}/${props.match.params.date}.json`)
    .then(util.checkStatus)
    .then(util.parseJSON)
    .then((data) => {
      this.setState({
        message: '',
        data,
      });
    })
    .catch((err) => {
      this.setState({
        message: err.toString(),
        data: [],
      });
    });
  }
  render() {
    const datetimeFormatter = dt => dt.toLocaleString();
    const nodes = this.state.data.map((m) => {
      const user = this.context.userResolver.find(m.user);
      const header = (<span className="header">
        {datetimeFormatter(new Date(m.ts * 1000))}
        {user ? <span> <img src={user.profile.image_24} alt="*" width="12" height="12" />{user.name}</span> : null}
        {m.bot_id ? <span> (BOT) {m.bot_id}</span> : null}
      </span>);
      return (<li key={m.ts}><ReactMarkdown source={this.context.userResolver.replaceAll(m.text)} softBreak="br" childBefore={header} /></li>);
    });
    return (<div><div>{this.state.message}</div><ul id="history">{nodes}</ul></div>);
  }
}
HistoryView.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  match: PropTypes.shape({
    params: PropTypes.shape({
      channelName: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};
HistoryView.contextTypes = {
  channelResolver: PropTypes.instanceOf(ChannelResolver).isRequired,
  userResolver: PropTypes.instanceOf(UserResolver).isRequired,
};
