/**
 * OAuth Service — Google OAuth login flow
 * Updated: no longer references handle/rating on User model
 */
import { prisma } from "../prismac";
import { randomUUID } from "crypto";
import { signToken } from "../utils/jwt";
import { GoogleTokenResponse } from "../types/codeforces";

type GoogleUser = {
  sub: string;
  email: string;
  email_verified: boolean;
  name: string;
};

export const googleOAuthLogin = async (code: string) => {
  // 1. Exchange code → tokens
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      code,
      grant_type: "authorization_code",
      redirect_uri: process.env.GOOGLE_REDIRECT_URL!,
    }),
  });

  const tokenData = (await tokenRes.json()) as GoogleTokenResponse;
  if (!tokenData.access_token) {
    throw new Error("Google OAuth token exchange failed");
  }

  // 2. Fetch user profile
  const userRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });

  const googleUser = (await userRes.json()) as GoogleUser;

  if (!googleUser.sub || !googleUser.email) {
    throw new Error("Invalid Google user data");
  }

  // 3. Find or create user in DB
  let user = await prisma.user.findUnique({
    where: { oauthId: googleUser.sub },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        id: randomUUID(),
        email: googleUser.email,
        oauthProvider: "google",
        oauthId: googleUser.sub,
      },
    });
  }

  // 4. Issue your JWT
  const token = signToken({ userId: user.id, email: user.email });
  return { user, token };
};
