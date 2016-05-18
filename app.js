import React from 'react';
import ReactDOM from 'react-dom';
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
        console.log(e)
    }
    render() {
        let created = new Date(this.props.created*1000);
        let now = new Date();
        let pad2 = n => { return ("0"+n).slice(-2); };
        let toDateString = date => { return date.getFullYear() + "-" + pad2(date.getMonth()+1) + "-" + pad2(date.getDate()); };
        return (<div>
            <p>Pick a date for channel #{this.props.name}</p>
            <input type="date" onChange={this.handleDateChange.bind(this)} min={toDateString(created)} max={toDateString(now)}/>
        </div>);
    }
}

ReactDOM.render(<Channels />, document.getElementById('channels'));
