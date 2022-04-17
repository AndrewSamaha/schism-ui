import React, { useState, useReducer } from 'react';
import { gql, useMutation } from '@apollo/client';
import './CredentialCard.css';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import { Button } from '../../atoms/Button/Button';
import { userReducer, initialState } from '../../../contexts/UserContext';

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
  const [login, { data, loading, error }] = useMutation(LOGIN, {onCompleted: (data) => {
    if (data?.login?.__typename === 'Player') {
      localStorage.setItem('authorization',data.login.authToken);
      localStorage.setItem('player', data.login.name)
      dispatch({
        type: 'login',
        user: {
          id: data.login.id,
          name: data.login.name
        }
      });
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
      <TextField id="name" label="Username" variant="outlined" onChange={(event) => setName(event.target.value)} /><br/>
      <TextField id="password" label="Password" variant="outlined" type="password" onChange={(event) => setPassword(event.target.value)} /><br/>
      <Button label="Login" onClick={() => {
          console.log('sending login');
          login({ variables: { name, password } });
          console.log({data});
        }} />
    data: {data}<br/>
    loading: {loading}<br/>
    error: {error}<br/>
  </Container>
  );
}

CredentialCard.propTypes = { };

CredentialCard.defaultProps = { };
