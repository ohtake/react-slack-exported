import React from 'react';
import DatePicker from 'material-ui/DatePicker';
import moment from 'moment-timezone';
import * as util from './util.js';

export default class DateSelector extends React.Component {
  constructor(props) {
    super();

    this.propsToState(props);

    this.handleDateChange = this.handleDateChange.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    this.propsToState(nextProps);
  }
  propsToState(props) {
    const channel = props.route.channelResolver.find(props.params.channelName);
    const date = this.dateStringToDate(props.params.date);
    window.fetch(`assets/channel_summary/${channel.name}.json`)
    .then(util.checkStatus)
    .then(util.parseJSON)
    .then(data => {
      const minDate = data.counts.reduce((prevValue, currentValue) =>
        ((prevValue && prevValue < currentValue.date) ? prevValue : currentValue.date)
      , null);
      const maxDate = data.counts.reduce((prevValue, currentValue) =>
        ((prevValue && prevValue > currentValue.date) ? prevValue : currentValue.date)
      , null);
      this.setState({ channel, minDate: this.dateStringToDate(minDate), maxDate: this.dateStringToDate(maxDate), date });
    });
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
    if (! this.state || ! this.state.channel) {
      return <div>Loading {this.props.params.channelName} channel info.</div>;
    }
    return (<div>
      <p>{this.state.channel.name} channel ({moment(this.state.minDate).format('YYYY-MM-DD')} - {moment(this.state.maxDate).format('YYYY-MM-DD')})</p>
      <DatePicker
        ref="input"
        floatingLabelText="PST/PDT date"
        minDate={this.state.minDate}
        maxDate={this.state.maxDate}
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
