import logo from './logo.svg';
import './App.css';
import { Button } from './stories/atoms/Button/Button';
import React from "react";
import {
  BrowserRouter,
  Router,
  Routes,
  Route,
  Link,
  Switch
} from "react-router-dom";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql
} from "@apollo/client";
import { Home } from './stories/pages/Home/Home';
import { Login } from './stories/pages/Login/Login';
import { Play } from './stories/pages/Play/Play';

import { GET_ALL_PLAYERS } from './graph/queries';

function AllPlayers() {
  const { loading, error, data } = useQuery(GET_ALL_PLAYERS);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  return data.getAllPlayers.map(({ id, name }) => (
    <div key={id}>
      <p>
        {id}: {name}
      </p>
    </div>
  ));
}

// function App() {
const App = ({client}) => {
  return (
    <BrowserRouter>
      <div>
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Routes>
            <Route exact path="/" element={<Home/>} />
            <Route exact path="/about" element={<About/>} />
            <Route exact path="/users" element={<Users/>} />
            <Route exact path="/login" element={<Login/>} />
            <Route exact path="/play" element={<Play client={client} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

function About() {
  return <h2>About</h2>;
}

function Users() {
  return (
    <div>
      <h2>Users</h2>
      <AllPlayers />
    </div>
  );
}

export default App;
