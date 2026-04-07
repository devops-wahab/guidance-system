"use server";

import { adminDb } from "./firebase-admin";

export interface Session {
  id: string;
  name: string;
  currentSemester: string;
  isActive: boolean;
  startDate: any;
  endDate: any;
  createdAt: any;
  updatedAt: any;
}

/**
 * Get the current active academic session
 * @returns The current active session or null if none exists
 */
export async function getCurrentSession(): Promise<Session | null> {
  try {
    const sessionQuery = await adminDb
      .collection("sessions")
      .where("isActive", "==", true)
      .limit(1)
      .get();

    if (sessionQuery.empty) {
      console.warn("No active session found");
      return null;
    }

    const sessionDoc = sessionQuery.docs[0];
    return {
      id: sessionDoc.id,
      ...sessionDoc.data(),
    } as Session;
  } catch (error) {
    console.error("Error fetching current session:", error);
    return null;
  }
}

/**
 * Get the current session name (e.g., "2025/2026")
 * @returns The session name or a default value
 */
export async function getCurrentSessionName(): Promise<string> {
  const session = await getCurrentSession();
  return session?.name || "2025/2026";
}

/**
 * Get the current semester (e.g., "First" or "Second")
 * @returns The current semester or a default value
 */
export async function getCurrentSemester(): Promise<string> {
  const session = await getCurrentSession();
  return session?.currentSemester || "Second";
}
