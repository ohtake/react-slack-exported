import React from 'react';
import PropTypes from 'prop-types';
import { NavLink, Route } from 'react-router-dom';

import withTheme from '@material-ui/core/styles/withTheme';
import AppBar from '@material-ui/core/AppBar';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import ActionHome from '@material-ui/icons/Home';
import ActionTurnedIn from '@material-ui/icons/TurnedIn';
import ActionTurnedInNot from '@material-ui/icons/TurnedInNot';
import NavigationClose from '@material-ui/icons/Close';
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';

import ChannelSelector from './ChannelSelector';
import DateSelector from './DateSelector';
import HistoryView from './HistoryView';
import { ChannelResolver, UserResolver } from './resolver';
import { ChannelResolverContext, UserResolverContext } from './contexts';

class App extends React.Component {
  constructor() {
    super();
    this.state = { menuOpened: false, menuDocked: false };
    this.handleLeftIconButtonClick = this.handleLeftIconButtonClick.bind(this);
    this.handleMenuClick = this.handleMenuClick.bind(this);
    this.handleMenuPinned = this.handleMenuPinned.bind(this);
    this.handleMenuClose = this.handleMenuClose.bind(this);
    this.menuWidth = 250;
  }

  handleLeftIconButtonClick(/* e */) {
    const { menuOpened } = this.state;
    this.setState({ menuOpened: !menuOpened });
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
    const { channelResolver, theme } = this.props;
    const activeStyle = {
      borderLeft: `${theme.spacing.unit}px solid ${theme.palette.primary.main}`,
    };
    return (
      <div style={{ marginLeft: menuOpened && menuDocked ? this.menuWidth : 0 }}>
        <AppBar position="static">
          <Toolbar>
            {!menuOpened || !menuDocked
              ? <IconButton onClick={this.handleLeftIconButtonClick}><MenuIcon /></IconButton>
              : null }
            <div style={{ flexGrow: 1 }}>
              <Typography variant="title">Slack exported</Typography>
            </div>
          </Toolbar>
        </AppBar>
        <Drawer open={menuOpened} variant={menuDocked ? 'persistent' : 'temporary'} onClose={this.handleMenuClose}>
          <div style={{ width: this.menuWidth, overflowX: 'hidden' }}>
            <Toolbar>
              <div style={{ flexGrow: 1 }} />
              <IconButton onClick={this.handleMenuPinned}>
                {menuDocked ? <ActionTurnedIn /> : <ActionTurnedInNot />}
              </IconButton>
              <IconButton onClick={this.handleMenuClose}>
                <NavigationClose />
              </IconButton>
            </Toolbar>
            <Divider />
            <List>
              <ListItem button component={NavLink} to="/" exact onClick={this.handleMenuClick} activeStyle={activeStyle}>
                <ListItemIcon><ActionHome /></ListItemIcon>
                <ListItemText>Home</ListItemText>
              </ListItem>
            </List>
            <Divider />
            <List subheader={<ListSubheader>Channels</ListSubheader>}>
              {channelResolver.listChannels().map(c => (
                <ListItem button component={NavLink} to={`/channel/${c.name}`} onClick={this.handleMenuClick} activeStyle={activeStyle}>
                  <ListItemText>{c.name}</ListItemText>
                </ListItem>
              ))}
            </List>
          </div>
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
  theme: PropTypes.shape({}).isRequired,
  channelResolver: PropTypes.instanceOf(ChannelResolver).isRequired,
  userResolver: PropTypes.instanceOf(UserResolver).isRequired,
};

export default withTheme()(App);
