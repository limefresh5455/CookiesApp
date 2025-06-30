

interface DomainCheckResponse {
  exists: boolean;
}

interface CreateDomainResponse {
  success?: boolean;
  bannerToken?: string;
  scannerId?: string;
}

interface DomainData {
  domain: string;
  userId: string;
  verified?: boolean;
}

interface statusCheckResponse {
  ALLOWED: number;
  NO_ACTIVITY: number;
  PARTIALLY_ALLOWED: number;
  REJECTED: number;
  count: number;
}


export const getClerkId = async (email: string, mobileNumber: string, shopOwnerName: string) => {
  const phone = mobileNumber || "9884567884";
  if (!email || !phone) {
    return { error: "Email and phone are required" };
  }
  const headers = {
    accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
  };

  try {
    // STEP 1: Try to get existing Clerk user by email

    const getResponse = await fetch(
      `https://api.clerk.com/v1/users?email_address=${encodeURIComponent(email)}`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: headers.Authorization,
        },
      }
    );
    const existingUsers = await getResponse.json();

    if (Array.isArray(existingUsers) && existingUsers.length > 0) {
      const user = existingUsers[0];
      console.log("✅ Clerk user already exists:", user.id);
      return { clerkId: user.id, alreadyExists: true };
    }

    // STEP 2: If not found, create new Clerk user
    const createResponse = await fetch("https://api.clerk.com/v1/users", {
      method: "POST",
      headers,
      body: JSON.stringify({
        first_name: shopOwnerName,
        last_name: shopOwnerName,
        email_address: [email],
        phone_numbers: [phone],
        skip_password_checks: true,
        skip_password_requirement: true,
      }),
    });

    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      console.error("❌ Clerk API error:", errorText);
      return { error: "Failed to create Clerk user" };
    }

    const createdUser = await createResponse.json();
    console.log("🆕 Clerk user created:", createdUser.id);
    return {
      clerkId: createdUser.id,
      alreadyExists: false,
    };
  } catch (err) {
    console.error("❌ Clerk fetch failed:", err);
    return { error: "Network error or Clerk unreachable" };
  }
};

export async function userCounts(userId: string, scannerId: string, from: string, to: string) {
  try {
    const url = `${import.meta.env.VITE_API_URL}/bannerTracking/userCount?from=${from}&to=${to}&scannerId=${scannerId}&userId=${userId}`;
    console.log("userCounts API URL:", url); // Debug
    const response = await fetch(url, {
      method: "GET",
      headers: {
        accept: "*/*",
      },
    });
    if (!response.ok) {
      console.error("userCounts API failed:", response.status, response.statusText);
      throw new Error("Failed to fetch user counts");
    }
    const data = await response.json();
    console.log("userCounts API response:", data); // Debug
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching user counts:", error);
    return []; // Fallback
  }
}
export async function viewCounts(userId: string, scannerId: string, from: string, to: string) {
  try {
    const url = `${import.meta.env.VITE_API_URL}/bannerTracking/count?from=${from}&to=${to}&scannerId=${scannerId}&userId=${userId}`;
    console.log("viewCounts API URL:", url); // Debug
    const response = await fetch(url, {
      method: "GET",
      headers: {
        accept: "*/*",
      },
    });
    if (!response.ok) {
      console.error("viewCounts API failed:", response.status, response.statusText);
      throw new Error("Failed to fetch user counts");
    }
    const data = await response.json();
    console.log("viewCounts API response:", data); // Debug
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching user counts:", error);
    return []; // Fallback
  }
}


export async function statusCounts(userId: string, scannerId: string, from: string, to: string): Promise<statusCheckResponse> {
  const apiUrl = `${import.meta.env.VITE_API_URL}/bannerTracking/statusCounts?from=${from}&to=${to}&${scannerId}=45&userId=${userId}`;
  
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch banner status");
    }
    
    const data = await response.json();
    return data; // or return response.json() directly
  } catch (error) {
    console.error("Error fetching status counts:", error);
    throw error; // or handle error as needed
  }
}

export async function checkDomainExists(userId: string, domain: string): Promise<DomainCheckResponse> {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/dns/exists?userId=${userId}&domain=${encodeURIComponent(domain)}`
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      if (errorData?.message) {
        if (Array.isArray(errorData.message)) {
          throw new Error(`Validation Error: ${errorData.message.join(", ")}`);
        }
        throw new Error(`Error: ${errorData.message}`);
      }
      throw new Error(`HTTP error while checking site! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      exists: data.exists || data === true
    };
  } catch (err) {
    throw err instanceof Error ? err : new Error("Failed to check domain");
  }
}

export async function createVerifiedDomain(data: DomainData): Promise<CreateDomainResponse> {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/dns/create-verified-domain`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "accept": "application/json",
        },
        body: JSON.stringify({
          domain: data.domain,
          userId: data.userId,
          verified: data.verified ?? true
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      if (errorData?.message) {
        if (Array.isArray(errorData.message)) {
          throw new Error(`Validation Error: ${errorData.message.join(", ")}`);
        }
        throw new Error(`Error: ${errorData.message}`);
      }
      throw new Error(`HTTP error while creating site! status: ${response.status}`);
    }
    return await response.json();
  } catch (err) {
    throw err instanceof Error ? err : new Error("Failed to create domain");
  }
}
