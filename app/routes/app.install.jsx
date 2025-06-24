import {
  Card,
  BlockStack,
  Text,
  Page,
  Layout,
  Button,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useState } from "react";

export default function InstallPage() {
  const [embedEnabled, setEmbedEnabled] = useState(false);

  const toggleEmbed = () => {
    // TODO: Connect this to backend logic or metafield toggle
    setEmbedEnabled((prev) => !prev);
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
                This embed injects your storefront script file: <strong><code>app.js</code></strong>. 
                You can enable or disable it below.
              </Text>

              <div style={{ maxWidth: "200px" }}>
                <Button 
                  onClick={toggleEmbed} 
                  variant={embedEnabled ? "secondary" : "primary"} 
                  fullWidth
                  size="slim"
                >
                  {embedEnabled ? "Disable App Embed" : "Enable App Embed"}
                </Button>
              </div>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
