import React, { useState } from "react"; 
import {
  Card,
  BlockStack,
  InlineStack,
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
import { getScript } from "../services/captainApi";


  export const loader = async (args) => {
    const { session } = await authenticate.admin(args.request);
    const shop = session.shop;
    const apiKey = process.env.SHOPIFY_API_KEY || "";
    const openEditor = `https://${shop}/admin/themes/current/editor?context=apps&activateAppId=${apiKey}/cookies`;

    const existing = await db.captain.findFirst({ where: { domain: shop } });
    return json({
      existingScript: existing?.scriptLink || null,
      existingName: existing?.scriptName || null,
      openEditor,
    });
  };


  export const action = async (args) => {
    const {session} = await authenticate.admin(args.request);
    const shop = session.shop;
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


    try {
        const data = await getScript(accessToken);
        const filePath = path.resolve(`extensions/cookies/assets/${scriptFilename}`);
        const date = Date.now()

        await writeFile(filePath, data, "utf8");

        const scriptLink = `https://cdn.shopify.com/extensions/${EXTENSION_UUID}/${EXTENSION_VERSION}/assets/${scriptFilename}?v=${date}`;

        await db.captain.update({
          where: {
            domain: shop,
          },
          data: {
            scriptName: scriptFilename,
            scriptLink: scriptLink,
          }
        });
        
        // ✅ Send script content and file name to frontend
        return json({
          script: data,
          filename: scriptFilename,
          scriptLink,
          shopName: shop,
          apiKey: apiKey,
        });
      } catch (err) {
        console.error("❌ Failed to write file:", err);
        return new Response("Failed to write script file", { status: 500 });
      }
  };


export default function InstallPage() {
  const { existingScript, openEditor,existingName } = useLoaderData();
  const navigation = useNavigation();
  const loading = navigation.state === "submitting";
  const actionData = useActionData();
  const script = actionData?.script;
  const filename = actionData?.filename;
  const extensionLink = actionData?.scriptLink;
  const cdnUrl = filename ? extensionLink : existingScript || null;
  const [copied, setCopied] = useState(false);


  const handleCopy = () => {
    navigator.clipboard.writeText(`<script src="${cdnUrl}"></script>`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const openThemeEditor = () => {
    const url = openEditor;
    window.open(url, "_blank");
  };

  return (
    <Page>
      <TitleBar title="Installation Script" />
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
      </Layout>
    </Page>
  );
}
