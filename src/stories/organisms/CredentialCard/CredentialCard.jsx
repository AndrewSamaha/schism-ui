import React, { useState, useReducer } from 'react';
import { gql, useMutation } from '@apollo/client';
import './CredentialCard.css';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import { Button } from '../../atoms/Button/Button';
import { userReducer, initialState } from '../../../contexts/UserContext';
// import { gameReducer } from '../../../contexts/GameContext';

const LOGIN = gql`
# Increments a back-end counter and gets its resulting value
mutation login($name: String!, $password: String!) {
  login(name: $name, password: $password) {
    ... on Player {
      id
      name
      authToken
    }
    ... on ErrorAuthentication {
      message
    }
  }
}
`;

export const CredentialCard = () => {
  const [state, dispatch] = useReducer(userReducer, initialState);
  const [login, { data, loading, error }] = useMutation(LOGIN, {
    onCompleted: (data) => {
      if (data?.login?.__typename === 'Player') {
        localStorage.setItem('authorization',data.login.authToken);
        localStorage.setItem('player', data.login.name)
        localStorage.setItem('id', data.login.id)
        console.log('login mutation results: ', JSON.stringify(data.login))
        // dispatch({
        //   type: 'login',
        //   user: {
        //     id: data.login.id,
        //     name: data.login.name
        //   },
        //   payload: {
        //     user: {
        //       id: data.login.id,
        //       name: data.login.name,
        //       authorization: data.login.authToken
        //     }
        //   }
        // });
        window.location = '/play'; 
        console.log('login successful');
        console.log({state});
        return;
      }
    console.log('login failed');
  }});
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  if (loading) return 'Submitting...';
  if (error) return `Submission error! ${error.message}`;
  if (data) return `${data}`;

  return (
  <Container maxWidth="sm" className="credential">
      <TextField 
        id="name" 
        label="Username" 
        variant="outlined" 
        onChange={(event) => setName(event.target.value)} 
        style={{paddingBottom: '10px'}}
      />
      <TextField
        id="password"
        label="Password"
        variant="outlined"
        type="password"
        onChange={(event) => setPassword(event.target.value)}
        style={{paddingLeft: '10px', paddingBottom: '10px'}}
      /><br/>
      <Button
        label="Login"
        onClick={() => {
          console.log('sending login');
          login({ variables: { name, password } });
          console.log({data});
        }}
      />
  </Container>
  );
}

CredentialCard.propTypes = { };

CredentialCard.defaultProps = { };
