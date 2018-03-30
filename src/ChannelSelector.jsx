import React from 'react';
import PropTypes from 'prop-types';
import HashRouter from 'react-router-dom/HashRouter';
import RouterLink from 'react-router-dom/Link';
import FlatButton from 'material-ui/FlatButton';

import { ChannelResolver } from './resolver';
import { withChannelResolver } from './contexts';

const ChannelSelector = (props, context) => {
  const nodes = props.channelResolver.listChannels().map((c) => {
    const path = `/channel/${c.name}`;
    const currentPath = context.router.route.location.pathname;
    return (
      <RouterLink key={c.name} to={path}>
        <FlatButton key={c.id} primary={currentPath === path || currentPath.indexOf(`${path}/`) === 0}>#{c.name}</FlatButton>
      </RouterLink>);
  });
  return <React.Fragment><h2>Channels</h2><div>{nodes}</div></React.Fragment>;
};
ChannelSelector.propTypes = {
  channelResolver: PropTypes.instanceOf(ChannelResolver).isRequired,
};
ChannelSelector.contextTypes = {
  router: PropTypes.shape(HashRouter.propTypes).isRequired,
};

export default withChannelResolver(ChannelSelector);
