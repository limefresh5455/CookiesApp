import {
  Page,
  Card,
  Text,
  Button,
  Layout,
  BlockStack,
  Frame,
} from '@shopify/polaris';
import { TitleBar } from "@shopify/app-bridge-react";
import { useLoaderData } from "@remix-run/react";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";

// Loader with proper type
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;

  const apiKey = process.env.SHOPIFY_API_KEY || "";
  return json({ shop, apiKey });
};

export default function CookieTable() {
  const { shop, apiKey } = useLoaderData<{ shop: string; apiKey: string }>();

  const openThemeEditor = () => {
    const url = `https://${shop}/admin/themes/current/editor?context=apps&activateAppId=${apiKey}/delete-cookies`;
    window.open(url, "_blank");
  };

  return (
    <Frame>
      <Page>
        <TitleBar title="Remove Cookies" />
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="300">
                <Text as="h2" variant="headingMd">
                  Delete Cookies Code
                </Text>
                <Text as="p" variant="bodyMd">
                  This embed injects your storefront script file:{" "}
                  <strong>
                    <code>delete-cookies.js</code>
                  </strong>
                  . You can enable or disable it below.
                </Text>

                <div style={{ maxWidth: "200px" }}>
                  <Button variant="primary" onClick={openThemeEditor}>
                    Go to Theme Editor
                  </Button>
                </div>
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    </Frame>
  );
}
