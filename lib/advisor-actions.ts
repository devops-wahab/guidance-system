"use server";

import { adminAuth, adminDb } from "./firebase-admin";
import { getCurrentUser } from "./auth-actions";
import { User } from "./types/admin";
import { Timestamp } from "firebase-admin/firestore";

// ==================== ADVISOR ACTIONS ====================

/**
 * Get the current advisor's profile including their department
 */
export async function getAdvisorProfile() {
  const user = await getCurrentUser();
  if (!user || user.role !== "advisor") {
    throw new Error("Unauthorized: Advisor access required");
  }

  const advisorDoc = await adminDb.collection("advisors").doc(user.uid).get();

  if (!advisorDoc.exists) {
    throw new Error("Advisor profile not found");
  }

  return {
    uid: advisorDoc.id,
    ...advisorDoc.data(),
  } as User;
}

/**
 * Get students who satisfy the "Needs Guidance" criteria:
 * 1. Same department as advisor
 * 2. GPA < 2.0
 * 3. Enrolled in courses (isEnrolled = true)
 */
export async function getGuidanceStudents() {
  try {
    const advisor = await getAdvisorProfile();
    const department = advisor.department;

    if (!department) {
      console.warn("Advisor has no department assigned");
      return [];
    }

    // Query students in the same department
    // Note: In production, we'd use a compound index here
    const studentsRef = adminDb.collection("students");
    const snapshot = await studentsRef
      .where("department", "==", department)
      .where("isEnrolled", "==", true)
      .get();

    const students: User[] = [];

    snapshot.forEach((doc) => {
      const data = doc.data();

      // Client-side filtering for GPA < 2.0 (or add to index query)
      // Including students with GPA < 2.0 OR explicitly marked as "needs_guidance"
      if (
        (data.gpa && data.gpa < 2.0) ||
        data.guidanceStatus === "needs_guidance"
      ) {
        students.push({
          uid: doc.id,
          name: data.name,
          email: data.email,
          role: "student",
          createdAt: data.createdAt?.toDate(),
          studentId: data.studentId,
          matricNumber: data.matricNumber,
          major: data.major,
          level: data.level,
          gpa: data.gpa,
          department: data.department,
          isEnrolled: data.isEnrolled,
          guidanceStatus: data.guidanceStatus || "needs_guidance", // Default to needs guidance if in this list
          phoneNumber: data.phoneNumber,
        });
      }
    });

    return students;
  } catch (error: any) {
    console.error("Error fetching guidance students:", error);
    throw new Error("Failed to fetch students requiring guidance");
  }
}

/**
 * Summon a student for guidance
 * Updates status to 'sumoned'
 */
export async function summonStudent(studentId: string) {
  try {
    const advisor = await getAdvisorProfile();

    await adminDb.collection("students").doc(studentId).update({
      guidanceStatus: "sumoned", // Note: keeping user's terminology 'sumoned'
      lastSummonedAt: Timestamp.now(),
      summonedByAdvisorId: advisor.uid,
    });

    // In a real app, we would send an email/notification here
    console.log(`Advisor ${advisor.name} summoned student ${studentId}`);

    return { success: true };
  } catch (error: any) {
    console.error("Error summoning student:", error);
    return { error: error.message };
  }
}

/**
 * Mark a student as seen (guidance completed)
 * Updates status to 'seen'
 */
export async function markStudentAsSeen(studentId: string) {
  try {
    const advisor = await getAdvisorProfile();

    await adminDb.collection("students").doc(studentId).update({
      guidanceStatus: "seen",
      lastSeenAt: Timestamp.now(),
      seenByAdvisorId: advisor.uid,
    });

    return { success: true };
  } catch (error: any) {
    console.error("Error marking student as seen:", error);
    return { error: error.message };
  }
}
