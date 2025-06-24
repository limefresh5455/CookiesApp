import {
  Card,
  BlockStack,
  Text,
  Page,
  Layout,
  Button,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { Form, useNavigation } from "@remix-run/react";
import path from "path";
import { writeFile } from "fs/promises";
import db from "../db.server";



export const action = async (args) => {
  const url = new URL(args.request.url);
  const shop = url.searchParams.get("shop");

  
  const existingUser = await db.captain.findFirst({
      where: {
        domain: shop,
      },
    });
  
  // Fetch the script from the external API
  const accessToken = existingUser.accessToken
  const storeSlug = shop.replace(".myshopify.com", "");

  const response = await fetch("https://api-dev.cptn.co/banner/script?accessToken="+accessToken, {
    method: "GET",
    headers: {
      accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Response("Failed to fetch script", { status: 500 });
  }

  const data = await response.text();
  const filePath = path.resolve(`extensions/cookies/assets/${storeSlug}-script.js`);

  try {
    await writeFile(filePath, data, "utf8");
    console.log("✅ Script saved to extension folder:", filePath);
    return new Response("Script saved successfully", { status: 200 });
  } catch (err) {
    console.error("❌ Failed to write file:", err);
    return new Response("Failed to write script file", { status: 500 });
  }

};


export default function InstallPage() {
  const navigation = useNavigation();
  const loading = navigation.state === "submitting";

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
                {/* Toggle embed logic */}
                
              </div>

              <div style={{ maxWidth: "200px" }}>
                {/* Generate script via action */}
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
      </Layout>
    </Page>
  );
}