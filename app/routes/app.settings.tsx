import {
  Card,
  FormLayout,
  TextField,
  Button,
  BlockStack,
  Text,
  ChoiceList,
  Checkbox,
  InlineStack,
  Box,
  Page,
  Layout,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import React, { useState, useCallback } from "react";

// Define the type for your settings data
type AppSettings = {
  cookieBannerEnabled: boolean;
  cookieConsentLifetimeDays: string;
  trackingScriptEnabled: boolean;
  excludedPages: string; // Comma-separated list of paths
  consentCategories: string[]; // e.g., ['essential', 'analytics', 'marketing']
};

export default function SettingsPage() {
  // Initialize state with default settings (these won't persist without a backend)
  const [settings, setSettings] = useState<AppSettings>({
    cookieBannerEnabled: true,
    cookieConsentLifetimeDays: "365",
    trackingScriptEnabled: true,
    excludedPages: "/admin, /account",
    consentCategories: ["essential", "analytics"], // Default categories
  });
  const [isSaving, setIsSaving] = useState(false); // State to manage saving status

  const handleChange = useCallback(
    <T extends keyof AppSettings>(key: T, value: AppSettings[T]) => {
      setSettings((prevSettings) => ({
        ...prevSettings,
        [key]: value,
      }));
    },
    []
  );

  const handleConsentCategoryChange = useCallback(
    (value: string[]) => {
      setSettings((prevSettings) => ({
        ...prevSettings,
        consentCategories: value,
      }));
    },
    []
  );

  const handleSubmit = useCallback(async () => {
    setIsSaving(true);
    // Simulate a save operation with a delay
    console.log("Simulating save of settings (frontend only):", settings);
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API call delay
    setIsSaving(false);
    alert("Settings saved! (Frontend only - not persisted)"); // Simple browser alert
    // In a real app, you'd use a Polaris Toast for better UX
  }, [settings]);

  return (
    <Page>
      <TitleBar title="App Settings" />
      <Layout>
        <Layout.Section>
          <BlockStack gap="500">
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">
                  General App Settings
                </Text>
                <FormLayout>
                  <Checkbox
                    label="Enable Cookie Consent Banner"
                    checked={settings.cookieBannerEnabled}
                    onChange={(checked) => handleChange("cookieBannerEnabled", checked)}
                    helpText="Display a consent banner to visitors on your storefront."
                  />
                  <TextField
                    label="Cookie Consent Lifetime (Days)"
                    value={settings.cookieConsentLifetimeDays}
                    onChange={(value) => handleChange("cookieConsentLifetimeDays", value)}
                    type="number"
                    min="1"
                    max="365"
                    autoComplete="off" // <--- ADDED THIS LINE
                    helpText="How long user consent preferences are stored (e.g., 365 for one year)."
                  />
                  <Checkbox
                    label="Enable Tracking Script"
                    checked={settings.trackingScriptEnabled}
                    onChange={(checked) => handleChange("trackingScriptEnabled", checked)}
                    helpText="Inject your app's tracking and consent enforcement script into the storefront."
                  />
                  <TextField
                    label="Exclude Pages from Cookie Banner"
                    value={settings.excludedPages}
                    onChange={(value) => handleChange("excludedPages", value)}
                    autoComplete="off" // <--- THIS WAS ALREADY CORRECT, JUST CONFIRMING
                    helpText="Comma-separated list of relative paths (e.g., /pages/privacy-policy, /checkout)."
                  />
                </FormLayout>
              </BlockStack>
            </Card>

            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">
                  Consent Categories
                </Text>
                <Text as="p" tone="subdued">
                  Define the categories of cookies your app uses, allowing customers to give granular consent.
                </Text>
                <ChoiceList
                  title="Active Consent Categories"
                  choices={[
                    { label: "Essential (Always Active)", value: "essential", disabled: true },
                    { label: "Analytics Cookies", value: "analytics", helpText: "Collect anonymous data on website usage." },
                    { label: "Marketing Cookies", value: "marketing", helpText: "Track user activity for advertising purposes." },
                    { label: "Preference Cookies", value: "preference", helpText: "Remember user preferences and settings." },
                  ]}
                  selected={settings.consentCategories}
                  onChange={handleConsentCategoryChange}
                  allowMultiple
                />
              </BlockStack>
            </Card>

            <InlineStack align="end">
              <Button onClick={handleSubmit} loading={isSaving}>
                Save Settings
              </Button>
            </InlineStack>

            <Box paddingBlockStart="500">
              <Card>
                <BlockStack gap="200">
                  <Text as="h3" variant="headingSm">
                    Frontend Only - Data Not Persisted
                  </Text>
                  <Text as="p" tone="subdued">
                    These settings are managed only in the browser's memory.
                    They will reset if you refresh the page.
                    To make them persistent, you would need to implement Remix `loader`
                    and `action` functions to save/load data from a backend database.
                  </Text>
                </BlockStack>
              </Card>
            </Box>
          </BlockStack>
        </Layout.Section>
      </Layout>
    </Page>
  );
}