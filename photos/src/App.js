import React from 'react';
import Amplify from 'aws-amplify';
import awsExports from './aws-exports';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { Header } from 'semantic-ui-react';

Amplify.configure(awsExports);

function App() {
  return (
    <Header as='h1'>
      <AmplifySignOut></AmplifySignOut>
      Hello World!
    </Header>
  );
}

export default withAuthenticator(App);
