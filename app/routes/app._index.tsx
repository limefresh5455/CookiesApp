import {
  Page,
  Layout,
  BlockStack,
  Text,
  Card,
  Box,
  Grid,
  Button,
  InlineStack,
  Icon,
  ButtonGroup,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useLoaderData } from "@remix-run/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";


import {
  AppsIcon,            
  CalendarIcon,        
  CheckCircleIcon,     
  MinusCircleIcon,     
  XCircleIcon,         
  QuestionCircleIcon, 
  LinkIcon,            
  NoteIcon,            
  PageIcon,            
} from '@shopify/polaris-icons';
import db from "../db.server";
import { getClerkId, createVerifiedDomain } from "../services/captainApi";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;
  const shopID = session.id;

  const existingEmail:any = await db.session.findFirst({
    where: { id: shopID },
  });
 
  if (existingEmail.email == null) {
    const accessToken = session.accessToken;
    const response = await fetch(`https://${shop}/admin/api/2024-01/graphql.json`, {
      method: "POST",
      headers: {
        "X-Shopify-Access-Token": accessToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          query {
            shop {
              email
            }
          }
        `,
      }),
    });

    if (!response.ok) {
      console.error("Shopify email fetch failed");
      return new Response("Failed to get store email", { status: 500 });
    }

    const result = await response.json();

    const email = result?.data?.shop?.email;
    const name = result?.data?.shop?.shopOwnerName;

    if (!email) {
      return new Response("Email not found", { status: 400 });
    }
    // 🔹 2. Update in your custom `Captain` session table
    await db.session.update({
      where: { id: shopID }, // make sure this is unique or indexed
      data: {
        email: email,
        firstName: name,
      },
    });
  }else{
    const existingCaptian:any = await db.captain.findFirst({
      where: { domain: shop },
    });


    if(!existingCaptian){
      const userData = await getClerkId(existingEmail.email);
      console.log(userData);

      const createData = await createVerifiedDomain({
        domain: shop,
        userId: userData.clerkId,
        verified: true,
      });

      await db.captain.upsert({
        where: {
          userId: userData.clerkId,
        },
        update: {
          domain: shop,
          email:  String(existingEmail.email ?? "").trim(), 
          accessToken: String(createData.bannerToken ?? "").trim(),
          scannerId: String(createData.scannerId ?? "").trim(),
          createDate: new Date(),
        },
        create: {
          userId: userData.clerkId,
          domain: shop,
          email:  String(existingEmail.email ?? "").trim(), 
          accessToken: String(createData.bannerToken ?? "").trim(),
          scannerId: String(createData.scannerId ?? "").trim(),
          createDate: new Date(),
        },
      });
    }
  }
  return new Response("Email updated successfully");
};

export default function DashboardPage() {

  useLoaderData();

  // Mock data for the dashboard (replace with actual data fetching logic)
  const dashboardData = {
    consentStatus: {
      allowed: { count: 120, fromLastWeek: 10, trend: 'up' as 'up' | 'down' | 'flat' },
      partiallyAllowed: { count: 30, fromLastWeek: 5, trend: 'flat' as 'up' | 'down' | 'flat' },
      rejected: { count: 15, fromLastWeek: 2, trend: 'down' as 'up' | 'down' | 'flat' },
      noActivity: { count: 5, fromLastWeek: 0, trend: 'flat' as 'up' | 'down' | 'flat' },
    },
    metrics: {
      totalUsersThisWeek: 1500,
      totalViewsThisWeek: 7500,
    },
    summary: {
      domains: 1,
      reports: 75,
      banners: 1,
      pages: 1,
    },
  };

  const renderTrendIcon = (trend: 'up' | 'down' | 'flat') => {
    // For visual trend indicators, you might want to import specific arrow icons:
    // import { ArrowUpIcon, ArrowDownIcon } from '@shopify/polaris-icons';
    switch (trend) {
      case 'up':
        return <Text as="span" tone="success" visuallyHidden>Up</Text>; // Consider using <Icon source={ArrowUpIcon} />
      case 'down':
        return <Text as="span" tone="critical" visuallyHidden>Down</Text>; // Consider using <Icon source={ArrowDownIcon} />
      case 'flat':
        return <Text as="span" tone="subdued" visuallyHidden>No change</Text>;
      default:
        return null;
    }
  };

  return (
    <Page fullWidth>
      <TitleBar title="Dashboard" />

      <BlockStack gap="600">
        <InlineStack align="end" gap="200">
          <ButtonGroup>
            <Button pressed>Week</Button>
            <Button>Month</Button>
            <Button>Year</Button>
          </ButtonGroup>
          {/* Using the confirmed CalendarIcon */}
          <Button icon={CalendarIcon} accessibilityLabel="Select date range" />
        </InlineStack>

        <Grid>
          <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 9, xl: 9 }}>
            <BlockStack gap="500">
              <Grid>
                {/* Allowed Card */}
                <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3, xl: 3 }}>
                  <Card>
                    <BlockStack gap="100">
                      <InlineStack align="space-between">
                        <Text as="h3" variant="headingMd">Allowed</Text>
                        <Text as="span">
                          <Icon source={CheckCircleIcon} accessibilityLabel="Allowed" />
                        </Text>
                      </InlineStack>
                      <Text as="p" variant="heading2xl">{dashboardData.consentStatus.allowed.count}</Text>
                      <Text as="p" variant="bodySm" tone="subdued">
                        +{dashboardData.consentStatus.allowed.fromLastWeek} from last week {renderTrendIcon(dashboardData.consentStatus.allowed.trend)}
                      </Text>
                    </BlockStack>
                  </Card>
                </Grid.Cell>


                {/* Partially Allowed Card */}
                <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3, xl: 3 }}>
                  <Card>
                    <BlockStack gap="100">
                      <InlineStack align="space-between">
                        <Text as="h3" variant="headingMd">Partially Allowed</Text>
                        <Text as="span">
                          <Icon source={MinusCircleIcon} accessibilityLabel="Partially allowed" />
                        </Text>
                      </InlineStack>
                      <Text as="p" variant="heading2xl">{dashboardData.consentStatus.partiallyAllowed.count}</Text>
                      <Text as="p" variant="bodySm" tone="subdued">
                        +{dashboardData.consentStatus.partiallyAllowed.fromLastWeek} from last week {renderTrendIcon(dashboardData.consentStatus.partiallyAllowed.trend)}
                      </Text>
                    </BlockStack>
                  </Card>
                </Grid.Cell>

                {/* Rejected Card */}
                <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3, xl: 3 }}>
                  <Card>
                    <BlockStack gap="100">
                      <InlineStack align="space-between">
                        <Text as="h3" variant="headingMd">Rejected</Text>
                        <Text as="span">
                          <Icon source={XCircleIcon} accessibilityLabel="Rejected" />
                        </Text>
                      </InlineStack>
                      <Text as="p" variant="heading2xl">{dashboardData.consentStatus.rejected.count}</Text>
                      <Text as="p" variant="bodySm" tone="subdued">
                        + {dashboardData.consentStatus.rejected.fromLastWeek} from last week {renderTrendIcon(dashboardData.consentStatus.rejected.trend)}
                      </Text>
                    </BlockStack>
                  </Card>
                </Grid.Cell>

                {/* No Activity Card */}
                <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3, xl: 3 }}>
                  <Card>
                    <BlockStack gap="100">
                      <InlineStack align="space-between">
                        <Text as="h3" variant="headingMd">No Activity</Text>
                        <Text as="span">
                           <Icon source={QuestionCircleIcon} accessibilityLabel="No activity" />
                        </Text>
                      </InlineStack>
                      <Text as="p" variant="heading2xl">{dashboardData.consentStatus.noActivity.count}</Text>
                      <Text as="p" variant="bodySm" tone="subdued">
                        + {dashboardData.consentStatus.noActivity.fromLastWeek} from last week {renderTrendIcon(dashboardData.consentStatus.noActivity.trend)}
                      </Text>
                    </BlockStack>
                  </Card>
                </Grid.Cell>
              </Grid>

              {/* Total Users and Total Views Cards */}
              <Grid>
                <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
                  <Card>
                    <BlockStack gap="200">
                      <Text as="h3" variant="headingMd">Total Users this week</Text>
                      <Text as="p" variant="heading3xl">{dashboardData.metrics.totalUsersThisWeek.toLocaleString()}</Text>
                      <Text as="p" variant="bodySm" tone="subdued">Number of users who have interacted</Text>
                    </BlockStack>
                  </Card>
                </Grid.Cell>
                <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
                  <Card>
                    <BlockStack gap="200">
                      <Text as="h3" variant="headingMd">Total Views this week</Text>
                      <Text as="p" variant="heading3xl">{dashboardData.metrics.totalViewsThisWeek.toLocaleString()}</Text>
                      <Text as="p" variant="bodySm" tone="subdued">last week</Text>
                    </BlockStack>
                  </Card>
                </Grid.Cell>
              </Grid>

              {/* Users/Week Chart Placeholder */}
              <Card>
                <BlockStack gap="200">
                  <Text as="h3" variant="headingMd">USERS/WEEK</Text>
                  <Box minHeight="250px" borderRadius="100" padding="400">
                    <Text alignment="center" as="p" tone="subdued">
                      [Placeholder for Users/Week Chart]
                      <br />
                      <br />
                      This chart would dynamically display user interaction trends over time.
                      <br />
                      (Requires backend analytics data integration)
                    </Text>
                  </Box>
                </BlockStack>
              </Card>
            </BlockStack>
          </Grid.Cell>

          {/* Summary Cards */}
          <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 4, lg: 3, xl: 3 }}>
            <BlockStack gap="500">
              {/* Domains Card */}
              <Card>
                <BlockStack gap="200">
                  <InlineStack align="start" gap="200">
                    <Text as="span">
                      <Icon source={LinkIcon} accessibilityLabel="Domains" />
                    </Text>
                    <BlockStack gap="200">
                      <Text as="h3" variant="headingMd">Domains</Text>
                      <Text as="p" variant="heading2xl" alignment="start">{dashboardData.summary.domains}</Text>
                    </BlockStack>
                  </InlineStack>
                </BlockStack>
              </Card>

              {/* Reports Card */}
              <Card>
                <BlockStack gap="200">
                  <InlineStack align="start" gap="200">
                    <Text as="span">
                      <Icon source={NoteIcon} accessibilityLabel="Reports" />
                    </Text>
                    <BlockStack gap="200">
                      <Text as="h3" variant="headingMd">Reports</Text>
                      <Text as="p" variant="heading2xl">{dashboardData.summary.reports}</Text>
                    </BlockStack>
                  </InlineStack>
                </BlockStack>
              </Card>

              {/* Banners Card */}
              <Card>
                <BlockStack gap="200">
                  <InlineStack align="start" gap="200">
                    <Text as="span">
                      <Icon source={AppsIcon} accessibilityLabel="Banners" />
                    </Text>
                    <BlockStack gap="200">
                      <Text as="h3" variant="headingMd">Banners</Text>
                      <Text as="p" variant="heading2xl">{dashboardData.summary.banners}</Text>
                    </BlockStack>
                  </InlineStack>
                </BlockStack>
              </Card>

              {/* Pages Card */}
              <Card>
                <BlockStack gap="200">
                  <InlineStack align="start" gap="200">
                    <Text as="span">
                      <Icon source={PageIcon} accessibilityLabel="Pages" />
                    </Text>
                    <BlockStack gap="200">
                      <Text as="h3" variant="headingMd">Pages</Text>
                      <Text as="p" variant="heading2xl">{dashboardData.summary.pages}</Text>
                    </BlockStack>
                  </InlineStack>
                </BlockStack>
              </Card>
            </BlockStack>
          </Grid.Cell>
        </Grid>
      </BlockStack>
    </Page>
  );
}