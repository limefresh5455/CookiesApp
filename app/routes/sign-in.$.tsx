import {  useLoaderData } from "@remix-run/react";
import type {  LoaderFunction } from '@remix-run/node';
import { rootAuthLoader } from '@clerk/remix/ssr.server';
import { ClerkApp, SignIn } from "@clerk/remix";
import {
  Page,
} from "@shopify/polaris";


export const loader: LoaderFunction = (args) => rootAuthLoader(args);

export function App() {
  const { showForm } = useLoaderData<typeof loader>();

  return (
      <Page title="Sign Up" fullWidth>
      <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
       }}> 
      <SignIn path='/sign-in' signUpUrl='/sign-up' routing="path" />
      </div>
      </Page>
  );
}

export default ClerkApp(App);