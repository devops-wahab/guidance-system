import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Home, CheckCircle2 } from "lucide-react";

export default function HostelApplicationPage() {
  // Mock application status
  // const applicationStatus: "not_applied" | "submitted" | "approved" =
  //   "not_applied"; // Change to 'submitted' or 'approved' to test UI
  type ApplicationStatus = "not_applied" | "submitted" | "approved";

  const applicationStatus: ApplicationStatus =
    "not_applied" as ApplicationStatus;

  if (applicationStatus === "submitted") {
    return (
      <div className="container mx-auto py-8">
        <Card className="border-l-4 border-l-blue-500 bg-blue-50/10">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-blue-500" />
              <CardTitle>Application Submitted</CardTitle>
            </div>
            <CardDescription>
              Your hostel application for the 2025/2026 session has been
              received.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              <strong>Status:</strong> Pending Review
            </p>
            <p>
              <strong>Hostel Preferred:</strong> Block A (Male)
            </p>
            <Button className="mt-4" variant="outline" disabled>
              Withdraw Application
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 container mx-auto py-8">
      <div>
        <h1 className="text-3xl font-bold">Hostel Accommodation</h1>
        <p className="text-muted-foreground">
          Apply for campus accommodation for the 2025/2026 academic session.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Room Preferences</CardTitle>
            <CardDescription>
              Select your preferred hostel block and room type.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label className="text-base">Select Hostel Block</Label>
              <RadioGroup defaultValue="blockA">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="blockA" id="blockA" />
                  <Label htmlFor="blockA">
                    Block A (Male) - Near Faculty of Science
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="blockB" id="blockB" />
                  <Label htmlFor="blockB">
                    Block B (Female) - Near Library
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="blockC" id="blockC" />
                  <Label htmlFor="blockC">
                    Block C (Mixed) - New Extension
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <Label className="text-base">Room Type</Label>
              <RadioGroup defaultValue="4man">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="2man" id="2man" disabled />
                  <Label htmlFor="2man" className="text-muted-foreground">
                    2-Man Room (Unavailable)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="4man" id="4man" />
                  <Label htmlFor="4man">4-Man Room (Standard)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="8man" id="8man" />
                  <Label htmlFor="8man">8-Man Room (Economy)</Label>
                </div>
              </RadioGroup>
            </div>

            <Button className="w-full">Submit Application</Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="bg-muted/50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                <CardTitle className="text-lg">Fee Schedule</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between border-b pb-2">
                <span>4-Man Room</span>
                <span className="font-semibold">₦45,000 / Session</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span>8-Man Room</span>
                <span className="font-semibold">₦25,000 / Session</span>
              </div>
              <p className="pt-2 text-xs text-muted-foreground">
                * Fees are payable only after allocation is confirmed.
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-amber-500 bg-amber-50/10">
            <CardContent className="pt-6">
              <h4 className="font-semibold text-amber-900 mb-1">
                Important Note
              </h4>
              <p className="text-sm text-amber-800/80">
                Accommodation allocation is on a first-come, first-served basis.
                Priority is given to 100 Level and Final Year students.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
