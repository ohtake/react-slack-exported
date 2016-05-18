import React from 'react';
import ReactDOM from 'react-dom';
import ReactMarkdown from 'react-markdown';
import $ from 'jquery';

class Channels extends React.Component {
    constructor() {
        super();
    }
    componentDidMount() {
        this.setState({
            message: "loading",
            data: []
        });
        this.fetchData();
    }
    fetchData() {
        $.getJSON("slack_export/channels.json")
        .done(data => {
            this.setState({
                message: "",
                data: data
            });
        })
        .fail(err => {
            this.setState({
                message: err.status + " " + err.statusText,
                data: []
            });
        });
    }
    handleChannelSelect(e) {
        e.preventDefault();
        let channel = this.state.data[$(e.target).data("index")];
        ReactDOM.render(React.createElement(DateSelector, channel), document.getElementById('date'));
    }
    render() {
        if(! this.state) return <div>?? no state</div>;
        if(this.state.message) {
            return (<div>{this.state.message}</div>);
        } else {
            let nodes = this.state.data.map((c,i) => {
              return (<li key={c.id}><a onClick={this.handleChannelSelect.bind(this)} href="#" data-index={i}>#{c.name}</a></li>);
            })
            return (<ul>{nodes}</ul>);
        }
    }
};

class DateSelector extends React.Component {
    constructor() {
        super();
    }
    handleDateChange(e) {
        ReactDOM.render(React.createElement(HistoryView, {channel: this.props, date: e.target.value}), document.getElementById('history'));
    }
    render() {
        let created = new Date(this.props.created*1000);
        let now = new Date();
        let pad2 = n => { return ("0"+n).slice(-2); };
        let toDateString = date => { return date.getFullYear() + "-" + pad2(date.getMonth()+1) + "-" + pad2(date.getDate()); };
        return (<div>
            <p>Pick a UTC date for channel #{this.props.name}</p>
            <input type="date" onChange={this.handleDateChange.bind(this)} min={toDateString(created)} max={toDateString(now)}/>
        </div>);
    }
}

class HistoryView extends React.Component {
    constructor() {
        super();
    }
    componentDidMount() {
        this.setState({
            message: "loading",
            data: []
        });
        this.fetchHistory();
    }
    componentWillReceiveProps() {
        this.fetchHistory();
    }
    fetchHistory() {
        $.getJSON("slack_export/" + this.props.channel.name + "/" + this.props.date + ".json")
        .done(data => {
            this.setState({
                message: "",
                data: data
            });
        })
        .fail(err => {
            this.setState({
                message: err.status + " " + err.statusText,
                data: []
            });
        });
    }
    render() {
        if(! this.state) return <div>?? no state</div>;
        if(this.state.message) {
            return (<div>{this.state.message}</div>);
        } else {
            let datetimeFormatter = dt => {
                return dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
            };
            let nodes = this.state.data.map((m,i) => {
                let header = <span>{datetimeFormatter(new Date(m.ts*1000))} {m.user}</span>;
                return (<li key={m.ts}><ReactMarkdown source={m.text} childBefore={header} /></li>);
            })
            return (<ul>{nodes}</ul>);
        }
    }
}

ReactDOM.render(<Channels />, document.getElementById('channels'));
