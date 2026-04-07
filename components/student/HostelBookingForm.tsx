"use client";

import { useState, useEffect, useTransition } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Users2,
  Home,
  CheckCircle2,
  Loader2,
  CreditCard,
  Building2,
} from "lucide-react";
import {
  getHostelRooms,
  bookHostelRoom,
  HostelRoom,
} from "@/lib/student-actions";
import { Badge } from "@/components/ui/badge";

export function HostelBookingForm() {
  const [selectedBlock, setSelectedBlock] = useState<string>("boys_a");
  const [rooms, setRooms] = useState<HostelRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleBlockChange = async (blockId: string) => {
    setSelectedBlock(blockId);
    setSelectedRoom(null);
    setLoadingRooms(true);
    try {
      const data = await getHostelRooms(blockId);
      setRooms(data);
    } catch (error) {
      toast.error("Failed to load rooms");
    } finally {
      setLoadingRooms(false);
    }
  };
  useEffect(() => {
    handleBlockChange("boys_a");
  }, []);

  const handleBookAndPay = () => {
    if (!selectedRoom) return;

    startTransition(async () => {
      // Simulate Payment Gateway Redirect/Verification
      toast.loading("Redirecting to secure payment gateway...", {
        id: "payment",
      });

      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.loading("Verifying transaction...", { id: "payment" });

      const paymentRef = `HOSTEL-${Math.random().toString(36).substring(7).toUpperCase()}`;

      try {
        const result = await bookHostelRoom(selectedRoom, paymentRef);
        if (result.success) {
          toast.success("Payment successful! Room allocated.", {
            id: "payment",
          });
        } else {
          toast.error(result.error || "Failed to finalize booking", {
            id: "payment",
          });
        }
      } catch (error) {
        toast.error("Something went wrong", { id: "payment" });
      }
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Select Location</CardTitle>
            <CardDescription>
              Choose your preferred hostel block first.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <RadioGroup
              value={selectedBlock}
              onValueChange={handleBlockChange}
              className="grid gap-6"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                  <Users2 className="h-5 w-5 text-blue-500" />
                  <h3 className="font-semibold text-lg">Boys Hostel</h3>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Label
                    htmlFor="boys_a"
                    className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="font-bold">Block A</span>
                      <span className="text-xs text-blue-600">
                        Near Main Campus
                      </span>
                    </div>
                    <RadioGroupItem value="boys_a" id="boys_a" />
                  </Label>
                  <Label
                    htmlFor="boys_b"
                    className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="font-bold">Block B</span>
                      <span className="text-xs text-blue-600">Quiet Zone</span>
                    </div>
                    <RadioGroupItem value="boys_b" id="boys_b" />
                  </Label>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                  <Users2 className="h-5 w-5 text-pink-500" />
                  <h3 className="font-semibold text-lg">Girls Hostel</h3>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Label
                    htmlFor="girls_a"
                    className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="font-bold">Block A</span>
                      <span className="text-xs text-pink-600">Secure Wing</span>
                    </div>
                    <RadioGroupItem value="girls_a" id="girls_a" />
                  </Label>
                  <Label
                    htmlFor="girls_b"
                    className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="font-bold">Block B</span>
                      <span className="text-xs text-pink-600">Garden View</span>
                    </div>
                    <RadioGroupItem value="girls_b" id="girls_b" />
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Available Rooms</CardTitle>
            <CardDescription>
              Select an available room in{" "}
              {selectedBlock.includes("boys") ? "Boys" : "Girls"}{" "}
              {selectedBlock.endsWith("_a") ? "Block A" : "Block B"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingRooms ? (
              <div className="flex flex-col items-center justify-center py-12 gap-2 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin" />
                <p>Fetching real-time availability...</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {rooms.map((room) => {
                  const isFull = room.occupied >= room.capacity;
                  const available = room.capacity - room.occupied;

                  return (
                    <div
                      key={room.id}
                      onClick={() => !isFull && setSelectedRoom(room.id)}
                      className={`
                        group relative flex flex-col p-4 border rounded-xl transition-all duration-200
                        ${isFull ? "opacity-60 cursor-not-allowed bg-muted/20" : "cursor-pointer hover:border-primary hover:shadow-md"}
                        ${selectedRoom === room.id ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border"}
                      `}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <Building2
                            className={`h-5 w-5 ${selectedRoom === room.id ? "text-primary" : "text-muted-foreground"}`}
                          />
                          <span className="font-bold text-lg">
                            {room.roomNumber}
                          </span>
                        </div>
                        {isFull ? (
                          <Badge variant="destructive">Full</Badge>
                        ) : (
                          <Badge
                            variant="secondary"
                            className="bg-green-500/10 text-green-600 border-green-200"
                          >
                            {available} Bed{available > 1 ? "s" : ""} Left
                          </Badge>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Occupancy</span>
                          <span>
                            {room.occupied}/{room.capacity} beds taken
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full transition-all duration-500 ${isFull ? "bg-destructive" : available === 1 ? "bg-amber-500" : "bg-primary"}`}
                            style={{
                              width: `${(room.occupied / room.capacity) * 100}%`,
                            }}
                          />
                        </div>
                      </div>

                      {selectedRoom === room.id && (
                        <div className="absolute top-2 right-2">
                          <CheckCircle2 className="h-5 w-5 text-primary fill-background" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="sticky top-6">
          <CardHeader>
            <CardTitle className="text-lg">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Hostel Category</span>
                <span className="font-medium capitalize">
                  {selectedBlock.split("_")[0]} Hostel
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Block</span>
                <span className="font-medium">
                  {selectedBlock.endsWith("_a") ? "Block A" : "Block B"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Room</span>
                <span className="font-medium">
                  {selectedRoom
                    ? rooms.find((r) => r.id === selectedRoom)?.roomNumber
                    : "Not selected"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Room Type</span>
                <span className="font-medium">4-Man Standard</span>
              </div>
              <div className="pt-4 border-t flex justify-between items-center">
                <span className="font-bold text-lg">Total Amount</span>
                <span className="text-2xl font-black text-primary">
                  ₦45,000
                </span>
              </div>
            </div>

            <Button
              className="w-full h-14 text-lg font-bold gap-2 shadow-lg shadow-primary/20"
              disabled={!selectedRoom || isPending}
              onClick={handleBookAndPay}
            >
              {isPending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <CreditCard className="h-5 w-5" />
              )}
              {isPending ? "Processing..." : "Pay & Book Instantly"}
            </Button>

            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg text-[10px] text-muted-foreground">
              <CreditCard className="h-4 w-4 shrink-0" />
              <p>
                Secure payment processed by System Payment Gateway. Instant
                allocation upon success.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500 bg-amber-50/20">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <Home className="h-5 w-5 text-amber-600 shrink-0" />
              <div>
                <h4 className="font-semibold text-amber-900 mb-1">
                  Information
                </h4>
                <p className="text-sm text-amber-800/80 leading-snug">
                  Rooms are allocated in real-time. Your bed is only reserved
                  after a successful payment transaction.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
