import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import withTheme from '@material-ui/core/styles/withTheme';
import Button from '@material-ui/core/Button';

import { ChannelResolver } from './resolver';
import { withChannelResolver } from './contexts';

const ChannelSelector = (props) => {
  const { channelResolver, theme } = props;
  const nodes = channelResolver.listChannels().map((c) => {
    const path = `/channel/${c.name}`;
    return (
      <Button component={NavLink} key={c.id} to={path} style={{ textTransform: 'none' }} activeStyle={{ backgroundColor: theme.palette.primary.light }}>
        #
        {c.name}
      </Button>
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
  theme: PropTypes.shape({}).isRequired,
  channelResolver: PropTypes.instanceOf(ChannelResolver).isRequired,
};

export default withTheme(withChannelResolver(ChannelSelector));
