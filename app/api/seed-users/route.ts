import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { Timestamp } from "firebase-admin/firestore";

/**
 * API Route: Seed Test Users & Courses (Nigerian University Context)
 *
 * GET /api/seed-users
 *
 * Creates:
 * - Current Academic Session
 * - 1 Admin
 * - 1 Advisor (CS Dept)
 * - 14 CS Courses (200L, 300L, 400L)
 * - 5 Students (CS Dept, various levels/GPAs)
 * - Enrollment records for students with shouldEnroll: true
 */
export async function GET() {
  try {
    // 1. Create/Update Current Academic Session
    const sessionData = {
      name: "2025/2026",
      currentSemester: "Second",
      isActive: true,
      startDate: Timestamp.fromDate(new Date("2025-09-01")),
      endDate: Timestamp.fromDate(new Date("2026-06-30")),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    // Check if session already exists
    const existingSessionQuery = await adminDb
      .collection("sessions")
      .where("name", "==", "2025/2026")
      .limit(1)
      .get();

    let currentSessionId: string;
    if (!existingSessionQuery.empty) {
      currentSessionId = existingSessionQuery.docs[0].id;
      await adminDb
        .collection("sessions")
        .doc(currentSessionId)
        .update({ ...sessionData, updatedAt: Timestamp.now() });
      console.log("✅ Updated Session: 2025/2026");
    } else {
      const sessionRef = await adminDb.collection("sessions").add(sessionData);
      currentSessionId = sessionRef.id;
      console.log("✅ Created Session: 2025/2026");
    }

    // 2. Create Courses
    const courses = [
      // 200 Level
      {
        code: "CSC 201",
        name: "Computer Programming I",
        credits: 3,
        level: "200 Level",
        semester: "Second",
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
        semester: "Second",
      },
      {
        code: "CSC 203",
        name: "Introduction to Digital Logic",
        credits: 3,
        level: "200 Level",
        semester: "Second",
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
        semester: "Second",
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
        semester: "Second",
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
        semester: "Second",
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
        semester: "Second",
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
        displayName: "Dr. Advisor",
        role: "advisor",
        additionalData: {
          name: "Dr. Advisor",
          email: "advisor@gmail.com",
          role: "advisor",
          department: "Computer Science",
          officeLocation: "Block B, Office 7",
          officeHours: "Mon-Fri 10:00 AM - 02:00 PM",
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
          isEnrolled: false,
          guidanceStatus: "needs_guidance",
          enrollmentYear: 2024,
          // session: "2025/2026",
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
          isEnrolled: false,
          guidanceStatus: "needs_guidance",
          enrollmentYear: 2024,
          // session: "2025/2026",
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
          isEnrolled: false,
          guidanceStatus: "needs_guidance",
          enrollmentYear: 2023,
          // session: "2025/2026",
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
          isEnrolled: false,
          guidanceStatus: "good_standing",
          enrollmentYear: 2023,
          // session: "2025/2026",
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
          guidanceStatus: "good_standing",
          enrollmentYear: 2022,
          // session: "2025/2026",
          phoneNumber: "+234 901 000 0005",
          createdAt: Timestamp.now(),
        },
        collection: "students",
        shouldEnroll: true,
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
          shouldEnroll: (userData as any).shouldEnroll ?? false, // Default to false unless specified
        });

        console.log(`✅ Created ${userData.role}: ${userData.email}`);
      } catch (error: any) {
        console.error(`❌ Error creating ${userData.email}:`, error.message);
      }
    }

    // 4. Generate Transcripts for Students
    const students = createdUsers.filter((u) => u.role === "student");

    // Helper function to generate grades that match target GPA
    const distributeGrades = (courses: any[], targetGPA: number) => {
      // Deep copy courses to avoid modifying original array
      const coursesWithGrades = courses.map((c) => ({
        ...c,
        grade: "F",
        points: 0,
      }));
      const totalUnits = coursesWithGrades.reduce((sum, c) => sum + c.unit, 0);

      // Calculate total points needed to achieve target GPA
      // Round to nearest integer since points must be whole numbers (mostly)
      // In a real system, points are integer sums
      let targetPoints = Math.round(targetGPA * totalUnits);

      // Initial distribution: Give everyone the base grade (floor of targetGPA)
      let basePoint = Math.floor(targetGPA);
      // Clamp basePoint between 0-5
      basePoint = Math.max(0, Math.min(5, basePoint));

      let currentTotalPoints = 0;

      // Assign base grades
      coursesWithGrades.forEach((c) => {
        c.points = basePoint;
        currentTotalPoints += c.points * c.unit;
      });

      // Distribute remaining points or reduce excess points
      // We shuffle courses to randomize where the extra points go
      const shuffledIndices = Array.from(
        { length: courses.length },
        (_, i) => i,
      ).sort(() => Math.random() - 0.5);

      let i = 0;
      // If we need more points (likely, since we used floor)
      while (currentTotalPoints < targetPoints) {
        const index = shuffledIndices[i % courses.length];
        const course = coursesWithGrades[index];

        // Can we upgrade this course? (Max 5 points = A)
        if (course.points < 5) {
          course.points++;
          currentTotalPoints += course.unit;
        }
        i++;
        // Break if we can't improve anymore (all A's) but still haven't met target
        if (
          coursesWithGrades.every((c) => c.points === 5) &&
          currentTotalPoints < targetPoints
        )
          break;
      }

      // If we have too many points (unlikely with floor, but possible if target < 0 or logic changes)
      while (currentTotalPoints > targetPoints) {
        const index = shuffledIndices[i % courses.length];
        const course = coursesWithGrades[index];

        if (course.points > 0) {
          course.points--;
          currentTotalPoints -= course.unit;
        }
        i++;
      }

      // Map points back to Letter Grades
      const pointToGrade: Record<number, string> = {
        5: "A",
        4: "B",
        3: "C",
        2: "D",
        1: "E",
        0: "F",
      };

      coursesWithGrades.forEach((c) => {
        c.grade = pointToGrade[c.points] || "F";
      });

      return coursesWithGrades;
    };

    // Course definitions by level
    const coursesByLevelForTranscript: Record<string, any[]> = {
      "100 Level First": [
        { code: "CSC 101", title: "Introduction to Computer Science", unit: 3 },
        { code: "CSC 103", title: "Introduction to Programming I", unit: 3 },
        { code: "CSC 105", title: "Introduction to Web Technologies", unit: 3 },
        { code: "CSC 107", title: "Computer Ethics and Society", unit: 2 },
        { code: "GNS 101", title: "Use of English I", unit: 2 },
        { code: "GNS 103", title: "Citizenship Education", unit: 2 },
      ],
      "100 Level Second": [
        { code: "CSC 102", title: "Introduction to Problem Solving", unit: 3 },
        { code: "CSC 104", title: "Introduction to Programming II", unit: 3 },
        { code: "CSC 106", title: "Introduction to Database Systems", unit: 3 },
        { code: "CSC 108", title: "Basic Hardware Maintenance", unit: 2 },
        { code: "GNS 102", title: "Use of English II", unit: 2 },
        { code: "CSC 110", title: "Logic Design", unit: 2 },
      ],
      "200 Level First": [
        { code: "CSC 201", title: "Computer Programming I", unit: 3 },
        { code: "CSC 203", title: "Introduction to Digital Logic", unit: 3 },
        { code: "CSC 205", title: "Object Oriented Programming I", unit: 3 },
        {
          code: "CSC 207",
          title: "Introduction to Assembly Language",
          unit: 3,
        },
        { code: "GNS 201", title: "Nigerian Peoples & Culture", unit: 2 },
      ],
      "300 Level First": [
        { code: "CSC 301", title: "Operating Systems", unit: 3 },
        { code: "CSC 303", title: "Numerical Methods in CS", unit: 3 },
        { code: "CSC 305", title: "Database Design & Management", unit: 3 },
        { code: "CSC 307", title: "Computer Networks & Security", unit: 3 },
        { code: "CSC 309", title: "Survey of Programming Languages", unit: 3 },
      ],
    };

    for (const student of students) {
      const studentDoc = await adminDb
        .collection("students")
        .doc(student.uid)
        .get();
      const studentData = studentDoc.data();
      const currentLevel = studentData?.level || "200 Level";
      const targetGPA = studentData?.gpa || 2.0;

      // Determine which transcripts to generate based on current level
      const transcriptsToGenerate: {
        level: string;
        semester: string;
        session: string;
      }[] = [];

      if (currentLevel === "200 Level") {
        // Generate 100 Level First Semester transcript
        transcriptsToGenerate.push({
          level: "100 Level",
          semester: "First",
          session: "2024/2025",
        });
      } else if (currentLevel === "300 Level") {
        // Generate 100L First, 100L Second, 200L First
        transcriptsToGenerate.push(
          { level: "100 Level", semester: "First", session: "2023/2024" },
          { level: "100 Level", semester: "Second", session: "2023/2024" },
          { level: "200 Level", semester: "First", session: "2024/2025" },
        );
      } else if (currentLevel === "400 Level") {
        // Generate 100L First, 100L Second, 200L First, 300L First
        transcriptsToGenerate.push(
          { level: "100 Level", semester: "First", session: "2022/2023" },
          { level: "100 Level", semester: "Second", session: "2022/2023" },
          { level: "200 Level", semester: "First", session: "2023/2024" },
          { level: "300 Level", semester: "First", session: "2024/2025" },
        );
      }

      // Generate each transcript
      for (const transcript of transcriptsToGenerate) {
        const courseKey = `${transcript.level} ${transcript.semester}`;
        const courses = coursesByLevelForTranscript[courseKey] || [];

        if (courses.length === 0) continue;

        // Generate grades for each course to match GPA
        const coursesWithGrades = distributeGrades(courses, targetGPA);

        // Calculate final GPA for this semester (should be very close/equal to target)
        const totalUnits = coursesWithGrades.reduce(
          (sum, c) => sum + c.unit,
          0,
        );
        const totalPoints = coursesWithGrades.reduce(
          (sum, c) => sum + c.points * c.unit,
          0,
        );
        const semesterGPA = totalUnits > 0 ? totalPoints / totalUnits : 0;

        // Create transcript document
        await adminDb.collection("transcripts").add({
          studentId: student.uid,
          level: transcript.level,
          semester: transcript.semester,
          session: transcript.session,
          courses: coursesWithGrades,
          totalUnits,
          totalPoints,
          gpa: parseFloat(semesterGPA.toFixed(2)),
          cgpa: targetGPA, // Use target GPA as CGPA
          createdAt: Timestamp.now(),
        });

        console.log(
          `✅ Generated transcript for ${student.email}: ${transcript.level} ${transcript.semester} (GPA: ${semesterGPA.toFixed(2)})`,
        );
      }
    }

    // 5. Enroll Students in Courses

    const studentsToEnroll = createdUsers.filter(
      (u) => u.role === "student" && u.shouldEnroll,
    );

    // Get current session for enrollments
    const currentSessionDoc = await adminDb
      .collection("sessions")
      .doc(currentSessionId)
      .get();
    const currentSessionData = currentSessionDoc.data();

    // Create a mapping of course IDs by level
    const coursesByLevel: Record<string, string[]> = {};
    for (let i = 0; i < courses.length; i++) {
      const course = courses[i];
      if (!coursesByLevel[course.level]) {
        coursesByLevel[course.level] = [];
      }
      coursesByLevel[course.level].push(createdCourseIds[i]);
    }

    for (const student of studentsToEnroll) {
      // Get student's level from their document
      const studentDoc = await adminDb
        .collection("students")
        .doc(student.uid)
        .get();
      const studentData = studentDoc.data();
      const studentLevel = studentData?.level || "200 Level";

      // Assign 4 courses that match the student's level
      const levelCourses = coursesByLevel[studentLevel] || [];
      const assignedCourses = levelCourses.slice(0, 4);

      if (assignedCourses.length === 0) {
        console.log(
          `⚠️ No courses available for ${student.email} at ${studentLevel}`,
        );
        continue;
      }

      const enrollmentData = {
        studentId: student.uid,
        courses: assignedCourses,
        session: currentSessionData?.name || "2025/2026",
        semester: currentSessionData?.currentSemester || "Second",
        status: "registered",
        registeredAt: Timestamp.now(),
      };

      await adminDb.collection("enrollments").add(enrollmentData);

      // Update student's isEnrolled status to true
      await adminDb.collection("students").doc(student.uid).update({
        isEnrolled: true,
      });

      console.log(
        `✅ Enrolled ${student.email} (${studentLevel}) in ${assignedCourses.length} courses`,
      );
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Test session, courses, users, and transcripts seeded successfully (Nigerian Context)",
        summary: {
          session_created: "2025/2026 (Second Semester)",
          courses_created: courses.length,
          users_created: createdUsers.length,
          transcripts_generated: students.length,
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
