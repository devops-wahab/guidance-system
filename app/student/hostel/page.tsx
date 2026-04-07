import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Building2,
  MapPin,
  Receipt,
  Calendar,
} from "lucide-react";
import { getCurrentSessionName } from "@/lib/session-utils";
import { getHostelAllocation } from "@/lib/student-actions";
import { HostelBookingForm } from "@/components/student/HostelBookingForm";

export default async function HostelApplicationPage() {
  const currentSessionName = await getCurrentSessionName();
  const allocation = await getHostelAllocation();

  if (allocation) {
    return (
      <div className="container mx-auto py-10 space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-black tracking-tight">
            Your Accommodation
          </h1>
          <p className="text-muted-foreground">
            Details of your allocated hostel for the {currentSessionName}{" "}
            session.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="md:col-span-2 overflow-hidden border-2 border-primary/20">
            <div className="absolute top-0 right-0 p-4">
              <CheckCircle2 className="h-12 w-12 text-green-500/20" />
            </div>
            <CardHeader className="bg-primary/5 pb-8">
              <div className="flex items-center gap-3 text-primary mb-2">
                <Building2 className="h-6 w-6" />
                <span className="font-bold uppercase tracking-widest text-xs">
                  Allocation Confirmed
                </span>
              </div>
              <CardTitle className="text-4xl font-black">
                {allocation.roomId.split("_").slice(-2).join(" ").toUpperCase()}
              </CardTitle>
              <CardDescription className="text-base text-primary/70">
                {allocation.roomId.includes("boys")
                  ? "Boys Hostel"
                  : "Girls Hostel"}{" "}
                •{allocation.roomId.includes("_a") ? " Block A" : " Block B"}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 pt-8 sm:grid-cols-2">
              <div className="flex gap-4 items-start p-4 rounded-xl bg-muted/30 border border-border/50">
                <MapPin className="h-5 w-5 text-muted-foreground mt-1" />
                <div>
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-tighter">
                    Location
                  </p>
                  <p className="font-medium">Main Campus, North Wing</p>
                </div>
              </div>
              <div className="flex gap-4 items-start p-4 rounded-xl bg-muted/30 border border-border/50">
                <Calendar className="h-5 w-5 text-muted-foreground mt-1" />
                <div>
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-tighter">
                    Allocated On
                  </p>
                  <p className="font-medium">
                    {new Date(
                      allocation.allocatedAt.seconds * 1000,
                    ).toLocaleDateString(undefined, {
                      dateStyle: "long",
                    })}
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-start p-4 rounded-xl bg-muted/30 border border-border/50">
                <Receipt className="h-5 w-5 text-muted-foreground mt-1" />
                <div>
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-tighter">
                    Payment Reference
                  </p>
                  <code className="text-xs font-mono bg-background px-2 py-1 rounded border">
                    {allocation.paymentReference}
                  </code>
                </div>
              </div>
              <div className="flex gap-4 items-start p-4 rounded-xl bg-muted/30 border border-border/50">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-1" />
                <div>
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-tighter">
                    Status
                  </p>
                  <p className="font-bold text-green-600">Paid & Verified</p>
                </div>
              </div>
            </CardContent>
            <div className="p-6 bg-muted/5 border-t flex justify-end">
              <Button variant="outline" className="gap-2">
                <Receipt className="h-4 w-4" />
                Download Receipt
              </Button>
            </div>
          </Card>

          <Card className="bg-primary text-primary-foreground">
            <CardHeader>
              <CardTitle>Welcome Home!</CardTitle>
              <CardDescription className="text-primary-foreground/70">
                Next steps for your arrival.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <p>1. Print your allocation slip and payment receipt.</p>
              <p>
                2. Visit the Student Affairs office for key collection from
                Monday.
              </p>
              <p>3. Ensure you have your school ID card for clearance.</p>
              <div className="pt-4 border-t border-primary-foreground/20">
                <p className="italic text-xs opacity-70">
                  Contact student.affairs@university.edu for any assistance.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 container mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Hostel Booking</h1>
        <p className="text-sm text-muted-foreground">
          Browse available rooms and book instantly for the {currentSessionName}{" "}
          session.
        </p>
      </div>
      <HostelBookingForm />
    </div>
  );
}
