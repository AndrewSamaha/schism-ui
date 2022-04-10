import React from 'react';

import { Header } from '../../organisms/Header/Header';
import { CredentialCard } from '../../organisms/CredentialCard/CredentialCard';
import './Login.css';

export const Login = () => {
  const [user, setUser] = React.useState();

  return (
    <article>
      <Header
        showLogin={false}
        user={null}
        onLogin={() => true}
        onCreateAccount={() => true}
        onLogout={() => true}
      />

      <section>
        <CredentialCard />
      </section>
    </article>
  );
};
