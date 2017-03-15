import React from 'react';
import HashRouter from 'react-router-dom/HashRouter';

import DatePicker from 'material-ui/DatePicker';
import CalendarHeatmap from 'react-calendar-heatmap';
import moment from 'moment-timezone';

import { ChannelResolver } from './resolver';
import * as util from './util';

export default class DateSelector extends React.Component {
  static dateStringToDate(str) {
    if (!str) return null;
    const date = moment(str);
    return date.toDate();
  }
  constructor(props, context) {
    super();

    this.propsToState(props, context);

    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleHeatmapClick = this.handleHeatmapClick.bind(this);
    this.classForValue = this.classForValue.bind(this);
  }
  componentWillReceiveProps(nextProps, nextContext) {
    this.propsToState(nextProps, nextContext);
  }
  propsToState(props, context) {
    const channel = context.channelResolver.find(props.match.params.channelName);
    const date = DateSelector.dateStringToDate(props.match.params.date);
    window.fetch(`assets/channel_summary/${channel.name}.json`)
    .then(util.checkStatus)
    .then(util.parseJSON)
    .then((data) => {
      const minDate = data.counts.reduce((prevValue, currentValue) =>
        ((prevValue && prevValue < currentValue.date) ? prevValue : currentValue.date)
      , null);
      const maxDate = data.counts.reduce((prevValue, currentValue) =>
        ((prevValue && prevValue > currentValue.date) ? prevValue : currentValue.date)
      , null);
      const maxComments = data.counts.reduce((prevValue, currentValue) =>
        ((prevValue > currentValue.count) ? prevValue : currentValue.count)
      , 0);
      this.setState({ channel, minDate: DateSelector.dateStringToDate(minDate), maxDate: DateSelector.dateStringToDate(maxDate), date, counts: data.counts, maxComments });
    });
  }
  handleHeatmapClick(value) {
    if (!value) return;
    this.context.router.history.push(`/channel/${this.state.channel.name}/date/${value.date}`);
  }
  handleDateChange(n, date) {
    this.context.router.history.push(`/channel/${this.state.channel.name}/date/${moment(date).format('YYYY-MM-DD')}`);
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
      return <div>Loading {this.props.match.params.channelName} channel info.</div>;
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
    </div>);
  }
}
DateSelector.propTypes = {
  match: React.PropTypes.shape({
    params: React.PropTypes.shape({
      channelName: React.PropTypes.string.isRequired,
      date: React.PropTypes.string,
    }).isRequired,
  }).isRequired,
};
DateSelector.contextTypes = {
  channelResolver: React.PropTypes.instanceOf(ChannelResolver).isRequired,
  router: React.PropTypes.shape(HashRouter.propTypes).isRequired,
};
