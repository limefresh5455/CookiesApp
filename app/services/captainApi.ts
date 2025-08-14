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

const appdomain = process.env.CLERK_API_URL;

export async function getScript(accessToken: string) {
  if (!accessToken) {
    throw new Response("Access token is required", { status: 400 });
  }

  const response = await fetch(`${appdomain}/banner/script?accessToken=${accessToken}`, {
    method: "GET",
    headers: {
      accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Response("Failed to fetch script", { status: 500 });
  }

  const data = await response.text(); // return pure JS file
  return data;
}


export const getClerkId = async (email: string, mobileNumber: string, shopOwnerName: string) => {
  let min = 1000000000; // 10 digits minimum
  let max = 9999999999; // 10 digits maximum
  const mobileDigits = Math.floor(Math.random() * (max - min + 1)) + min;
  const phone = mobileNumber || mobileDigits.toString();
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
      `${process.env.CLERK_API_URL}/v1/users?email_address=${encodeURIComponent(email)}`,
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
    const createResponse = await fetch(`${import.meta.env.CLERK_API_URL}/v1/users`, {
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
    const url = `${appdomain}/bannerTracking/userCount?from=${from}&to=${to}&scannerId=${scannerId}&userId=${userId}`;
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
    const url = `${appdomain}/bannerTracking/count?from=${from}&to=${to}&scannerId=${scannerId}&userId=${userId}`;
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


export async function statusCounts(userId: string, scannerId: string, from: string, to: string){
  const apiUrl = `${appdomain}/bannerTracking/statusCounts?from=${from}&to=${to}&scannerId=${scannerId}&userId=${userId}`;
  
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
      `${appdomain}/dns/exists?userId=${userId}&domain=https://${encodeURIComponent(domain)}`
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
      `${appdomain}/dns/create-verified-domain`,
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
