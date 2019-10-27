import React from 'react';
import { Switch } from 'react-router-dom';
import Route from './Routes';

import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';

import Dashboard from '../pages/Dashboard';
import detailMeetup from '../pages/Meetup/Detail';
import createMeetup from '../pages/Meetup/Create';
import updateMeetup from '../pages/Meetup/Update';
import Profile from '../pages/Profile';

export default function Routes() {
  return (
    <Switch>
      <Route path="/" exact component={SignIn} />
      <Route path="/register" component={SignUp} />

      <Route path="/dashboard" component={Dashboard} isPrivate />
      <Route path="/meetup/detail" component={detailMeetup} isPrivate />
      <Route path="/meetup/create" component={createMeetup} isPrivate />
      <Route path="/meetup/update" component={updateMeetup} isPrivate />
      <Route path="/profile" component={Profile} isPrivate />
    </Switch>
  );
}
