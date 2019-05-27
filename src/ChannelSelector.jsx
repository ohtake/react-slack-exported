import React from 'react';
import PropTypes from 'prop-types';
import { createHashHistory } from 'history';
import { Link as RouterLink } from 'react-router-dom';
import FlatButton from 'material-ui/FlatButton';

import { ChannelResolver } from './resolver';
import { withChannelResolver } from './contexts';

const ChannelSelector = (props) => {
  const { channelResolver } = props;
  const nodes = channelResolver.listChannels().map((c) => {
    const path = `/channel/${c.name}`;
    const history = createHashHistory();
    const currentPath = history.location.pathname;
    return (
      <RouterLink key={c.name} to={path}>
        <FlatButton key={c.id} primary={currentPath === path || currentPath.indexOf(`${path}/`) === 0}>
          #
          {c.name}
        </FlatButton>
      </RouterLink>
    );
  });
  return (
    <React.Fragment>
      <h2>Channels</h2>
      <div>{nodes}</div>
    </React.Fragment>
  );
};
ChannelSelector.propTypes = {
  channelResolver: PropTypes.instanceOf(ChannelResolver).isRequired,
};

export default withChannelResolver(ChannelSelector);
