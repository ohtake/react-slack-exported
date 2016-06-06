import React from 'react';
import DatePicker from 'material-ui/DatePicker';
import moment from 'moment-timezone';
import * as util from './util.js';

export default class DateSelector extends React.Component {
  constructor(props) {
    super();

    this.state = this.propsToState(props);

    this.handleDateChange = this.handleDateChange.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    this.setState(this.propsToState(nextProps));
  }
  propsToState(props) {
    const channel = props.route.channelResolver.find(props.params.channelName);
    const date = this.dateStringToDate(props.params.date);
    return { channel, date };
  }
  dateStringToDate(str) {
    if (! str) return null;
    const date = moment(str);
    return date.toDate();
  }
  handleDateChange(n, date) {
    this.context.router.push(`/channel/${this.state.channel.name}/date/${moment(date).format('YYYY-MM-DD')}`);
  }
  render() {
    const created = new Date(this.state.channel.created * 1000);
    const now = new Date();
    const toSlackDate = date => {
      const m = moment(date).tz('America/Los_Angeles');
      return new Date(m.year(), m.month(), m.date());
    };
    return (<div>
      <p>{this.state.channel.name} channel</p>
      <DatePicker
        ref="input"
        floatingLabelText="PST/PDT date"
        minDate={toSlackDate(created)}
        maxDate={toSlackDate(now)}
        onChange={this.handleDateChange}
        value={this.state.date}
      />
      {this.props.children}
    </div>);
  }
}
DateSelector.propTypes = util.propTypesRoute;
DateSelector.contextTypes = {
  router: React.PropTypes.object,
};
