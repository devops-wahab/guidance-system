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
import { Badge } from "@/components/ui/badge";
import { getCurrentSessionName } from "@/lib/session-utils";
import { getHostelAllocation } from "@/lib/student-actions";
import { HostelBookingForm } from "@/components/student/HostelBookingForm";

export default async function HostelApplicationPage() {
  const currentSessionName = await getCurrentSessionName();
  const allocation = await getHostelAllocation();

  if (allocation) {
    return (
      <div className="container mx-auto space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Your Accommodation</h1>
          <p className="text-sm text-muted-foreground">
            Details of your allocated hostel for the {currentSessionName}{" "}
            session.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-12">
          <Card className="md:col-span-8 overflow-hidden">
            <CardHeader className="border-b bg-muted/20">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-primary">
                    <Building2 className="h-4 w-4" />
                    <span className="font-bold text-xs uppercase tracking-tight">
                      Confirmed Allocation
                    </span>
                  </div>
                  <CardTitle className="text-3xl font-bold tracking-tight">
                    {allocation.roomId
                      .split("_")
                      .slice(-2)
                      .join(" ")
                      .toUpperCase()}
                  </CardTitle>
                </div>
                <div className="text-right">
                  <Badge className="bg-green-500 hover:bg-green-500 text-white border-none">
                    Active
                  </Badge>
                  <p className="text-[10px] text-muted-foreground mt-1 uppercase">
                    Paid & Verified
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4 pt-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase">
                  Category
                </p>
                <p className="text-sm font-medium">
                  {allocation.roomId.includes("boys") ? "Boys" : "Girls"} Hostel
                  •{allocation.roomId.includes("_a") ? " Block A" : " Block B"}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase">
                  Allocated On
                </p>
                <p className="text-sm font-medium">
                  {new Date(
                    allocation.allocatedAt.seconds * 1000,
                  ).toLocaleDateString()}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase">
                  Ref No.
                </p>
                <code className="text-[11px] font-mono text-primary font-bold">
                  {allocation.paymentReference}
                </code>
              </div>
            </CardContent>
            <div className="px-6 py-4 bg-muted/10 border-t flex justify-end">
              <Button
                size="sm"
                variant="ghost"
                className="gap-2 text-xs font-bold uppercase tracking-wider"
              >
                <Receipt className="h-4 w-4" />
                View Receipt
              </Button>
            </div>
          </Card>

          <Card className="md:col-span-4 border-l-4 border-l-primary bg-primary/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm uppercase tracking-wider font-bold">
                Arrival Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3 text-xs text-muted-foreground leading-relaxed">
                <li className="flex gap-2">
                  <span className="font-bold text-primary">01.</span>
                  Print your allocation slip and payment receipt.
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-primary">02.</span>
                  Visit Student Affairs for key collection from Monday.
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-primary">03.</span>
                  Ensure you have your school ID card for clearance.
                </li>
              </ul>
              <div className="pt-4 border-t border-primary/10 text-[10px] text-muted-foreground italic">
                Support: student.affairs@university.edu
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
