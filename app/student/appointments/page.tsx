import { getStudentProfile } from "@/lib/student-actions";
import { adminDb } from "@/lib/firebase-admin";
import { AppointmentBookingForm } from "@/components/student/AppointmentBookingForm";
import { redirect } from "next/navigation";

interface Advisor {
  id: string;
  name: string;
  email: string;
}

async function getAdvisors(): Promise<Advisor[]> {
  try {
    const snapshot = await adminDb.collection("advisors").get();
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name || "",
      email: doc.data().email || "",
    }));
  } catch (error) {
    console.error("Error fetching advisors:", error);
    return [];
  }
}

export default async function AppointmentsPage() {
  let student;
  try {
    student = await getStudentProfile();
  } catch (error) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Book an Appointment</h1>
        <div className="rounded-lg border p-6">
          <p className="text-muted-foreground">
            Unable to verify student profile. Please log in again.
          </p>
        </div>
      </div>
    );
  }

  const advisors = await getAdvisors();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Book an Appointment</h1>
        <p className="text-muted-foreground">
          Schedule a meeting with your advisor.
        </p>
      </div>

      {advisors.length === 0 ? (
        <div className="rounded-lg border p-6">
          <p className="text-muted-foreground">
            No advisors are currently available. Please check back later.
          </p>
        </div>
      ) : (
        <AppointmentBookingForm
          studentUid={student.uid}
          initialAdvisors={advisors}
        />
      )}
    </div>
  );
}
