import React, { useState } from "react"; 
import {
  Card,
  BlockStack,
  InlineStack,
  TextField,
  Text,
  Page,
  Layout,
  Button,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { Form, useLoaderData, useNavigation, useActionData } from "@remix-run/react";
import path from "path";
import { writeFile } from "fs/promises";
import { json } from "@remix-run/node";
import pkg from "../../package.json";
import db from "../db.server";
import { Copy } from "lucide-react";
import { authenticate } from "../shopify.server";


export const loader = async (args) => {
  const { session } = await authenticate.admin(args.request);
  const shop = session.shop;

  const apiKey = process.env.SHOPIFY_API_KEY;
  const existing = await db.captain.findFirst({ where: { domain: shop } });
  return json({
    shop,
    existingScript: existing?.scriptLink || null,
    existingName: existing?.scriptName || null,
    apiKey,
  });
};


// export const getClerkId = async () => {
//   const email = 'test@gmail.com';
//   const phone = "+91 1234567884"; // or use formData.get("phone");

//   if (!email || !phone) {
//     return json({ error: "Email and phone are required" }, { status: 400 });
//   }

//   const headers = {
//     accept: "application/json",
//     "Content-Type": "application/json",
//     Authorization: "Bearer sk_test_0WRJUtOd3xWECBqQwyeHoSeNEvVKd5bd2QqK24Ifxz",
//   };

//   const body = JSON.stringify({
//     email_address: [email],
//     phone_number: [phone],
//     skip_password_checks: true,
//     skip_password_requirement: true,
//   });

//   try {
//     const response = await fetch("https://api.clerk.com/v1/users", {
//       method: "POST",
//       headers,
//       body,
//     });

//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error("❌ Clerk API error:", errorText);
//       return json({ error: "Failed to create Clerk user" }, { status: 500 });
//     }

//     const result = await response.json();

//     return json({
//       clerkId: result.id,
//     });
//   } catch (err) {
//     console.error("❌ Fetch failed:", err);
//     return json({ error: "Network error or Clerk unreachable" }, { status: 500 });
//   }
// }


export const action = async (args) => {
  
  const formData = await args.request.formData();
  const actionType = formData.get("actionType");

  const {session} = await authenticate.admin(args.request);
  console.log("dataAuth", session)
  const shop = session.shop;

// if (actionType === "clerk") {
//   const email = formData.get("email");
//   const phone = "1234567884"; // or use formData.get("phone");

//   if (!email || !phone) {
//     return json({ error: "Email and phone are required" }, { status: 400 });
//   }

//   const headers = {
//     accept: "application/json",
//     "Content-Type": "application/json",
//     Authorization: "Bearer sk_test_0WRJUtOd3xWECBqQwyeHoSeNEvVKd5bd2QqK24Ifxz",
//   };

//   const body = JSON.stringify({
//     email_address: [email],
//     phone_number: [phone],
//     skip_password_checks: true,
//     skip_password_requirement: true,
//   });

//   try {
//     const response = await fetch("https://api.clerk.com/v1/users", {
//       method: "POST",
//       headers,
//       body,
//     });

//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error("❌ Clerk API error:", errorText);
//       return json({ error: "Failed to create Clerk user" }, { status: 500 });
//     }

//     const result = await response.json();

//     return json({
//       email: result.email_addresses?.[0]?.email_address,
//       phone: result.phone_numbers?.[0]?.phone_number,
//       clerkId: result.id,
//     });
//   } catch (err) {
//     console.error("❌ Fetch failed:", err);
//     return json({ error: "Network error or Clerk unreachable" }, { status: 500 });
//   }
// }

  if (actionType === "script") {
  const EXTENSION_UUID = process.env.EXTENSION_UUID;
  const EXTENSION_VERSION = pkg.version;

  const existingUser = await db.captain.findFirst({
    where: {
      domain: shop,
    },
  });

  const accessToken = existingUser.accessToken;
  const storeSlug = shop.replace(".myshopify.com", "");
  const scriptFilename = `${storeSlug}-script.js`; // ✅ define filename

  const response = await fetch(`${process.env.VITE_API_URL}/banner/script?accessToken=${accessToken}`, {
    method: "GET",
    headers: {
      accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Response("Failed to fetch script", { status: 500 });
  }
  const data = await response.text();
  const filePath = path.resolve(`extensions/cookies/assets/${scriptFilename}`);

  try {
    await writeFile(filePath, data, "utf8");
    console.log("✅ Script saved to extension folder:", shop);


    await db.captain.update({
      where: {
        domain: shop,
      },
      data: {
        scriptName: scriptFilename,
        scriptLink: `https://cdn.shopify.com/extensions/${EXTENSION_UUID}/${EXTENSION_VERSION}/assets/${scriptFilename}?v=${Date.now()}`
      }
    });
    
    // ✅ Send script content and file name to frontend
    return json({
      script: data,
      filename: scriptFilename,
      timestamp: Date.now(),
      uuid: EXTENSION_UUID,
      version: EXTENSION_VERSION,
      shopName: shop,
      apiKey: apiKey,
    });
  } catch (err) {
    console.error("❌ Failed to write file:", err);
    return new Response("Failed to write script file", { status: 500 });
  }
  }
};


export default function InstallPage() {
  const { shop, existingScript, apiKey,existingName } = useLoaderData();
  const navigation = useNavigation();
  const loading = navigation.state === "submitting";
  const actionData = useActionData();
  const script = actionData?.script;
  const filename = actionData?.filename;
  const timestamp = actionData?.timestamp;
  const uuid = actionData?.uuid;
  const version = actionData?.version;


  const cdnUrl = filename
    ? `https://cdn.shopify.com/extensions/${uuid}/${version}/assets/${filename}?v=${timestamp}`
    : existingScript || null;
  
  // const [email, setEmail] = useState("");
  
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`<script src="${cdnUrl}"></script>`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const openThemeEditor = () => {
    const url = `https://${shop}/admin/themes/current/editor?context=apps&activateAppId=${apiKey}/cookies`;
    window.open(url, "_blank");
  };
  console.log('filename', filename);
  return (
    <Page>
      <TitleBar title="Install" />
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="300">
              <Text as="h2" variant="headingMd">
                App Embed Configuration
              </Text>

              <Text as="p" variant="bodyMd">
                This embed injects your storefront script file:{" "}
                <strong>
                  <code>{script || existingScript ? existingName : "app.js"}</code>
                </strong>
                . You can enable or disable it below.
              </Text>

              <div style={{ maxWidth: "200px" }}>            
                <Form method="post">
                  <input type="hidden" name="actionType" value="script" />
                  <Button
                    submit
                    variant="primary"
                    fullWidth
                    size="slim"
                    loading={loading}
                    disabled={loading || Boolean(existingScript)}
                  >
                    Generate Script
                  </Button>
                </Form>
              </div>
            </BlockStack>
          </Card>
        </Layout.Section>

        {(script || existingScript) && (
  <Layout.Section>
    <Card>
      <BlockStack gap="200">
        <Text as="h2" variant="headingSm">
          Generated Script
        </Text>

        {(cdnUrl || existingScript) && (
              <>
                <InlineStack align="space-between" blockAlign="center">
                  <Text as="p" variant="bodySm">
                    CDN Script Tag:
                  </Text>
                  <InlineStack gap="200">
                    <Button
                      onClick={handleCopy}
                      size="slim"
                      icon={copied ? undefined : <Copy size={14} />}
                    >
                      {copied ? "Copied!" : "Copy"}
                    </Button>
                    <Button variant="primary" onClick={openThemeEditor}>
                      Go to Theme Editor
                    </Button>
                  </InlineStack>
                </InlineStack>
                <div
                  style={{
                    background: "#f6f6f7",
                    padding: "12px",
                    borderRadius: "8px",
                    fontFamily: "monospace",
                    fontSize: "12px",
                    marginTop: "8px",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {`<script src="${cdnUrl || existingScript}"></script>`}
                </div>
              </>
            )}
          </BlockStack>
        </Card>
      </Layout.Section>
    )}

        {/*<Layout.Section>
           <Card>
            <BlockStack gap="300">
              <Text as="h2" variant="headingMd">
                Create Clerk User
              </Text>

              <Form method="post">
                <input type="hidden" name="actionType" value="clerk" />
                <BlockStack gap="200" align="space-between" blockAlign="center">
                  <TextField
                    label="Email"
                    name="email"
                    value={email}
                    onChange={setEmail}
                    autoComplete="off"
                  />
                    <Button submit>
                      Get Clerk ID
                    </Button>
                </BlockStack>
              </Form>

              {actionData?.clerkId && (
                <BlockStack gap="100">
                  <Text as="p">
                    ✅ Clerk ID: <strong>{actionData.clerkId}</strong>
                  </Text>
                  <Text as="p">
                    📧 Email: <strong>{actionData.email}</strong>
                  </Text>
                </BlockStack>
              )}
            </BlockStack>
          </Card> 
        </Layout.Section>*/}

      </Layout>
    </Page>
  );
}
