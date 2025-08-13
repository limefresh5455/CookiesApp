import {
  Page,
  BlockStack,
  Text,
  Card,
  Grid,
  Button,
  InlineStack,
  Icon,
  ButtonGroup,
} from "@shopify/polaris";
import {
  CheckCircleIcon,
  MinusCircleIcon,
  XCircleIcon,
  QuestionCircleIcon
} from '@shopify/polaris-icons';
import { TitleBar } from "@shopify/app-bridge-react";
import { useLoaderData } from "@remix-run/react";
import type { json, LoaderFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import db from "../db.server";
import { statusCounts, userCounts, viewCounts } from "../services/captainApi";
import { createCaptainIfNotExists, handleAnalytics } from "../services/fetchShopData";
import { useState } from "react";

// Define the loader data type
interface LoaderData {
  consentStatus: {
    ALLOWED: number;
    NO_ACTIVITY: number;
    PARTIALLY_ALLOWED: number;
    REJECTED: number;
  };
  metrics: {
    totalUsersThisWeek: number;
    totalViewsThisWeek: number;
  };
  userId: string;
  scannerId: string;
  error?: string;
}



export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session, admin } = await authenticate.admin(request);
  const shop = session.shop;
  const shopID = session.id;

  const existingEmail: any = await db.session.findFirst({
    where: { id: shopID },
  });

  const existingStatusData: any = await db.captain.findFirst({
    where: { domain: shop },
  });

    if (existingEmail.email == null) {
      const response = await admin.graphql(`
        query {
          shop {
            email
            shopOwnerName
            billingAddress {
              phone
            }
          }
        }
      `);
      if (!response.ok) {
        console.error("Shopify email fetch failed");
        return new Response("Failed to get store email", { status: 500 });
      }

      const result = await response.json();
      const shopData = result?.data?.shop;

      if (!shopData || !shopData.email || !shopData.shopOwnerName) {
        return new Response("Email or shop owner name not found", { status: 400 });
      }

        const email = shopData.email.trim();
        const name = shopData.shopOwnerName.trim();
        const billingPhone = shopData?.billingAddress?.phone;

         // 🔹 2. Update in your custom `Captain` session table
        await db.session.update({
          where: { id: shopID }, // make sure this is unique or indexed
          data: {
            email: email,
            firstName: name,
          },
        });
       
        await createCaptainIfNotExists(
          existingStatusData,
          shop,
          email,
          billingPhone || null,
          name,
          db
        );

        
        const responseData = await handleAnalytics(existingStatusData, db, shop);

        if(responseData instanceof Response) {
          return responseData;
        }
    } else {
    
      const response = await admin.graphql(`
        query {
          shop {
            shopOwnerName
            billingAddress {
              phone
            }
          }
        }
      `);
      if (!response.ok) {
        console.error("Shopify email fetch failed");
        return new Response("Failed to get store email", { status: 500 });
      }
      
      const result = await response.json();
      const shopData = result?.data?.shop;
      const billingPhone = shopData?.billingAddress?.phone;
      const shopOwnerName = shopData?.shopOwnerName;
      if (!shopOwnerName) {
        return new Response("Shop owner name not found", { status: 400 });
      }

      await createCaptainIfNotExists(
        existingStatusData,
        shop,
        existingEmail.email,
        billingPhone || null,
        shopOwnerName,
        db
      );
      
      const responseData = await handleAnalytics(existingStatusData, db, shop);

      if(responseData instanceof Response) {
        return responseData;
      }
    }
};


export default function DashboardPage() {
  const { consentStatus, metrics, userId, scannerId } = useLoaderData<LoaderData>();
  const [selectedRange, setSelectedRange] = useState('week');
  const [results, setResults] = useState<{
    start: string;
    end: string;
    dayCount: number;
    actualDays: number;
  } | null>(null);
  const [changeText, setChangeText] = useState('week');

  // Get today's date
  const today = new Date();

  // Helper function to format date as DD-MM-YYYY
  const formatDate = (date: any) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}-${day}-${year}`;
  };

  // Helper function to calculate days between two dates
  const calculateDays = (startDate: any, endDate: any) => {
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.round((endDate - startDate) / oneDay) + 1;
  };

  // Main function to get date ranges
  const getDateRanges = (rangeType: any) => {
    const today = new Date();
    let startDate, endDate, dayCount;

    switch (rangeType) {
      case 'week':
        // 7 days back from today
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 6); // 6 days back + today = 7 days
        endDate = new Date(today);
        dayCount = 7;
        break;

      case 'month':
        // 31 days back from today
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 30); // 30 days back + today = 31 days
        endDate = new Date(today);
        dayCount = 31;
        break;

      case 'year':
        // 365 days back from today
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 364); // 364 days back + today = 365 days
        endDate = new Date(today);
        dayCount = 365;
        break;

      default:
        return null;
    }

    return {
      start: formatDate(startDate),
      end: formatDate(endDate),
      dayCount: dayCount,
      actualDays: calculateDays(startDate, endDate)
    };
  };

  const [dashboardData, setDashboardData] = useState({
    consentStatus: {
      allowed: { count: consentStatus.ALLOWED, fromLastWeek: 0, trend: "flat" as const },
      partiallyAllowed: { count: consentStatus.PARTIALLY_ALLOWED, fromLastWeek: 0, trend: "flat" as const },
      rejected: { count: consentStatus.REJECTED, fromLastWeek: 0, trend: "flat" as const },
      noActivity: { count: consentStatus.NO_ACTIVITY, fromLastWeek: 0, trend: "flat" as const },
    },
    metrics: {
      totalUsersThisWeek: metrics?.totalUsersThisWeek || 0,
      totalViewsThisWeek: metrics?.totalViewsThisWeek || 0,
    },
  });
  // Update handleAnalytics
  const handleAnalytics = async (rangeType: string) => {
    const result = getDateRanges(rangeType);
    setSelectedRange(rangeType);
    setResults(result);
    if (!result || !userId || !scannerId) return;
    try {

      const statusData = await statusCounts(userId, scannerId, result.start, result.end);
      const userCountData = await userCounts(userId, scannerId, result.start, result.end);
      const viewCountData = await viewCounts(userId, scannerId, result.start, result.end);

      const totalUsersThisWeek = userCountData?.reduce((sum: number, item: { count: number }) => sum + item.count, 0) || 0;
      const totalViewsThisWeek = viewCountData?.reduce((sum: number, item: { count: number }) => sum + item.count, 0) || 0;

      setDashboardData({
        consentStatus: {
          allowed: { count: statusData.ALLOWED, fromLastWeek: 0, trend: "flat" as const },
          partiallyAllowed: { count: statusData.PARTIALLY_ALLOWED, fromLastWeek: 0, trend: "flat" as const },
          rejected: { count: statusData.REJECTED, fromLastWeek: 0, trend: "flat" as const },
          noActivity: { count: statusData.NO_ACTIVITY, fromLastWeek: 0, trend: "flat" as const },
        },
        metrics: {
          totalUsersThisWeek,
          totalViewsThisWeek,
        },
      });
      setChangeText(rangeType);
    } catch (error) {
      console.error("Failed to fetch analytics data:", error);
    }
  };




  return (
    <Page fullWidth>
      <TitleBar title="Dashboard" />

      <BlockStack gap="600">
        <InlineStack align="end" gap="200">
          <ButtonGroup>
            <Button pressed={selectedRange === 'week'} onClick={() => handleAnalytics("week")}>Week</Button>
            <Button pressed={selectedRange === 'month'} onClick={() => handleAnalytics("month")}>Month</Button>
            <Button pressed={selectedRange === 'year'} onClick={() => handleAnalytics("year")}>Year</Button>
          </ButtonGroup>

        </InlineStack>

        <Grid>
          <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 12, xl: 12 }}>
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
                        Last {" "}
                        {changeText}
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
                        Last week{" "}
                        {changeText}
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
                        Last week{" "}
                        {changeText}
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
                        Last week{" "}
                        {changeText}
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
                      <Text as="h3" variant="headingMd">Total Users this {" "}
                        {changeText}</Text>
                      <Text as="p" variant="heading2xl">{dashboardData.metrics.totalUsersThisWeek.toLocaleString()}</Text>
                      <Text as="p" variant="bodySm" tone="subdued">Number of users who have interacted</Text>
                    </BlockStack>
                  </Card>
                </Grid.Cell>
                <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
                  <Card>
                    <BlockStack gap="200">
                      <Text as="h3" variant="headingMd">Total Views this {" "}
                        {changeText}</Text>
                      <Text as="p" variant="heading2xl">{dashboardData.metrics.totalViewsThisWeek.toLocaleString()}</Text>
                      <Text as="p" variant="bodySm" tone="subdued">last {" "}
                        {changeText}</Text>
                    </BlockStack>
                  </Card>
                </Grid.Cell>
              </Grid>


            </BlockStack>
          </Grid.Cell>


        </Grid>
      </BlockStack>
    </Page>
  );
}