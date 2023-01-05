import PropTypes from 'prop-types';
import React from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { publicTrends, showTrends } from 'mastodon/initial_state';
import Trends from 'mastodon/features/getting_started/containers/trends_container';
import AccountNavigation from 'mastodon/features/account/navigation';

const DefaultNavigation = (signedIn) => (
  <>
    {showTrends && (signedIn || publicTrends) && (
      <>
        <div className='flex-spacer' />
        <Trends />
      </>
    )}
  </>
);

DefaultNavigation.propTypes = {
  signedIn: PropTypes.bool,
};

export default @withRouter
class NavigationPortal extends React.PureComponent {

  static contextTypes = {
    identity: PropTypes.shape({
      signedIn: PropTypes.bool.isRequired,
    }).isRequired,
  };

  render () {
    return (
      <Switch>
        <Route path='/@:acct' exact component={AccountNavigation} />
        <Route path='/@:acct/tagged/:tagged?' exact component={AccountNavigation} />
        <Route path='/@:acct/with_replies' exact component={AccountNavigation} />
        <Route path='/@:acct/followers' exact component={AccountNavigation} />
        <Route path='/@:acct/following' exact component={AccountNavigation} />
        <Route path='/@:acct/media' exact component={AccountNavigation} />
        <Route>
          <DefaultNavigation signedIn={this.context.identity.signedIn} />
        </Route>
      </Switch>
    );
  }

}
