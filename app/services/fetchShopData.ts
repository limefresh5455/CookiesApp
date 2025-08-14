import { c } from "node_modules/vite/dist/node/moduleRunnerTransport.d-DJ_mE5sf";
import { createVerifiedDomain, getClerkId , statusCounts, viewCounts, userCounts} from "./captainApi";

export async function createCaptainIfNotExists(
  existingCaptain: any,
  shop: string,
  existingEmail: string,
  billingPhone: string,
  shopOwnerName: string,
  db: any
): Promise<void> {
  if (!existingCaptain) {
    // Validate required fields before calling getClerkId
    if (!existingEmail || existingEmail.trim() === '') {
      throw new Error(`Email is required but got: ${existingEmail}`);
    }
    

    if (!shopOwnerName || shopOwnerName.trim() === '') {
      throw new Error(`Shop owner name is required but got: ${shopOwnerName}`);
    }

    console.log('Calling getClerkId with:', {
      email: existingEmail,
      phone: billingPhone,
      name: shopOwnerName
    });

    const userData = await getClerkId(existingEmail, billingPhone, shopOwnerName);

    // Check if getClerkId returned an error
    if (!userData || 'error' in userData) {
      const errorMsg = userData && 'error' in userData ? userData.error : 'Unknown error getting Clerk ID';
      throw new Error(`Failed to get Clerk ID: ${errorMsg}`);
    }

    // Validate that clerkId exists and is a valid string
    if (!userData.clerkId || typeof userData.clerkId !== 'string' || userData.clerkId.trim() === '') {
      console.error('Invalid userData:', userData);
      throw new Error(`Invalid Clerk ID received: ${userData.clerkId}. Expected a non-empty string.`);
    }


    const createData = await createVerifiedDomain({
      domain: `https://${shop}`,
      userId: userData.clerkId, // Remove optional chaining since we've validated it exists
      verified: true,
    });
    

    await db.captain.upsert({
      where: {
        userId: userData.clerkId,
      },
      update: {
        domain: shop,
        email: String(existingEmail ?? "").trim(),
        accessToken: String(createData.bannerToken ?? "").trim(),
        scannerId: String(createData.scannerId ?? "").trim(),
        createDate: new Date(),
      },
      create: {
        userId: userData.clerkId,
        domain: shop,
        email: String(existingEmail ?? "").trim(),
        accessToken: String(createData.bannerToken ?? "").trim(),
        scannerId: String(createData.scannerId ?? "").trim(),
        createDate: new Date(),
      },
    });
  }
}


export async function handleAnalytics(existingStatusData: any, db: any, shop?: string): Promise<Response> {
  // Generate date range (last 6 days to today)
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

  // Default status data
  let statusData = { ALLOWED: 0, NO_ACTIVITY: 0, PARTIALLY_ALLOWED: 0, REJECTED: 0 };
  
  // If shop is provided and no existingStatusData, try to find captain by shop domain
  let captainData = existingStatusData;
  if (!captainData && shop && db) {
    try {
      captainData = await db.captain.findFirst({
        where: { domain: shop },
      });
    } catch (error) {
      console.error("Failed to fetch captain data from database:", error);
    }
  }

  // Validate that we have the required data
  if (!captainData || !captainData.userId || !captainData.scannerId) {
    return new Response(
      JSON.stringify({
        consentStatus: statusData,
        metrics: { totalUsersThisWeek: 0, totalViewsThisWeek: 0 },
        userId: captainData?.userId || '',
        scannerId: captainData?.scannerId || '',
        error: "Missing required user or scanner ID",
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // Fetch status counts
  try {
    statusData = await statusCounts(captainData.userId, captainData.scannerId, from, to);
    console.log("Status Counts Result:", statusData);
  } catch (error) {
    console.error("Failed to fetch status counts:", error);
  }
  
  let totalViewsThisWeek = 0;
  let totalUsersThisWeek = 0;

  // Fetch view and user counts
  try {
    // Fetch view counts
    const viewCountData = await viewCounts(captainData.userId, captainData.scannerId, from, to);
    if (viewCountData && Array.isArray(viewCountData)) {
      totalViewsThisWeek = viewCountData.reduce((sum: number, item: { count: number }) => sum + item.count, 0);
      console.log("Processed totalViewsThisWeek:", totalViewsThisWeek);
    }
  } catch (error) {
    console.error("Failed to fetch view count:", error);
  }

  try {
    // Fetch user counts
    const userCountData = await userCounts(captainData.userId, captainData.scannerId, from, to);
    if (userCountData && Array.isArray(userCountData)) {
      totalUsersThisWeek = userCountData.reduce((sum: number, item: { count: number }) => sum + item.count, 0);
      console.log("Processed totalUsersThisWeek:", totalUsersThisWeek);
    }
  } catch (error) {
    console.error("Failed to fetch user count:", error);
  }

  // Return JSON response
  return new Response(
    JSON.stringify({
      consentStatus: statusData,
      metrics: { totalUsersThisWeek, totalViewsThisWeek },
      userId: captainData.userId,
      scannerId: captainData.scannerId,
      error: totalUsersThisWeek === 0 ? "No user count data available" : undefined,
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}