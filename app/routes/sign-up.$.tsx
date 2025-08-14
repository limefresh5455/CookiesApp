import type { LoaderFunction } from '@remix-run/node';
import { rootAuthLoader } from '@clerk/remix/ssr.server';
import { ClerkApp, SignUp } from "@clerk/remix";
import {
  Page,
} from "@shopify/polaris";
export const loader: LoaderFunction = (args) => rootAuthLoader(args);

export function App() {

  return (
    <Page title="Sign Up" fullWidth>
      <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
       }}>  
      </div>
      <SignUp path='/sign-up' signInUrl='/sign-in' routing="path" />  
    </Page>
  );
}

export default ClerkApp(App);