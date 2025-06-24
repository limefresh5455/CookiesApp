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