export type UserRole = "student" | "advisor" | "admin";

export interface User {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date | string;

  // Student-specific fields
  advisorId?: string;
  studentId?: string;
  matricNumber?: string;
  major?: string;
  level?: string;
  enrollmentYear?: number;
  expectedGraduation?: string;
  gpa?: number;
  isEnrolled?: boolean;
  guidanceStatus?:
    | "good_standing"
    | "needs_guidance"
    | "sumoned"
    | "seen"
    | "completed";

  // Advisor-specific fields
  department?: string;
  officeLocation?: string;
  officeHours?: string;

  // Common optional fields
  phoneNumber?: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  credits: number;
  description: string;
  category: string;
  prerequisites?: string[];
}

export interface SystemStats {
  totalStudents: number;
  totalAdvisors: number;
  totalAdmins: number;
  totalAppointments: number;
  scheduledAppointments: number;
  completedAppointments: number;
  totalCourses: number;
  graduationReady: number;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: UserRole;

  // Student-specific fields
  advisorId?: string;
  studentId?: string;
  matricNumber?: string;
  major?: string;
  level?: string;
  enrollmentYear?: number;
  expectedGraduation?: string;

  // Advisor-specific fields
  department?: string;
  officeLocation?: string;
  officeHours?: string;

  // Common optional fields
  phoneNumber?: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  role?: UserRole;
  advisorId?: string;
}

export interface CreateCourseData {
  code: string;
  name: string;
  credits: number;
  description: string;
  category: string;
  prerequisites?: string[];
}

export interface UpdateCourseData {
  code?: string;
  name?: string;
  credits?: number;
  description?: string;
  category?: string;
  prerequisites?: string[];
}
