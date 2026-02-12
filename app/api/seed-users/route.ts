import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { Timestamp } from "firebase-admin/firestore";

/**
 * API Route: Seed Test Users & Courses (Nigerian University Context)
 *
 * GET /api/seed-users
 *
 * Creates:
 * - 1 Admin
 * - 1 Advisor (CS Dept)
 * - 7 CS Courses
 * - 5 Students (CS Dept, various levels/GPAs)
 * - Enrollment records for 4 students
 */
export async function GET() {
  try {
    // 1. Create Courses
    const courses = [
      // 200 Level
      {
        code: "CSC 201",
        name: "Computer Programming I",
        credits: 3,
        level: "200 Level",
        semester: "First",
      },
      {
        code: "CSC 202",
        name: "Computer Programming II",
        credits: 3,
        level: "200 Level",
        semester: "Second",
      },
      {
        code: "GNS 201",
        name: "Nigerian Peoples & Culture",
        credits: 2,
        level: "200 Level",
        semester: "First",
      },
      {
        code: "CSC 203",
        name: "Introduction to Digital Logic",
        credits: 3,
        level: "200 Level",
        semester: "First",
      },
      {
        code: "CSC 204",
        name: "Discrete Structures",
        credits: 3,
        level: "200 Level",
        semester: "Second",
      },

      // 300 Level
      {
        code: "CSC 301",
        name: "Operating Systems",
        credits: 3,
        level: "300 Level",
        semester: "First",
      },
      {
        code: "CSC 304",
        name: "Data Structures & Algorithms",
        credits: 3,
        level: "300 Level",
        semester: "Second",
      },
      {
        code: "CSC 305",
        name: "Database Design & Management",
        credits: 3,
        level: "300 Level",
        semester: "First",
      },
      {
        code: "CSC 308",
        name: "Computer Architecture",
        credits: 3,
        level: "300 Level",
        semester: "Second",
      },
      {
        code: "CSC 312",
        name: "Compiler Construction",
        credits: 3,
        level: "300 Level",
        semester: "Second",
      },

      // 400 Level
      {
        code: "CSC 401",
        name: "Software Engineering",
        credits: 3,
        level: "400 Level",
        semester: "First",
      },
      {
        code: "CSC 402",
        name: "Artificial Intelligence",
        credits: 3,
        level: "400 Level",
        semester: "Second",
      },
      {
        code: "CSC 405",
        name: "Computer Networks & Security",
        credits: 3,
        level: "400 Level",
        semester: "First",
      },
      {
        code: "CSC 410",
        name: "Human-Computer Interaction",
        credits: 3,
        level: "400 Level",
        semester: "Second",
      },
    ];

    const createdCourseIds: string[] = [];

    for (const course of courses) {
      const courseRef = await adminDb.collection("courses").add({
        ...course,
        department: "Computer Science",
        createdAt: Timestamp.now(),
      });
      createdCourseIds.push(courseRef.id);
      console.log(`✅ Created Course: ${course.code}`);
    }

    // 2. Define Users
    const users = [
      // Admin
      {
        email: "admin@gmail.com",
        password: "12345678",
        displayName: "Admin",
        role: "admin",
        additionalData: {
          name: "Admin",
          email: "admin@gmail.com",
          role: "admin",
          createdAt: Timestamp.now(),
        },
        collection: "users",
      },
      // Advisor (CS Dept)
      {
        email: "advisor@gmail.com",
        password: "12345678",
        displayName: "Dr. Adebayo Okonkwo",
        role: "advisor",
        additionalData: {
          name: "Dr. Adebayo Okonkwo",
          email: "advisor@gmail.com",
          role: "advisor",
          department: "Computer Science",
          officeLocation: "Faculty Block B, Room 205",
          officeHours: "Mon-Fri 10:00 AM - 12:00 PM",
          phoneNumber: "+234 803 456 7890",
          createdAt: Timestamp.now(),
        },
        collection: "advisors",
      },
      // Student 1: 200L, GPA 1.5, Enrolled (NEEDS GUIDANCE)
      {
        email: "chioma@gmail.com",
        password: "12345678",
        displayName: "Chioma Nwankwo",
        role: "student",
        additionalData: {
          name: "Chioma Nwankwo",
          email: "chioma@gmail.com",
          role: "student",
          studentId: "2025/CS/001",
          matricNumber: "U2025/CS/001",
          department: "Computer Science",
          major: "Computer Science",
          level: "200 Level",
          gpa: 1.5,
          isEnrolled: true,
          guidanceStatus: "needs_guidance",
          enrollmentYear: 2024,
          session: "2025/2026",
          phoneNumber: "+234 901 000 0001",
          createdAt: Timestamp.now(),
        },
        collection: "students",
      },
      // Student 2: 200L, GPA 1.8, Enrolled (NEEDS GUIDANCE)
      {
        email: "emeka@gmail.com",
        password: "12345678",
        displayName: "Emeka Okafor",
        role: "student",
        additionalData: {
          name: "Emeka Okafor",
          email: "emeka@gmail.com",
          role: "student",
          studentId: "2025/CS/002",
          matricNumber: "U2025/CS/002",
          department: "Computer Science",
          major: "Computer Science",
          level: "200 Level",
          gpa: 1.8,
          isEnrolled: true,
          guidanceStatus: "needs_guidance",
          enrollmentYear: 2024,
          session: "2025/2026",
          phoneNumber: "+234 901 000 0002",
          createdAt: Timestamp.now(),
        },
        collection: "students",
      },
      // Student 3: 300L, GPA 1.9, Enrolled (NEEDS GUIDANCE)
      {
        email: "fatima@gmail.com",
        password: "12345678",
        displayName: "Fatima Yusuf",
        role: "student",
        additionalData: {
          name: "Fatima Yusuf",
          email: "fatima@gmail.com",
          role: "student",
          studentId: "2025/CS/003",
          matricNumber: "U2025/CS/003",
          department: "Computer Science",
          major: "Computer Science",
          level: "300 Level",
          gpa: 1.9,
          isEnrolled: true,
          guidanceStatus: "needs_guidance",
          enrollmentYear: 2023,
          session: "2025/2026",
          phoneNumber: "+234 901 000 0003",
          createdAt: Timestamp.now(),
        },
        collection: "students",
      },
      // Student 4: 300L, GPA 3.5, Enrolled (GOOD STANDING)
      {
        email: "john@gmail.com",
        password: "12345678",
        displayName: "John Doe",
        role: "student",
        additionalData: {
          name: "John Doe",
          email: "john@gmail.com",
          role: "student",
          studentId: "2025/CS/004",
          matricNumber: "U2025/CS/004",
          department: "Computer Science",
          major: "Computer Science",
          level: "300 Level",
          gpa: 3.5,
          isEnrolled: true,
          guidanceStatus: "good_standing",
          enrollmentYear: 2023,
          session: "2025/2026",
          phoneNumber: "+234 901 000 0004",
          createdAt: Timestamp.now(),
        },
        collection: "students",
        shouldEnroll: true,
      },
      // Student 5: 400L, GPA 3.8, NOT Enrolled (Not Active)
      {
        email: "amina@gmail.com",
        password: "12345678",
        displayName: "Amina Bello",
        role: "student",
        additionalData: {
          name: "Amina Bello",
          email: "amina@gmail.com",
          role: "student",
          studentId: "2025/CS/005",
          matricNumber: "U2025/CS/005",
          department: "Computer Science",
          major: "Computer Science",
          level: "400 Level",
          gpa: 3.8,
          isEnrolled: false,
          enrollmentYear: 2022,
          session: "2025/2026",
          phoneNumber: "+234 901 000 0005",
          createdAt: Timestamp.now(),
        },
        collection: "students",
        shouldEnroll: false,
      },
    ];

    const createdUsers = [];

    // 3. Create Users
    for (const userData of users) {
      try {
        let userRecord;
        try {
          userRecord = await adminAuth.getUserByEmail(userData.email);
        } catch (error: any) {
          if (error.code !== "auth/user-not-found") throw error;
        }

        if (!userRecord) {
          userRecord = await adminAuth.createUser({
            email: userData.email,
            password: userData.password,
            displayName: userData.displayName,
          });
        }

        await adminAuth.setCustomUserClaims(userRecord.uid, {
          role: userData.role,
        });

        await adminDb
          .collection(userData.collection)
          .doc(userRecord.uid)
          .set(userData.additionalData, { merge: true });

        createdUsers.push({
          email: userData.email,
          role: userData.role,
          uid: userRecord.uid,
          shouldEnroll: (userData as any).shouldEnroll ?? true, // Default to true unless specified
        });

        console.log(`✅ Created ${userData.role}: ${userData.email}`);
      } catch (error: any) {
        console.error(`❌ Error creating ${userData.email}:`, error.message);
      }
    }

    // 4. Enroll Students in Courses
    const studentsToEnroll = createdUsers.filter(
      (u) => u.role === "student" && u.shouldEnroll,
    );

    for (const student of studentsToEnroll) {
      // Assign 4 random courses to each student
      const assignedCourses = createdCourseIds.slice(0, 4);

      const enrollmentData = {
        studentId: student.uid,
        courses: assignedCourses,
        semester: "First",
        session: "2025/2026",
        status: "registered",
        registeredAt: Timestamp.now(),
      };

      await adminDb.collection("enrollments").add(enrollmentData);
      console.log(`✅ Enrolled ${student.email} in 4 courses`);
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Test courses and users seeded successfully (Nigerian Context)",
        summary: {
          courses_created: courses.length,
          users_created: createdUsers.length,
          students_enrolled: studentsToEnroll.length,
        },
        credentials: {
          admin: { email: "admin@gmail.com", password: "12345678" },
          advisor: { email: "advisor@gmail.com", password: "12345678" },
          at_risk_students: [
            { email: "chioma@gmail.com", gpa: 1.5, level: "200L" },
            { email: "emeka@gmail.com", gpa: 1.8, level: "200L" },
            { email: "fatima@gmail.com", gpa: 1.9, level: "300L" },
          ],
          other_students: [
            { email: "john@gmail.com", gpa: 3.5, enrolled: true },
            { email: "amina@gmail.com", gpa: 3.8, enrolled: false },
          ],
        },
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error seeding:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
