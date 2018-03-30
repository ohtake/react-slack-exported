import React from 'react';
import PropTypes from 'prop-types';
import HashRouter from 'react-router-dom/HashRouter';

import DatePicker from 'material-ui/DatePicker';
import CalendarHeatmap from 'react-calendar-heatmap';
import padStart from 'lodash/padStart';

// import { ChannelResolver } from './resolver';
import { withChannelResolver } from './contexts';
import * as util from './util';

class DateSelector extends React.Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    if (!prevState || !prevState.channel || nextProps.match.params.channelName !== prevState.channel.name) {
      const channel = nextProps.channelResolver.find(nextProps.match.params.channelName);
      const date = DateSelector.dateStringToDate(nextProps.match.params.date);
      return { channel, date };
    }
    return null;
  }
  static dateStringToDate(str) {
    if (!str) return null;
    const re = /(\d+)-(\d+)-(\d+)/;
    const match = re.exec(str);
    return new Date(Date.UTC(parseInt(match[1], 10), parseInt(match[2], 10) - 1, parseInt(match[3], 10)));
  }
  static dateToString(date) {
    const y = date.getUTCFullYear();
    const m = padStart(date.getUTCMonth() + 1, 2, '0');
    const d = padStart(date.getUTCDate(), 2, '0');
    return `${y}-${m}-${d}`;
  }
  constructor() {
    super();

    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleHeatmapClick = this.handleHeatmapClick.bind(this);
    this.classForValue = this.classForValue.bind(this);
  }
  componentDidMount() {
    this.fetchChannelSummary();
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.state.channel !== prevState.channel) {
      this.fetchChannelSummary();
    }
  }
  fetchChannelSummary() {
    window.fetch(`assets/channel_summary/${this.state.channel.name}.json`)
      .then(util.checkStatus)
      .then(util.parseJSON)
      .then((data) => {
        const minDate = data.counts.reduce((prevValue, currentValue) =>
          ((prevValue && prevValue < currentValue.date) ? prevValue : currentValue.date), null);
        const maxDate = data.counts.reduce((prevValue, currentValue) =>
          ((prevValue && prevValue > currentValue.date) ? prevValue : currentValue.date), null);
        const maxComments = data.counts.reduce((prevValue, currentValue) =>
          ((prevValue > currentValue.count) ? prevValue : currentValue.count), 0);
        this.setState({
          minDate: DateSelector.dateStringToDate(minDate),
          maxDate: DateSelector.dateStringToDate(maxDate),
          counts: data.counts,
          maxComments,
        });
      });
  }
  handleHeatmapClick(value) {
    if (!value) return;
    this.context.router.history.push(`/channel/${this.state.channel.name}/date/${value.date}`);
  }
  handleDateChange(n, date) {
    this.context.router.history.push(`/channel/${this.state.channel.name}/date/${DateSelector.dateToString(date)}`);
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
    if (!this.state.minDate) {
      return <div>Loading {this.props.match.params.channelName} channel info.</div>;
    }
    const startDateValue = this.state.minDate.valueOf() - (24 * 60 * 60 * 1000);
    const oneYearValue = this.state.maxDate.valueOf() - (365 * 24 * 60 * 60 * 1000);
    const startDate = new Date(Math.min(startDateValue, oneYearValue));
    return (
      <React.Fragment>
        <p>{this.state.channel.name} channel ({DateSelector.dateToString(this.state.minDate)} - {DateSelector.dateToString(this.state.maxDate)})</p>
        <div className="react-calendar-heatmap">
          <CalendarHeatmap
            startDate={startDate}
            endDate={this.state.maxDate}
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
      </React.Fragment>);
  }
}
DateSelector.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      channelName: PropTypes.string.isRequired,
      date: PropTypes.string,
    }).isRequired,
  }).isRequired,
  // channelResolver: PropTypes.instanceOf(ChannelResolver).isRequired,
};
DateSelector.contextTypes = {
  router: PropTypes.shape(HashRouter.propTypes).isRequired,
};

export default withChannelResolver(DateSelector);
