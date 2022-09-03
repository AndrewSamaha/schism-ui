import React from 'react';
import ReactDOM from 'react-dom';
import * as ReactDOMClient from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { UserContext, initialState } from './contexts/UserContext';
import { GameContext } from './contexts/GameContext';
import { ApolloClient, createHttpLink, InMemoryCache, ApolloProvider } from "@apollo/client";
import { setContext } from '@apollo/client/link/context';
import { createClientGameState } from './mock/gameState';

const httpLink = createHttpLink({
  uri: 'http://localhost:4000/',
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('authorization');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? token : "",
    }
  }
});


const client = new ApolloClient({
  uri: 'http://localhost:4000',
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

const user = {
  id: 0,
  name: null // localStorage.getItem('player') || 
};
console.log('user info coming from index.js');
console.log({user});

//const gameState = createClientGameState();

const container = document.getElementById('root');

// Create a root.
const root = ReactDOMClient.createRoot(container);

// Initial render: Render an element to the root.
root.render(
  <React.StrictMode>
    <UserContext.Provider value={initialState}>
      <GameContext.Provider value={null}>
        <ApolloProvider client={client}>
            <App client={client} />
        </ApolloProvider>
      </GameContext.Provider>
    </UserContext.Provider>
  </React.StrictMode>
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
