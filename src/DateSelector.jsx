import React from 'react';
import PropTypes from 'prop-types';
import HashRouter from 'react-router-dom/HashRouter';

import DatePicker from 'material-ui/DatePicker';
import CalendarHeatmap from 'react-calendar-heatmap';
import moment from 'moment-timezone';

import { ChannelResolver } from './resolver';
import { withChannelResolver } from './contexts';
import * as util from './util';

class DateSelector extends React.Component {
  static dateStringToDate(str) {
    if (!str) return null;
    const date = moment(str);
    return date.toDate();
  }
  constructor(props) {
    super();

    this.propsToState(props.channelResolver, props.match);

    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleHeatmapClick = this.handleHeatmapClick.bind(this);
    this.classForValue = this.classForValue.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    this.propsToState(nextProps.channelResolver, nextProps.match);
  }
  propsToState(channelResolver, match) {
    const channel = channelResolver.find(match.params.channelName);
    const date = DateSelector.dateStringToDate(match.params.date);
    window.fetch(`assets/channel_summary/${channel.name}.json`)
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
          channel,
          minDate: DateSelector.dateStringToDate(minDate),
          maxDate: DateSelector.dateStringToDate(maxDate),
          date,
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
    const startDateValue = this.state.minDate.valueOf() - (24 * 60 * 60 * 1000);
    const oneYearValue = this.state.maxDate.valueOf() - (365 * 24 * 60 * 60 * 1000);
    const startDate = new Date(Math.min(startDateValue, oneYearValue));
    return (
      <React.Fragment>
        <p>{this.state.channel.name} channel ({moment(this.state.minDate).format('YYYY-MM-DD')} - {moment(this.state.maxDate).format('YYYY-MM-DD')})</p>
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
  channelResolver: PropTypes.instanceOf(ChannelResolver).isRequired,
};
DateSelector.contextTypes = {
  router: PropTypes.shape(HashRouter.propTypes).isRequired,
};

export default withChannelResolver(DateSelector);
