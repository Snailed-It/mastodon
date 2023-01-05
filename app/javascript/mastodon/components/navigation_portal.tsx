import { Switch, Route } from 'react-router-dom';

import AccountNavigation from 'mastodon/features/account/navigation';
import Trends from 'mastodon/features/getting_started/containers/trends_container';
import { publicTrends, showTrends } from 'mastodon/initial_state';
import {useIdentity} from "mastodon/identity_context";

const DefaultNavigation: React.FC<{signedIn: boolean}> = ({signedIn}) => (showTrends && (signedIn || publicTrends) ? <Trends /> : null);

export const NavigationPortal: React.FC = () => {
  const { signedIn } = useIdentity();

  return (
    <div className='navigation-panel__portal'>
      <Switch>
        <Route path='/@:acct' exact component={AccountNavigation} />
        <Route
          path='/@:acct/tagged/:tagged?'
          exact
          component={AccountNavigation}
        />
        <Route path='/@:acct/with_replies' exact component={AccountNavigation} />
        <Route path='/@:acct/followers' exact component={AccountNavigation} />
        <Route path='/@:acct/following' exact component={AccountNavigation} />
        <Route path='/@:acct/media' exact component={AccountNavigation} />
        <Route>
          <DefaultNavigation signedIn={signedIn} />
        </Route>
      </Switch>
    </div>
  );
}
