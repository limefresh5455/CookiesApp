

import type { LoaderFunction } from '@remix-run/node';
import { rootAuthLoader } from '@clerk/remix/ssr.server';


import { ClerkApp, SignUp } from "@clerk/remix";



export const loader: LoaderFunction = (args) => rootAuthLoader(args);

export function App() {

  return (
   

          <SignUp path='/sign-up' signInUrl='/sign-in' routing="path" />

  );
}

export default ClerkApp(App);