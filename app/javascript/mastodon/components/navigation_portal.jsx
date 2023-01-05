import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { Switch, Route, withRouter } from 'react-router-dom';

import AccountNavigation from 'mastodon/features/account/navigation';
import Trends from 'mastodon/features/getting_started/containers/trends_container';
import { publicTrends, showTrends } from 'mastodon/initial_state';

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

class NavigationPortal extends PureComponent {

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
export default withRouter(NavigationPortal);
