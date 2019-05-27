import React from 'react';
import PropTypes from 'prop-types';
import NavLink from 'react-router-dom/NavLink';
import Route from 'react-router-dom/Route';

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

import ChannelSelector from './ChannelSelector';
import DateSelector from './DateSelector';
import HistoryView from './HistoryView';
import { ChannelResolver, UserResolver } from './resolver';
import { ChannelResolverContext, UserResolverContext } from './contexts';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = { menuOpened: false, menuDocked: false };
    this.handleLeftIconButtonClick = this.handleLeftIconButtonClick.bind(this);
    this.handleRequestChange = this.handleRequestChange.bind(this);
    this.handleMenuClick = this.handleMenuClick.bind(this);
    this.handleMenuPinned = this.handleMenuPinned.bind(this);
    this.handleMenuClose = this.handleMenuClose.bind(this);
    this.menuWidth = 250;
  }

  handleLeftIconButtonClick(/* e */) {
    const { menuOpened } = this.state;
    this.setState({ menuOpened: !menuOpened });
  }

  handleRequestChange(open /* , reason */) {
    this.setState({ menuOpened: open });
  }

  handleMenuClick() {
    const { menuDocked } = this.state;
    if (menuDocked) return;
    window.setTimeout(() => this.setState({ menuOpened: false }), 200);
  }

  handleMenuPinned() {
    const { menuDocked } = this.state;
    this.setState({ menuDocked: !menuDocked });
  }

  handleMenuClose() {
    this.setState({ menuOpened: false });
  }

  renderInner() {
    const { menuOpened, menuDocked } = this.state;
    const { muiTheme } = this.context;
    const { channelResolver } = this.props;
    const activeStyle = {
      display: 'block',
      borderLeft: `${muiTheme.spacing.desktopGutterMini}px solid ${muiTheme.palette.primary1Color}`,
    };
    return (
      <div style={{ marginLeft: menuOpened && menuDocked ? this.menuWidth : 0 }}>
        <AppBar
          title="Slack exported"
          onLeftIconButtonClick={this.handleLeftIconButtonClick}
        />
        <Drawer open={menuOpened} docked={menuDocked} onRequestChange={this.handleRequestChange} containerClassName="navigationMenu" width={this.menuWidth}>
          <Toolbar>
            <ToolbarGroup firstChild>
              {/* Needs firstChild to align others to left */}
            </ToolbarGroup>
            <ToolbarGroup>
              <IconButton onClick={this.handleMenuPinned}>
                {menuDocked ? <ActionTurnedIn /> : <ActionTurnedInNot />}
              </IconButton>
              <IconButton onClick={this.handleMenuClose}>
                <NavigationClose />
              </IconButton>
            </ToolbarGroup>
          </Toolbar>
          <List>
            <NavLink to="/" onClick={this.handleMenuClick} exact activeStyle={activeStyle}>
              <ListItem primaryText="Home" leftIcon={<ActionHome />} />
            </NavLink>
            <Divider />
            <Subheader>Channels</Subheader>
            {channelResolver.listChannels().map(c => (
              <NavLink key={c.name} to={`/channel/${c.name}`} onClick={this.handleMenuClick} activeStyle={activeStyle}>
                <ListItem primaryText={c.name} />
              </NavLink>
            ))}
          </List>
        </Drawer>
        <div style={{ padding: '8px' }}>
          <Route path="/" component={ChannelSelector} />
          <Route path="/channel/:channelName" component={DateSelector} />
          <Route path="/channel/:channelName/date/:date" component={HistoryView} />
        </div>
      </div>
    );
  }

  render() {
    const { channelResolver, userResolver } = this.props;
    return (
      <ChannelResolverContext.Provider value={channelResolver}>
        <UserResolverContext.Provider value={userResolver}>
          {this.renderInner()}
        </UserResolverContext.Provider>
      </ChannelResolverContext.Provider>
    );
  }
}
App.propTypes = {
  channelResolver: PropTypes.instanceOf(ChannelResolver).isRequired,
  userResolver: PropTypes.instanceOf(UserResolver).isRequired,
};
App.contextTypes = {
  muiTheme: PropTypes.shape({}).isRequired,
};
