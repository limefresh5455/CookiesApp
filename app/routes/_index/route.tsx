import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { redirect, json } from "@remix-run/node";
import { Form, useLoaderData, useActionData, useNavigation } from "@remix-run/react";
import { clerkClient } from "@clerk/clerk-sdk-node";

import { login } from "../../shopify.server";

import styles from "./styles.module.css";
import { getAuth } from "@clerk/remix/ssr.server";

import { checkDomainExists, createVerifiedDomain } from "app/services/captainApi";
import db from "../../db.server";
import logo from './logo.png';

export const loader = async (args: LoaderFunctionArgs) => {
  const url = new URL(args.request.url);

  if (url.searchParams.get("shop")) {
    throw redirect(`/app?${url.searchParams.toString()}`);
  }

  const { userId } = await getAuth(args);

  if (!userId) {
    return redirect("/sign-in");
  }

  const user = await clerkClient.users.getUser(userId);
  const email: string = user.emailAddresses[0]?.emailAddress || "";

  console.log("userId:", userId);
  console.log("email:", email);

  return {
    showForm: Boolean(login),
    userId,
    email,
  };
};

export const action = async (args: ActionFunctionArgs) => {
  const { userId } = await getAuth(args);
  const { request } = args;

  if (!userId) {
    return redirect("/sign-in");
  }

  const user = await clerkClient.users.getUser(userId);
  const email: string = user.emailAddresses[0]?.emailAddress || "";

  const formData = await request.formData();
  const domain = String(formData.get("shop") || "").trim();

  if (!domain) {
    return json({ error: "Please enter a domain", success: false }, { status: 400 });
  }

  const userIdString = String(userId);

  try {
    console.log("Domain:", domain, "Type:", typeof domain);
    console.log("UserId:", userIdString, "Type:", typeof userIdString);

    const checkData = await checkDomainExists(userIdString, domain);
    console.log("Site exists response:", checkData);

    const exists = checkData.exists;

    const existingUser = await db.captain.findUnique({
      where: {
        userId: userIdString,
      },
    });

    console.log("existingUser", existingUser)

    if (exists && existingUser) {
      const url = new URL(request.url);
      const redirectUrl = `${url.origin}${url.pathname}?shop=${encodeURIComponent(domain)}`;
      return redirect(redirectUrl);
    } else {
      const createData = await createVerifiedDomain({
        domain: domain,
        userId: userIdString,
        verified: true,
      });

      console.log("object", userIdString)

      await db.captain.upsert({
        where: {
          domain: domain,
        },
        update: {
          email: String(email ?? "").trim(),
          accessToken: String(createData.bannerToken ?? "").trim(),
          scannerId: String(createData.scannerId ?? "").trim(),
          createDate: new Date(),
        },
        create: {
          userId: userIdString,
          domain,
          email: String(email ?? "").trim(),
          accessToken: String(createData.bannerToken ?? "").trim(),
          scannerId: String(createData.scannerId ?? "").trim(),
          createDate: new Date(),
        },
      });

      const url = new URL(request.url);
      const redirectUrl = `${url.origin}${url.pathname}?shop=${encodeURIComponent(domain)}`;
      return redirect(redirectUrl);

    }

  } catch (err) {
    console.error("Error processing domain:", err);
    return json({
      error: err instanceof Error ? err.message : "Failed to process domain",
      success: false,
    }, { status: 500 });
  }
};

export default function App() {
  const { showForm, userId, email } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();

  const isSubmitting = navigation.state === "submitting";

  return (
    <div className={styles.page}>
  
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          <div className={styles.logo}>
            <img src={logo} alt="Logo" className={styles.logoImage} />
          
          </div>
        </div>
      </header>
      <div className={styles.index}>

        <div className={styles.content}>
          <h1 className={styles.heading}>Check and Create Site if Not Found</h1>
          <p className={styles.text}>This feature checks if a website already exists using the given Shopify domain and user ID.
            If the site doesn't exist, it automatically creates a new one with the same details.</p>

          {showForm && (
            <Form className={styles.form} method="post">
              <label className={styles.label}>
                <span className={styles.span}>Shop domain</span>
                <input
                  className={styles.input}
                  type="text"
                  name="shop"
                  placeholder="e.g: my-shop-domain.myshopify.com"
                  disabled={isSubmitting}
                  required
                />
                <span className={styles.span}>e.g: my-shop-domain.myshopify.com</span>
              </label>

              <button
                type="submit"
                disabled={isSubmitting}
                className={styles.button}
              >
                {isSubmitting ? "Processing..." : "Process Domain"}
              </button>
            </Form>
          )}

          {actionData?.error && (
            <div style={{
              color: "red",
              margin: "10px 0",
              padding: "10px",
              backgroundColor: "#f8d7da",
              borderRadius: "4px"
            }}>
              Error: {actionData.error}
            </div>
          )}

          {isSubmitting && (
            <div style={{
              margin: "10px 0",
              padding: "10px",
              backgroundColor: "#e7f3ff",
              color: "#0066cc",
              borderRadius: "4px",
              fontWeight: "bold"
            }}>
              Processing domain...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
