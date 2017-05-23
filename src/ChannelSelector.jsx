import React from 'react';
import PropTypes from 'prop-types';
import HashRouter from 'react-router-dom/HashRouter';
import Link from 'react-router-dom/Link';
import FlatButton from 'material-ui/FlatButton';

import { ChannelResolver } from './resolver';

const ChannelSelector = (props, context) => {
  const nodes = context.channelResolver.listChannels().map((c) => {
    const path = `/channel/${c.name}`;
    const currentPath = context.router.route.location.pathname;
    return (<Link key={c.name} to={path}>
      <FlatButton key={c.id} primary={currentPath === path || currentPath.indexOf(`${path}/`) === 0}>#{c.name}</FlatButton>
    </Link>);
  },
  );
  return <div><h2>Channels</h2><div>{nodes}</div></div>;
};
ChannelSelector.propTypes = {
};
ChannelSelector.contextTypes = {
  channelResolver: PropTypes.instanceOf(ChannelResolver).isRequired,
  router: PropTypes.shape(HashRouter.propTypes).isRequired,
};

export default ChannelSelector;
