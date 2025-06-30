

import type { LoaderFunction } from '@remix-run/node';
import { rootAuthLoader } from '@clerk/remix/ssr.server';

import {
  ClerkApp,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/remix'


export const loader: LoaderFunction = (args) => rootAuthLoader(args);

export function App() {

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
    }}>
      
      <SignedIn> 
        <UserButton />
      </SignedIn>
      <SignedOut>
        <SignInButton />
      </SignedOut>
    </div>
  );
}

export default ClerkApp(App);