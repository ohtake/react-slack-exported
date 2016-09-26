import React from 'react';
import Link from 'react-router/lib/Link';
import FlatButton from 'material-ui/FlatButton';

import * as util from './util';

const ChannelSelector = (props) => {
  const nodes = props.route.channelResolver.listChannels().map(c =>
    <Link key={c.name} to={`/channel/${c.name}`}>
      <FlatButton key={c.id} primary={c.name === props.params.channelName}>#{c.name}</FlatButton>
    </Link>
  );
  return <div><h2>Channels</h2><div>{nodes}</div>{props.children}</div>;
};
ChannelSelector.propTypes = util.propTypesRoute;

export default ChannelSelector;
