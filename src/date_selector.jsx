import React from 'react';
import moment from 'moment-timezone';
import * as util from './util.js';

export default class DateSelector extends React.Component {
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
DateSelector.propTypes = util.propTypesRoute;
DateSelector.contextTypes = {
  router: React.PropTypes.object,
};
