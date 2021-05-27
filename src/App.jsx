import React, { useEffect, useState } from 'react';
import { Route, Switch, useParams } from 'react-router-dom';
import Main from './components/Main';
import './App.css';

// TODO: pass in params as route
export default function App() {



  return (
    <div className="app">
      <Switch>
        <Route path="/:subreddit">
          <Main/>
        </Route>
        <Route path="/">
          <Main/>
        </Route>
      </Switch>
    </div>
  );
}
