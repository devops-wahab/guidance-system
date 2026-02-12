"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminAuth } from "./firebase-admin";

const SESSION_COOKIE_NAME = "session";
const SESSION_EXPIRY_HOURS = 12;
const SESSION_MAX_AGE = 60 * 60 * SESSION_EXPIRY_HOURS * 1000; // 12 hours in ms

export async function createSessionCookie(idToken: string) {
  try {
    // Verify the ID token and check auth_time (recent sign-in check)
    const decodedToken = await adminAuth.verifyIdToken(idToken);

    // Only allow session cookie creation if user signed in within last 5 minutes
    const authTime = decodedToken.auth_time * 1000;
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;

    if (now - authTime > fiveMinutes) {
      return {
        error: "Recent sign-in required. Please sign in again.",
      };
    }

    // Create session cookie
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: SESSION_MAX_AGE,
    });

    // Set cookie with security options
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, sessionCookie, {
      maxAge: SESSION_MAX_AGE,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return { success: true };
  } catch (error: any) {
    console.error("Error creating session cookie:", error);
    return {
      error: error.message || "Failed to create session",
    };
  }
}

export async function verifySession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionCookie) {
    return null;
  }

  try {
    // Verify session cookie and check if revoked
    const decodedClaims = await adminAuth.verifySessionCookie(
      sessionCookie,
      true, // checkRevoked
    );

    return decodedClaims;
  } catch (error) {
    console.error("Session verification failed:", error);
    return null;
  }
}

export async function signOut() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  // Clear the session cookie
  cookieStore.delete(SESSION_COOKIE_NAME);

  if (sessionCookie) {
    try {
      // Verify and revoke all refresh tokens for the user
      const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie);
      await adminAuth.revokeRefreshTokens(decodedClaims.sub);
    } catch (error) {
      console.error("Error revoking tokens:", error);
    }
  }

  redirect("/login");
}

export async function getCurrentUser() {
  const session = await verifySession();

  if (!session) {
    return null;
  }

  return {
    uid: session.uid,
    email: session.email,
    role: session.role,
    name: session.name,
  };
}
