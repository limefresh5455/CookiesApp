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
import { getClerkId, createVerifiedDomain, statusCounts, userCounts, viewCounts } from "../services/captainApi";
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

  if (existingEmail.email == null) {
    const response = await admin.graphql(`
    query {
      shop {
        email
        shopOwnerName
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

    // 🔹 2. Update in your custom `Captain` session table
    await db.session.update({
        where: { id: shopID }, // make sure this is unique or indexed
        data: {
          email: email,
          firstName: name,
        },
      });
    } else {
    // Log email and phone from DB if available
    const existingCaptian: any = await db.captain.findFirst({
      where: { domain: shop },
    });

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

    if (!existingCaptian) {
      const userData = await getClerkId(existingEmail.email, billingPhone, shopOwnerName);

      const createData = await createVerifiedDomain({
        domain: `https://${shop}`,
        userId: userData?.clerkId,
        verified: true,
      });
      console.log("Create Data:", createData);
      await db.captain.upsert({
        where: {
          userId: userData.clerkId,
        },
        update: {
          domain: shop,
          email: String(existingEmail.email ?? "").trim(),
          accessToken: String(createData.bannerToken ?? "").trim(),
          scannerId: String(createData.scannerId ?? "").trim(),
          createDate: new Date(),
        },
        create: {
          userId: userData.clerkId,
          domain: shop,
          email: String(existingEmail.email ?? "").trim(),
          accessToken: String(createData.bannerToken ?? "").trim(),
          scannerId: String(createData.scannerId ?? "").trim(),
          createDate: new Date(),
        },
      });
    }
  }

  const existingStatusData: any = await db.captain.findFirst({
    where: { domain: shop },
  });

  const from = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric'
  }).replace(/\//g, '-');

  const to = new Date().toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric'
  }).replace(/\//g, '-');

  let statusData = { ALLOWED: 0, NO_ACTIVITY: 0, PARTIALLY_ALLOWED: 0, REJECTED: 0 };
  try {
    statusData = await statusCounts(existingStatusData.userId, existingStatusData.scannerId, from, to);
    console.log("Status Counts Result:", statusData);
  } catch (error) {
    console.error("Failed to fetch status counts:", error);
  }


  let totalViewsThisWeek = 0;
  try {
    if (existingStatusData) {
      const viewCountData = await viewCounts(existingStatusData.userId, existingStatusData.scannerId, from, to);
      if (viewCountData) {
        totalViewsThisWeek = viewCountData.reduce((sum: number, item: { count: number }) => sum + item.count, 0);
        console.log("Processed totalUsersThisWeek:", totalViewsThisWeek);
      }

    } else {
      console.warn("No captain record for userCounts, skipping API call");
    }
  } catch (error) {
    console.error("Failed to fetch user count:", error);
  }

  // Fetch user count
  let totalUsersThisWeek = 0;
  try {
    if (existingStatusData) {
      const userCountData = await userCounts(existingStatusData.userId, existingStatusData.scannerId, from, to);
      if (userCountData) {
        totalUsersThisWeek = userCountData.reduce((sum: number, item: { count: number }) => sum + item.count, 0);
        console.log("Processed totalUsersThisWeek:", totalUsersThisWeek);
      }

    } else {
      console.warn("No captain record for userCounts, skipping API call");
    }
  } catch (error) {
    console.error("Failed to fetch user count:", error);
  }

  // Return JSON response
  return new Response(
    JSON.stringify({
      consentStatus: statusData,
      metrics: { totalUsersThisWeek, totalViewsThisWeek },
      userId: existingStatusData?.userId || '',
      scannerId: existingStatusData?.scannerId || '',
      error: totalUsersThisWeek === 0 ? "No user count data available" : undefined,
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
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