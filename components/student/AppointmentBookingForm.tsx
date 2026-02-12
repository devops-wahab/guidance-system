"use client";

import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "lucide-react";

interface Advisor {
  id: string;
  name: string;
  email: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

interface AppointmentBookingFormProps {
  studentUid: string;
  initialAdvisors: Advisor[];
}

export function AppointmentBookingForm({
  studentUid,
  initialAdvisors,
}: AppointmentBookingFormProps) {
  const [advisors] = useState<Advisor[]>(initialAdvisors);
  const [selectedAdvisor, setSelectedAdvisor] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Generate time slots when date and advisor are selected
  useEffect(() => {
    if (selectedDate && selectedAdvisor) {
      generateTimeSlots();
    }
  }, [selectedDate, selectedAdvisor]);

  const generateTimeSlots = async () => {
    // Generate slots from 9 AM to 5 PM
    const slots: TimeSlot[] = [];
    for (let hour = 9; hour < 17; hour++) {
      slots.push({ time: `${hour}:00`, available: true });
      slots.push({ time: `${hour}:30`, available: true });
    }

    // Check existing appointments for this advisor on this date
    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);

    const q = query(
      collection(db, "appointments"),
      where("advisorId", "==", selectedAdvisor),
      where("startTime", ">=", Timestamp.fromDate(startOfDay)),
      where("startTime", "<=", Timestamp.fromDate(endOfDay))
    );

    const snapshot = await getDocs(q);
    const bookedTimes = snapshot.docs.map((doc) => {
      const startTime = doc.data().startTime.toDate();
      return `${startTime.getHours()}:${
        startTime.getMinutes() === 0 ? "00" : startTime.getMinutes()
      }`;
    });

    // Mark booked slots as unavailable
    const updatedSlots = slots.map((slot) => ({
      ...slot,
      available: !bookedTimes.includes(slot.time),
    }));

    setTimeSlots(updatedSlots);
  };

  const handleBookAppointment = async () => {
    if (!selectedAdvisor || !selectedDate || !selectedTime || !studentUid) {
      setMessage("Please select all fields");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const [hour, minute] = selectedTime.split(":").map(Number);
      const appointmentDate = new Date(selectedDate);
      appointmentDate.setHours(hour, minute, 0, 0);

      const endTime = new Date(appointmentDate);
      endTime.setMinutes(endTime.getMinutes() + 30); // 30-minute slots

      await addDoc(collection(db, "appointments"), {
        studentId: studentUid,
        advisorId: selectedAdvisor,
        startTime: Timestamp.fromDate(appointmentDate),
        endTime: Timestamp.fromDate(endTime),
        status: "scheduled",
        notes: "",
        createdAt: Timestamp.now(),
      });

      setMessage("Appointment booked successfully!");
      setSelectedTime("");
      generateTimeSlots(); // Refresh slots
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appointment Details</CardTitle>
        <CardDescription>
          Select an advisor, date, and time slot.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="advisor">Select Advisor</Label>
          <Select value={selectedAdvisor} onValueChange={setSelectedAdvisor}>
            <SelectTrigger id="advisor">
              <SelectValue placeholder="Choose an advisor" />
            </SelectTrigger>
            <SelectContent>
              {advisors.map((advisor) => (
                <SelectItem key={advisor.id} value={advisor.id}>
                  {advisor.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Select Date</Label>
          <Input
            id="date"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
          />
        </div>

        {timeSlots.length > 0 && (
          <div className="space-y-2">
            <Label>Available Time Slots</Label>
            <div className="grid grid-cols-4 gap-2">
              {timeSlots.map((slot) => (
                <Button
                  key={slot.time}
                  variant={selectedTime === slot.time ? "default" : "outline"}
                  disabled={!slot.available}
                  onClick={() => setSelectedTime(slot.time)}
                  className="w-full"
                >
                  {slot.time}
                </Button>
              ))}
            </div>
          </div>
        )}

        <Button
          onClick={handleBookAppointment}
          disabled={loading || !selectedTime}
          className="w-full"
        >
          <Calendar className="mr-2 h-4 w-4" />
          {loading ? "Booking..." : "Book Appointment"}
        </Button>

        {message && (
          <p
            className={`text-sm ${
              message.includes("Error") ? "text-red-500" : "text-green-500"
            }`}
          >
            {message}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
