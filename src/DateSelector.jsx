import React from 'react';
import DatePicker from 'material-ui/DatePicker';
import CalendarHeatmap from 'react-calendar-heatmap';
import moment from 'moment-timezone';

import * as util from './util.js';

export default class DateSelector extends React.Component {
  constructor(props) {
    super();

    this.propsToState(props);

    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleHeatmapClick = this.handleHeatmapClick.bind(this);
    this.classForValue = this.classForValue.bind(this);
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
      const maxComments = data.counts.reduce((prevValue, currentValue) =>
        ((prevValue > currentValue.count) ? prevValue : currentValue.count)
      , 0);
      this.setState({ channel, minDate: this.dateStringToDate(minDate), maxDate: this.dateStringToDate(maxDate), date, counts: data.counts, maxComments });
    });
  }
  dateStringToDate(str) {
    if (!str) return null;
    const date = moment(str);
    return date.toDate();
  }
  handleHeatmapClick(value) {
    if (!value) return;
    this.context.router.push(`/channel/${this.state.channel.name}/date/${value.date}`);
  }
  handleDateChange(n, date) {
    this.context.router.push(`/channel/${this.state.channel.name}/date/${moment(date).format('YYYY-MM-DD')}`);
  }
  classForValue(value) {
    if (!value || value.count === 0) {
      return 'velocity-0';
    } else if (value.count < this.state.maxComments / 8) {
      return 'velocity-1';
    } else if (value.count < this.state.maxComments / 4) {
      return 'velocity-2';
    } else if (value.count < this.state.maxComments / 2) {
      return 'velocity-3';
    }
    return 'velocity-4';
  }
  render() {
    if (!this.state || !this.state.channel) {
      return <div>Loading {this.props.params.channelName} channel info.</div>;
    }
    let numDays = (this.state.maxDate - this.state.minDate) / (24 * 60 * 60 * 1000);
    numDays = Math.max(numDays, 366);
    return (<div>
      <p>{this.state.channel.name} channel ({moment(this.state.minDate).format('YYYY-MM-DD')} - {moment(this.state.maxDate).format('YYYY-MM-DD')})</p>
      <div className="react-calendar-heatmap">
        <CalendarHeatmap
          endDate={this.state.maxDate}
          numDays={numDays}
          values={this.state.counts}
          onClick={this.handleHeatmapClick}
          classForValue={this.classForValue}
        />
      </div>
      <DatePicker
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
