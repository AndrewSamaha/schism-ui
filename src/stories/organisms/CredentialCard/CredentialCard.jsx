import React from 'react';
import './CredentialCard.css';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import { Button } from '../../atoms/Button/Button';

export const CredentialCard = () => (
  <Container maxWidth="sm" className="credential">
    
    <TextField id="username" label="Username" variant="outlined" /><br/>
    <TextField id="password" label="Password" variant="outlined" type="password" /><br/>
    <Button label="Login"/>
  </Container>
);

CredentialCard.propTypes = { };

CredentialCard.defaultProps = { };
