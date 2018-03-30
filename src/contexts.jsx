import React from 'react';

export const ChannelResolverContext = React.createContext();
export const UserResolverContext = React.createContext();

export function withChannelResolver(Component) {
  function ComponentWithChannelResolver(props, ref) {
    return (
      <ChannelResolverContext.Consumer>
        {channelResolver => <Component {...props} channelResolver={channelResolver} ref={ref} />}
      </ChannelResolverContext.Consumer>
    );
  }
  const name = Component.displayName || Component.name;
  ComponentWithChannelResolver.displayName = `withChannelResolver(${name})`;
  return React.forwardRef(ComponentWithChannelResolver);
}

export function withUserResolver(Component) {
  function ComponentWithUserResolver(props, ref) {
    return (
      <UserResolverContext.Consumer>
        {userResolver => <Component {...props} userResolver={userResolver} ref={ref} />}
      </UserResolverContext.Consumer>
    );
  }
  const name = Component.displayName || Component.name;
  ComponentWithUserResolver.displayName = `withUserResolver(${name})`;
  return React.forwardRef(ComponentWithUserResolver);
}
