import React from 'react';
import ReactMarkdown from 'react-markdown';
import * as util from './util.js';

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
    return (<div><div>{this.state.message}</div><ul id="history">{nodes}</ul></div>);
  }
}
HistoryView.propTypes = util.propTypesRoute;
