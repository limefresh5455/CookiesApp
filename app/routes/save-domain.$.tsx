import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import db from "../db.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const body = await request.json();

    const userId = String(body.userId ?? "").trim();
    const domain = String(body.domain ?? "").trim();
    const email = String(body.email ?? "").trim();
    const bannerToken = String(body.bannerToken ?? "").trim();
    const scannerId = String(body.scannerId ?? "").trim();

    if (!userId || !domain || !email || !bannerToken || !scannerId) {
      return json({ error: "Missing required fields." }, 400);
    }

    // ✅ upsert operation
    await db.captain.upsert({
      where: {
        userId,
      },
      update: {
        domain,
        email,
        accessToken: bannerToken,
        scannerId,
        createDate: new Date(),
      },
      create: {
        userId,
        domain,
        email,
        accessToken: bannerToken,
        scannerId,
        createDate: new Date(),
      },
    });

    return json({ success: true });
  } catch (error) {
    console.error("DB Save Error:", error);
    return json({ error: "Failed to save data to database." }, 500);
  }
};
