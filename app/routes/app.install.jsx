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
import { Form, useNavigation, useActionData } from "@remix-run/react";
import path from "path";
import { writeFile } from "fs/promises";
import { json } from "@remix-run/node"; // ✅ add this
import pkg from "../../package.json";
import db from "../db.server";
import { Copy } from "lucide-react";


export const action = async (args) => {
  const EXTENSION_UUID = process.env.EXTENSION_UUID;
  const url = new URL(args.request.url);
  const shop = url.searchParams.get("shop");
  const EXTENSION_VERSION = pkg.version;

  const existingUser = await db.captain.findFirst({
    where: {
      domain: shop,
    },
  });

  const accessToken = existingUser.accessToken;
  const storeSlug = shop.replace(".myshopify.com", "");
  const scriptFilename = `${storeSlug}-script.js`; // ✅ define filename

  const response = await fetch(`https://api-dev.cptn.co/banner/script?accessToken=${accessToken}`, {
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
    console.log("✅ Script saved to extension folder:", filePath);

    // ✅ Send script content and file name to frontend
    return json({
      script: data,
      filename: scriptFilename,
      timestamp: Date.now(),
      uuid: EXTENSION_UUID,
      version: EXTENSION_VERSION,
    });
  } catch (err) {
    console.error("❌ Failed to write file:", err);
    return new Response("Failed to write script file", { status: 500 });
  }

};


export default function InstallPage() {
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
    : null;
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`<script src="${cdnUrl}"></script>`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
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
                  <code>app.js</code>
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
                  >
                    Generate Script
                  </Button>
                </Form>
              </div>
            </BlockStack>
          </Card>
        </Layout.Section>

        <Layout.Section>
          {script && (
            <Card>
              <BlockStack gap="200">
                <Text as="h2" variant="headingSm">
                  Generated Script
                </Text>

                {cdnUrl && (
                  <>
                    <InlineStack align="space-between" blockAlign="center">
                      <Text as="p" variant="bodySm">
                        CDN Script Tag:
                      </Text>

                      <Button
                        onClick={handleCopy}
                        size="slim"
                        icon={copied ? undefined : <Copy size={14} />}
                      >
                        {copied ? "Copied!" : "Copy"}
                      </Button>
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
                      {`<script src="${cdnUrl}"></script>`}
                    </div>
                  </>
                )}
              </BlockStack>
            </Card>
          )}
        </Layout.Section>
      </Layout>
    </Page>
  );
}
