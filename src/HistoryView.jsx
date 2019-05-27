import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';

import { UserResolver } from './resolver';
import { withUserResolver } from './contexts';
import * as util from './util';

class HistoryView extends React.Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    const { channelName, date } = nextProps.match.params;
    if (!prevState
      || prevState.channelName !== channelName
      || prevState.date !== date) {
      return {
        channelName,
        date,
        message: `Loading ${HistoryView.generateJsonPath(channelName, date)}...`,
      };
    }
    return null;
  }

  static generateJsonPath(channelName, date) {
    return `slack_export/${channelName}/${date}.json`;
  }

  componentDidMount() {
    this.fetchHistory();
  }

  componentDidUpdate(prevProps, prevState) {
    const { channelName, date } = this.state;
    if (channelName !== prevState.channelName || date !== prevState.date) {
      this.fetchHistory();
    }
  }

  fetchHistory() {
    const { channelName, date } = this.state;
    window.fetch(`slack_export/${channelName}/${date}.json`)
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
    const { data, message } = this.state;
    const { userResolver } = this.props;
    const nodes = (data || []).map((m) => {
      const user = userResolver.find(m.user);
      const renderers = {
        root: p => (
          <div>
            <span className="header">
              {datetimeFormatter(new Date(m.ts * 1000))}
              {user ? (
                <React.Fragment>
                  {' '}
                  <img src={user.profile.image_24} alt="*" width="12" height="12" />
                  {user.name}
                </React.Fragment>
              ) : null}
              {m.bot_id ? (
                <React.Fragment>
                  {' '}
                  (BOT)
                  {m.bot_id}
                </React.Fragment>
              ) : null}
            </span>
            {p.children}
          </div>
        ),
      };
      return (<li key={m.ts}><ReactMarkdown source={userResolver.replaceAll(m.text)} renderers={renderers} /></li>);
    });
    return (
      <React.Fragment>
        <div>{message}</div>
        <ul id="history">{nodes}</ul>
      </React.Fragment>
    );
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
  userResolver: PropTypes.instanceOf(UserResolver).isRequired,
};

export default withUserResolver(HistoryView);
