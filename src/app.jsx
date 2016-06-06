import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import { ChannelResolver, UserResolver } from './resolver.js';
import * as C from './components.jsx';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import * as svgIcons from 'material-ui/svg-icons';

import injectTapEventPlugin from 'react-tap-event-plugin';

// Needed for onTouchTap
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

import * as util from './util.js';

let channelResolver = new ChannelResolver();
let userResolver = new UserResolver();
let channelLoaded = false;
let userLoaded = false;

class App extends React.Component {
  constructor() {
    super();
    this.state = { menuOpened: false, menuDocked: false };
    this.handleLeftIconButtonTouchTap = this.handleLeftIconButtonTouchTap.bind(this);
    this.handleRequestChange = this.handleRequestChange.bind(this);
    this.handleRouterTo = this.handleRouterTo.bind(this);
  }
  handleLeftIconButtonTouchTap(/* e */) {
    this.setState({ menuOpened: !this.state.menuOpened });
  }
  handleRequestChange(open /* , reason */) {
    this.setState({ menuOpened: open });
  }
  handleRouterTo(e) {
    this.context.router.push(e.currentTarget.getAttribute('data-routerTo'));
    this.setState({ menuOpened: false });
  }
  render() {
    return (<div>
      <AppBar
        title="Slack exported"
        onLeftIconButtonTouchTap={this.handleLeftIconButtonTouchTap}
      />
      <Drawer open={this.state.menuOpened} docked={false} onRequestChange={this.handleRequestChange} width={240}>
        <List>
          <ListItem primaryText="Home" leftIcon={<svgIcons.ActionHome />} onTouchTap={this.handleRouterTo} data-routerTo={'/'} />
          <Divider />
          <Subheader>Channels</Subheader>
          {this.props.route.channelResolver.listChannels().map(c =>
            <ListItem primaryText={c.name} onTouchTap={this.handleRouterTo} data-routerTo={`/channel/${c.name}`} />
          )}
        </List>
      </Drawer>
      <div style={{ padding: '8px' }}>
        {this.props.children}
      </div>
    </div>);
  }
}
App.propTypes = util.propTypesRoute;
App.contextTypes = {
  router: React.PropTypes.object,
};

function renderIfCompleted() {
  if (channelLoaded && userLoaded) {
    ReactDOM.render((
      <MuiThemeProvider muiTheme={getMuiTheme()}>
        <Router history={hashHistory}>
          <Route path="/" component={App} channelResolver={channelResolver}>
            <IndexRoute component={C.ChannelSelector} channelResolver={channelResolver} />
            <Route path="channel/:channelName" component={C.DateSelector} channelResolver={channelResolver}>
              <Route path="date/:date" component={C.HistoryView} userResolver={userResolver} />
            </Route>
          </Route>
        </Router>
      </MuiThemeProvider>
    ), document.getElementById('app'));
  }
}

channelResolver.fetch(() => {
  channelLoaded = true;
  renderIfCompleted();
});
userResolver.fetch(() => {
  userLoaded = true;
  renderIfCompleted();
});
