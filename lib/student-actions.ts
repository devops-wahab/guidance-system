"use server";

import { Timestamp } from "firebase-admin/firestore";
import { adminAuth, adminDb } from "./firebase-admin";
import { ActionState } from "./definations";
import { mapZodErrors } from "./utils";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { registerSchema } from "./auth-schemas";
import { getCurrentUser } from "./auth-actions";
import { User } from "./types/admin";

// Types for Academic Data
export interface EnrolledCourse {
  id: string;
  code: string;
  name: string;
  credits: number;
  semester: string;
  level: string;
  status: "registered" | "completed" | "dropped";
}

export interface AcademicRecord {
  semester: string;
  session: string;
  courses: {
    code: string;
    title: string;
    unit: number;
    grade: string;
    points: number;
  }[];
  gpa: number;
  cgpa: number;
  totalUnits: number;
}

// ==================== AUTH ACTIONS ====================

export async function registerStudent(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const result = registerSchema.safeParse({
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  });

  if (!result.success) {
    return {
      errors: mapZodErrors(result.error),
    };
  }

  const { name, email, password } = result.data;

  try {
    const user = await adminAuth.createUser({
      email,
      password,
      displayName: name,
    });

    await adminAuth.setCustomUserClaims(user.uid, { role: "student" });

    await adminDb.collection("students").doc(user.uid).set(
      {
        name,
        email,
        createdAt: Timestamp.now(),
      },
      { merge: true },
    );
  } catch (err: any) {
    let errorMessage = "Failed to create account. Please try again.";
    if (err.code === "auth/email-already-exists") {
      errorMessage = "An account with this email already exists.";
    } else if (err.code === "auth/weak-password") {
      errorMessage = "Password is too weak.";
    }
    return { error: errorMessage };
  }

  redirect("/login");
}

// ==================== DATA FETCHING ACTIONS ====================

export async function getStudentProfile() {
  const user = await getCurrentUser();
  if (!user?.uid) throw new Error("Unauthorized");

  const doc = await adminDb.collection("students").doc(user.uid).get();
  if (!doc.exists) throw new Error("Profile not found");

  return { uid: doc.id, ...doc.data() } as User;
}

export async function getEnrolledCourses() {
  const user = await getCurrentUser();
  if (!user?.uid) return [];

  try {
    // Get enrollment record
    const enrollmentSnapshot = await adminDb
      .collection("enrollments")
      .where("studentId", "==", user.uid)
      .limit(1)
      .get();

    if (enrollmentSnapshot.empty) return [];

    const enrollment = enrollmentSnapshot.docs[0].data();
    const courseIds = enrollment.courses || [];

    // Fetch details for each course ID
    // Note: In a real app we'd use array-contains-any or batched reads
    const courseDetails: EnrolledCourse[] = [];

    for (const courseId of courseIds) {
      const courseDoc = await adminDb.collection("courses").doc(courseId).get();
      if (courseDoc.exists) {
        const data = courseDoc.data();
        courseDetails.push({
          id: courseDoc.id,
          code: data?.code,
          name: data?.name,
          credits: data?.credits,
          semester: data?.semester,
          level: data?.level,
          status: "registered",
        });
      }
    }

    // ... existing code ...
    return courseDetails;
  } catch (error) {
    console.error("Error fetching enrolled courses:", error);
    return [];
  }
}

export async function getAvailableCourses() {
  const user = await getCurrentUser();
  if (!user?.uid) return [];

  try {
    // Get student profile to determine their level
    const studentDoc = await adminDb.collection("students").doc(user.uid).get();
    if (!studentDoc.exists) return [];

    const studentData = studentDoc.data();
    const studentLevel = studentData?.level || "200 Level";

    // Fetch all courses
    const coursesSnapshot = await adminDb.collection("courses").get();

    // Filter courses by student's level
    const filteredCourses = coursesSnapshot.docs
      .filter((doc) => {
        const data = doc.data();
        return data.level === studentLevel;
      })
      .map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          code: data.code,
          name: data.name,
          credits: data.credits,
          semester: data.semester,
          level: data.level,
          status: "registered", // Default for available courses listing, though not strictly enrolled yet
        } as EnrolledCourse;
      });

    return filteredCourses;
  } catch (error) {
    console.error("Error fetching available courses:", error);
    return [];
  }
}

export async function registerCourses(courseIds: string[]) {
  const user = await getCurrentUser();
  if (!user?.uid) throw new Error("Unauthorized");

  try {
    // Get current session
    const { getCurrentSession } = await import("./session-utils");
    const currentSession = await getCurrentSession();

    if (!currentSession) {
      return { error: "No active academic session found" };
    }

    // Check if student already has an enrollment record
    const enrollmentQuery = await adminDb
      .collection("enrollments")
      .where("studentId", "==", user.uid)
      .limit(1)
      .get();

    if (!enrollmentQuery.empty) {
      // Update existing enrollment
      const enrollmentId = enrollmentQuery.docs[0].id;
      await adminDb.collection("enrollments").doc(enrollmentId).update({
        courses: courseIds,
        updatedAt: Timestamp.now(),
      });
    } else {
      // Create new enrollment
      await adminDb.collection("enrollments").add({
        studentId: user.uid,
        courses: courseIds,
        session: currentSession.name,
        semester: currentSession.currentSemester,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
    }

    // Update student's isEnrolled status to true
    await adminDb.collection("students").doc(user.uid).update({
      isEnrolled: true,
    });

    revalidatePath("/student");
    revalidatePath("/student/registration");
    return { success: true };
  } catch (error) {
    console.error("Error registering courses:", error);
    return { error: "Failed to register courses" };
  }
}

/**
 * Fetches academic history from the transcripts collection
 */
export async function getAcademicHistory() {
  const user = await getCurrentUser();
  if (!user?.uid) throw new Error("Unauthorized");

  try {
    const transcriptsSnapshot = await adminDb
      .collection("transcripts")
      .where("studentId", "==", user.uid)
      .orderBy("createdAt", "desc") // Order by creation time to show chronological progress (recent first)
      .get();

    if (transcriptsSnapshot.empty) {
      return [];
    }

    const history: AcademicRecord[] = transcriptsSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        semester: data.semester,
        session: data.session,
        courses: data.courses.map((c: any) => ({
          code: c.code,
          title: c.title,
          unit: c.unit,
          grade: c.grade,
          points: c.points,
        })),
        gpa: data.gpa,
        cgpa: data.cgpa,
        totalUnits: data.totalUnits,
      };
    });

    return history;
  } catch (error) {
    console.error("Error fetching academic history:", error);
    return [];
  }
}

// ==================== HOSTEL ACTIONS ====================

export interface HostelRoom {
  id: string;
  block: string;
  roomNumber: string;
  gender: "boys" | "girls";
  capacity: number;
  occupied: number;
}

export async function getHostelRooms(blockId: string) {
  // In a real app, this would fetch from Firestore 'hostels' collection
  // For now, we generate 5 rooms for the requested block
  const gender = blockId.startsWith("boys") ? "boys" : "girls";
  const blockName = blockId.endsWith("_a") ? "Block A" : "Block B";

  const rooms: HostelRoom[] = [];
  for (let i = 1; i <= 5; i++) {
    rooms.push({
      id: `${blockId}_room_${i}`,
      block: blockName,
      roomNumber: `Room ${i}`,
      gender,
      capacity: 4,
      occupied: Math.floor(Math.random() * 4), // Mock occupancy
    });
  }
  return rooms;
}

export async function bookHostelRoom(roomId: string, paymentRef: string) {
  const user = await getCurrentUser();
  if (!user?.uid) throw new Error("Unauthorized");

  try {
    // Record the booking/allocation
    await adminDb.collection("hostel_allocations").doc(user.uid).set({
      studentId: user.uid,
      roomId,
      paymentReference: paymentRef,
      status: "approved",
      allocatedAt: Timestamp.now(),
    });

    // Update student profile with hostel status
    await adminDb.collection("students").doc(user.uid).update({
      hostelStatus: "allocated",
      roomId,
    });

    revalidatePath("/student/hostel");
    return { success: true };
  } catch (error) {
    console.error("Error booking hostel room:", error);
    return { error: "Failed to book hostel room" };
  }
}

export async function getHostelAllocation() {
  const user = await getCurrentUser();
  if (!user?.uid) return null;

  try {
    const doc = await adminDb
      .collection("hostel_allocations")
      .doc(user.uid)
      .get();
    if (!doc.exists) return null;
    return doc.data();
  } catch (error) {
    console.error("Error fetching hostel allocation:", error);
    return null;
  }
}
