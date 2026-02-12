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
    const coursesSnapshot = await adminDb.collection("courses").get();

    if (coursesSnapshot.empty) {
      // Return mock data if no courses found in DB
      return [
        {
          id: "1",
          code: "CSC 201",
          name: "Data Structures",
          credits: 3,
          semester: "First",
          level: "200",
        },
        {
          id: "2",
          code: "CSC 202",
          name: "discrete Structure",
          credits: 3,
          semester: "First",
          level: "200",
        },
        {
          id: "3",
          code: "MTH 201",
          name: "Mathematical Methods I",
          credits: 3,
          semester: "First",
          level: "200",
        },
        {
          id: "4",
          code: "GNS 201",
          name: "Philosophy and Logic",
          credits: 2,
          semester: "First",
          level: "200",
        },
        {
          id: "5",
          code: "ENT 201",
          name: "Entrepreneurship Studies I",
          credits: 2,
          semester: "First",
          level: "200",
        },
      ];
    }

    return coursesSnapshot.docs.map((doc) => {
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
  } catch (error) {
    console.error("Error fetching available courses:", error);
    return [];
  }
}

export async function registerCourses(courseIds: string[]) {
  const user = await getCurrentUser();
  if (!user?.uid) throw new Error("Unauthorized");

  try {
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
        semester: "First", // Defaulting to first for now
        session: "2025/2026",
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
    }

    revalidatePath("/student");
    revalidatePath("/student/registration");
    return { success: true };
  } catch (error) {
    console.error("Error registering courses:", error);
    return { error: "Failed to register courses" };
  }
}

/**
 * Mocks academic history based on current level and GPA
 * In a real app, this would query a 'grades' collection
 */
export async function getAcademicHistory() {
  const profile = await getStudentProfile();
  const currentGPA = profile.gpa || 0.0;

  // Mock data generator based on GPA
  const generateGrades = (level: string, session: string, semester: string) => {
    const isHighPerformer = currentGPA > 3.0;
    const courses = [
      { code: "CSC 101", title: "Intro to CS", unit: 3 },
      { code: "MTH 101", title: "General Math I", unit: 4 },
      { code: "PHY 101", title: "General Physics I", unit: 4 },
      { code: "GNS 101", title: "Use of English", unit: 2 },
    ];

    return {
      semester,
      session,
      courses: courses.map((c) => ({
        ...c,
        grade: isHighPerformer ? "A" : "C",
        points: isHighPerformer ? 5 : 2,
      })),
      gpa: currentGPA, // simplified
      cgpa: currentGPA,
      totalUnits: courses.reduce((acc, c) => acc + c.unit, 0),
    };
  };

  // Return history based on level
  const history: AcademicRecord[] = [];

  if (profile.level === "200 Level" || profile.level === "300 Level") {
    history.push(generateGrades("100 Level", "2023/2024", "First"));
    history.push(generateGrades("100 Level", "2023/2024", "Second"));
  }

  return history;
}
