"use server";

import { adminAuth, adminDb } from "./firebase-admin";
import { getCurrentUser } from "./auth-actions";
import {
  User,
  CreateUserData,
  UpdateUserData,
  Course,
  CreateCourseData,
  UpdateCourseData,
  SystemStats,
} from "./types/admin";
import { Timestamp } from "firebase-admin/firestore";

// Helper to verify admin role
async function verifyAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    throw new Error("Unauthorized: Admin access required");
  }
  return user;
}

// ==================== USER MANAGEMENT ====================

export async function getAllUsers(): Promise<User[]> {
  await verifyAdmin();

  try {
    const users: User[] = [];

    // Fetch admins from users collection
    const usersSnapshot = await adminDb.collection("users").get();
    usersSnapshot.docs.forEach((doc) => {
      const data = doc.data();
      users.push({
        uid: doc.id,
        name: data.name || "",
        email: data.email || "",
        role: data.role || "admin",
        createdAt: data.createdAt?.toDate() || new Date(),
      });
    });

    // Fetch advisors from advisors collection
    const advisorsSnapshot = await adminDb.collection("advisors").get();
    advisorsSnapshot.docs.forEach((doc) => {
      const data = doc.data();
      users.push({
        uid: doc.id,
        name: data.name || "",
        email: data.email || "",
        role: "advisor",
        createdAt: data.createdAt?.toDate() || new Date(),
        department: data.department,
        officeLocation: data.officeLocation,
        officeHours: data.officeHours,
        phoneNumber: data.phoneNumber,
      });
    });

    // Fetch students from students collection
    const studentsSnapshot = await adminDb.collection("students").get();
    studentsSnapshot.docs.forEach((doc) => {
      const data = doc.data();
      users.push({
        uid: doc.id,
        name: data.name || "",
        email: data.email || "",
        role: "student",
        createdAt: data.createdAt?.toDate() || new Date(),
        advisorId: data.advisorId,
        studentId: data.studentId,
        matricNumber: data.matricNumber,
        major: data.major,
        level: data.level,
        phoneNumber: data.phoneNumber,
      });
    });

    return users;
  } catch (error: any) {
    console.error("Error fetching users:", error);
    throw new Error("Failed to fetch users");
  }
}

export async function createUser(data: CreateUserData) {
  await verifyAdmin();

  try {
    // Create user in Firebase Auth
    const userRecord = await adminAuth.createUser({
      email: data.email,
      password: data.password,
      displayName: data.name,
    });

    // Set custom claims for role
    await adminAuth.setCustomUserClaims(userRecord.uid, { role: data.role });

    // Create user document in Firestore
    const userData: any = {
      name: data.name,
      email: data.email,
      role: data.role,
      createdAt: Timestamp.now(),
    };

    // Add student-specific fields
    if (data.role === "student") {
      if (data.advisorId) userData.advisorId = data.advisorId;
      if (data.studentId) userData.studentId = data.studentId;
      if (data.matricNumber) userData.matricNumber = data.matricNumber;
      if (data.major) userData.major = data.major;
      if (data.level) userData.level = data.level;
      if (data.enrollmentYear) userData.enrollmentYear = data.enrollmentYear;
      if (data.expectedGraduation)
        userData.expectedGraduation = data.expectedGraduation;
      if (data.phoneNumber) userData.phoneNumber = data.phoneNumber;
    }

    // Add advisor-specific fields
    if (data.role === "advisor") {
      if (data.department) userData.department = data.department;
      if (data.officeLocation) userData.officeLocation = data.officeLocation;
      if (data.officeHours) userData.officeHours = data.officeHours;
      if (data.phoneNumber) userData.phoneNumber = data.phoneNumber;
    }

    // Determine collection based on role
    const collection =
      data.role === "admin"
        ? "users"
        : data.role === "advisor"
          ? "advisors"
          : "students";
    await adminDb.collection(collection).doc(userRecord.uid).set(userData);

    return { success: true, uid: userRecord.uid };
  } catch (error: any) {
    console.error("Error creating user:", error);
    return { error: error.message || "Failed to create user" };
  }
}

export async function updateUser(uid: string, data: UpdateUserData) {
  await verifyAdmin();

  try {
    const updates: any = {};

    // Get current user to determine collection
    const userRecord = await adminAuth.getUser(uid);
    const currentRole = userRecord.customClaims?.role as string;

    // Update Firebase Auth if email or name changed
    if (data.email || data.name) {
      const authUpdates: any = {};
      if (data.email) authUpdates.email = data.email;
      if (data.name) authUpdates.displayName = data.name;
      await adminAuth.updateUser(uid, authUpdates);
    }

    // Update custom claims if role changed
    if (data.role) {
      await adminAuth.setCustomUserClaims(uid, { role: data.role });
      updates.role = data.role;
    }

    // Update Firestore document
    if (data.name) updates.name = data.name;
    if (data.email) updates.email = data.email;
    if (data.advisorId !== undefined) updates.advisorId = data.advisorId;

    if (Object.keys(updates).length > 0) {
      const collection =
        currentRole === "admin"
          ? "users"
          : currentRole === "advisor"
            ? "advisors"
            : "students";
      await adminDb.collection(collection).doc(uid).update(updates);
    }

    return { success: true };
  } catch (error: any) {
    console.error("Error updating user:", error);
    return { error: error.message || "Failed to update user" };
  }
}

export async function deleteUser(uid: string) {
  await verifyAdmin();

  try {
    // Get user role before deleting
    const userRecord = await adminAuth.getUser(uid);
    const role = userRecord.customClaims?.role as string;

    // Delete from Firebase Auth
    await adminAuth.deleteUser(uid);

    // Delete from Firestore (from correct collection)
    const collection =
      role === "admin" ? "users" : role === "advisor" ? "advisors" : "students";
    await adminDb.collection(collection).doc(uid).delete();

    return { success: true };
  } catch (error: any) {
    console.error("Error deleting user:", error);
    return { error: error.message || "Failed to delete user" };
  }
}

export async function assignStudentToAdvisor(
  studentId: string,
  advisorId: string,
) {
  await verifyAdmin();

  try {
    await adminDb.collection("students").doc(studentId).update({
      advisorId: advisorId,
    });

    return { success: true };
  } catch (error: any) {
    console.error("Error assigning advisor:", error);
    return { error: error.message || "Failed to assign advisor" };
  }
}

// ==================== COURSE MANAGEMENT ====================

export async function getAllCourses(): Promise<Course[]> {
  await verifyAdmin();

  try {
    const coursesSnapshot = await adminDb.collection("courses").get();
    const courses: Course[] = coursesSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        code: data.code,
        name: data.name,
        credits: data.credits,
        description: data.description,
        category: data.category,
        prerequisites: data.prerequisites,
      };
    });
    return courses;
  } catch (error: any) {
    console.error("Error fetching courses:", error);
    throw new Error("Failed to fetch courses");
  }
}

export async function createCourse(data: CreateCourseData) {
  await verifyAdmin();

  try {
    const courseRef = await adminDb.collection("courses").add({
      ...data,
      createdAt: Timestamp.now(),
    });

    return { success: true, id: courseRef.id };
  } catch (error: any) {
    console.error("Error creating course:", error);
    return { error: error.message || "Failed to create course" };
  }
}

export async function updateCourse(id: string, data: UpdateCourseData) {
  await verifyAdmin();

  try {
    await adminDb.collection("courses").doc(id).update(data);
    return { success: true };
  } catch (error: any) {
    console.error("Error updating course:", error);
    return { error: error.message || "Failed to update course" };
  }
}

export async function deleteCourse(id: string) {
  await verifyAdmin();

  try {
    await adminDb.collection("courses").doc(id).delete();
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting course:", error);
    return { error: error.message || "Failed to delete course" };
  }
}

// ==================== STATISTICS ====================

export async function getSystemStats(): Promise<SystemStats> {
  await verifyAdmin();

  try {
    // Get user counts from separate collections
    const adminsSnapshot = await adminDb.collection("users").get();
    const totalAdmins = adminsSnapshot.size;

    const advisorsSnapshot = await adminDb.collection("advisors").get();
    const totalAdvisors = advisorsSnapshot.size;

    const studentsSnapshot = await adminDb.collection("students").get();
    const totalStudents = studentsSnapshot.size;

    // Get appointment counts
    const appointmentsSnapshot = await adminDb.collection("appointments").get();
    const totalAppointments = appointmentsSnapshot.size;
    let scheduledAppointments = 0;
    let completedAppointments = 0;

    appointmentsSnapshot.docs.forEach((doc) => {
      const status = doc.data().status;
      if (status === "scheduled") scheduledAppointments++;
      else if (status === "completed") completedAppointments++;
    });

    // Get course count
    const coursesSnapshot = await adminDb.collection("courses").get();
    const totalCourses = coursesSnapshot.size;

    // Mock graduation ready count (would need actual logic)
    const graduationReady = 0;

    return {
      totalStudents,
      totalAdvisors,
      totalAdmins,
      totalAppointments,
      scheduledAppointments,
      completedAppointments,
      totalCourses,
      graduationReady,
    };
  } catch (error: any) {
    console.error("Error fetching stats:", error);
    throw new Error("Failed to fetch statistics");
  }
}
