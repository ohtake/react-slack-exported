import React from 'react';
import { Link } from 'react-router';
import * as util from './util.js';

const ChannelSelector = (props) => {
  let nodes = props.route.channelResolver.listChannels().map(c =>
    <li key={c.id}><Link to={`/channel/${c.name}`} activeClassName="active">#{c.name}</Link></li>
  );
  return <div><h2>Channels</h2><ul id="channels">{nodes}</ul>{props.children}</div>;
};
ChannelSelector.propTypes = util.propTypesRoute;

export default ChannelSelector;
