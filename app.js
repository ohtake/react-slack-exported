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
        console.log("Channel selected: " + $(e.target).data("name"));
    }
    render() {
        if(! this.state) return <div>?? no state</div>;
        if(this.state.message) {
            return (<div>{this.state.message}</div>);
        } else {
            let nodes = this.state.data.map(c => {
              return (<li key={c.id}><a onClick={this.handleChannelSelect} href="#" data-name={c.name}>#{c.name}</a></li>);
            })
            return (<ul>{nodes}</ul>);
        }
    }
};

ReactDOM.render(<Channels />, document.getElementById('channels'));
