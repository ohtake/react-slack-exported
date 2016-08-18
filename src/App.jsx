import React from 'react';
import { Link, IndexLink } from 'react-router';

import AppBar from 'material-ui/AppBar';
import Divider from 'material-ui/Divider';
import Drawer from 'material-ui/Drawer';
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';

import ActionHome from 'material-ui/svg-icons/action/home';
import ActionTurnedIn from 'material-ui/svg-icons/action/turned-in';
import ActionTurnedInNot from 'material-ui/svg-icons/action/turned-in-not';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import IconButton from 'material-ui/IconButton';

import * as util from './util.js';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = { menuOpened: false, menuDocked: false };
    this.handleLeftIconButtonTouchTap = this.handleLeftIconButtonTouchTap.bind(this);
    this.handleRequestChange = this.handleRequestChange.bind(this);
    this.handleMenuClick = this.handleMenuClick.bind(this);
    this.handleMenuPinned = this.handleMenuPinned.bind(this);
    this.handleMenuClose = this.handleMenuClose.bind(this);
    this.menuWidth = 250;
  }
  handleLeftIconButtonTouchTap(/* e */) {
    this.setState({ menuOpened: !this.state.menuOpened });
  }
  handleRequestChange(open /* , reason */) {
    this.setState({ menuOpened: open });
  }
  handleMenuClick() {
    if (this.state.menuDocked) return;
    window.setTimeout(() => this.setState({ menuOpened: false }), 200);
  }
  handleMenuPinned() {
    this.setState({ menuDocked: !this.state.menuDocked });
  }
  handleMenuClose() {
    this.setState({ menuOpened: false });
  }
  render() {
    const theme = this.context.muiTheme;
    const activeStyle = {
      display: 'block',
      borderLeft: `${theme.spacing.desktopGutterMini}px solid ${theme.palette.primary1Color}`,
    };
    return (<div style={{ marginLeft: this.state.menuOpened && this.state.menuDocked ? this.menuWidth : 0 }}>
      <AppBar
        title="Slack exported"
        onLeftIconButtonTouchTap={this.handleLeftIconButtonTouchTap}
      />
      <Drawer open={this.state.menuOpened} docked={this.state.menuDocked} onRequestChange={this.handleRequestChange} containerClassName="navigationMenu" width={this.menuWidth}>
        <Toolbar>
          <ToolbarGroup firstChild>
            {/* Needs firstChild to align others to left */}
          </ToolbarGroup>
          <ToolbarGroup>
            <IconButton onClick={this.handleMenuPinned}>
              {this.state.menuDocked ? <ActionTurnedIn /> : <ActionTurnedInNot />}
            </IconButton>
            <IconButton onClick={this.handleMenuClose}>
              <NavigationClose />
            </IconButton>
          </ToolbarGroup>
        </Toolbar>
        <List>
          <IndexLink to="/" onClick={this.handleMenuClick} activeStyle={activeStyle}>
            <ListItem primaryText="Home" leftIcon={<ActionHome />} />
          </IndexLink>
          <Divider />
          <Subheader>Channels</Subheader>
          {this.props.route.channelResolver.listChannels().map(c =>
            <Link key={c.name} to={`/channel/${c.name}`} onClick={this.handleMenuClick} activeStyle={activeStyle}>
              <ListItem primaryText={c.name} />
            </Link>
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
  muiTheme: React.PropTypes.object.isRequired,
};
