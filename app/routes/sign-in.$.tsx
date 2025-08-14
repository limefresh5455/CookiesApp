import {  useLoaderData } from "@remix-run/react";
import type {  LoaderFunction } from '@remix-run/node';
import { rootAuthLoader } from '@clerk/remix/ssr.server';
import { ClerkApp, SignIn } from "@clerk/remix";

export const loader: LoaderFunction = (args) => rootAuthLoader(args);

export function App() {
  const { showForm } = useLoaderData<typeof loader>();

  return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}>
      <SignIn path='/sign-in' signUpUrl='/sign-up' routing="path" />
      </div>
  );
}

export default ClerkApp(App);