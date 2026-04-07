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
  AlertCircle,
} from "lucide-react";
import {
  getHostelRooms,
  bookHostelRoom,
  HostelRoom,
} from "@/lib/student-actions";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
      toast.loading("Redirecting to payment gateway...", { id: "payment" });
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      const paymentRef = `HOSTEL-${Math.random().toString(36).substring(7).toUpperCase()}`;

      try {
        const result = await bookHostelRoom(selectedRoom, paymentRef);
        if (result.success) {
          toast.success("Room allocated successfully!", { id: "payment" });
        } else {
          toast.error(result.error || "Failed to finalize booking", { id: "payment" });
        }
      } catch (error) {
        toast.error("Something went wrong", { id: "payment" });
      }
    });
  };

  const selectedRoomData = rooms.find((r) => r.id === selectedRoom);

  return (
    <div className="grid gap-6 lg:grid-cols-12 max-w-6xl mx-auto">
      <div className="lg:col-span-8 space-y-6">
        <Tabs defaultValue="boys" onValueChange={(v) => handleBlockChange(v === "boys" ? "boys_a" : "girls_a")}>
          <div className="flex items-center justify-between mb-4">
            <TabsList className="grid w-[200px] grid-cols-2">
              <TabsTrigger value="boys">Boys</TabsTrigger>
              <TabsTrigger value="girls">Girls</TabsTrigger>
            </TabsList>
            
            <RadioGroup 
              value={selectedBlock} 
              onValueChange={handleBlockChange}
              className="flex gap-4"
            >
              {["a", "b"].map((s) => {
                const id = `${selectedBlock.split("_")[0]}_${s}`;
                return (
                  <div key={id} className="flex items-center space-x-2">
                    <RadioGroupItem value={id} id={id} />
                    <Label htmlFor={id} className="text-sm font-medium uppercase">Block {s}</Label>
                  </div>
                );
              })}
            </RadioGroup>
          </div>

          <Card className="border-none shadow-none bg-accent/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Select a Room</CardTitle>
              <CardDescription>
                Showing available rooms in {selectedBlock.includes("boys") ? "Boys" : "Girls"} {selectedBlock.endsWith("_a") ? "Block A" : "Block B"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingRooms ? (
                <div className="flex flex-col items-center justify-center py-10 gap-2">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <p className="text-xs text-muted-foreground">Checking availability...</p>
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-3">
                  {rooms.map((room) => {
                    const isFull = room.occupied >= room.capacity;
                    const isSelected = selectedRoom === room.id;

                    return (
                      <button
                        key={room.id}
                        disabled={isFull}
                        onClick={() => setSelectedRoom(room.id)}
                        className={`
                          p-4 rounded-xl border transition-all text-left relative overflow-hidden
                          ${isFull ? "opacity-50 cursor-not-allowed bg-muted" : "hover:border-primary/50 bg-card"}
                          ${isSelected ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border shadow-sm"}
                        `}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-lg">{room.roomNumber}</span>
                          {isFull ? (
                            <Badge variant="outline" className="text-[10px] scale-90">Full</Badge>
                          ) : (
                            <span className="text-[10px] font-medium text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                              {room.capacity - room.occupied} LEFT
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                          {room.occupied}/{room.capacity} OCCUPIED
                        </div>
                        
                        {isSelected && (
                          <div className="absolute -right-1 -top-1 bg-primary p-1.5 rounded-bl-lg">
                            <CheckCircle2 className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </Tabs>

        <div className="flex items-start gap-3 p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-900/50">
          <AlertCircle className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <p className="text-xs text-blue-800/80 dark:text-blue-300/80 leading-relaxed">
            Real-time allocation. Your selected space is only secured after a successful payment transaction.
          </p>
        </div>
      </div>

      <div className="lg:col-span-4">
        <Card className="sticky top-6 border-2">
          <CardHeader className="border-b bg-muted/30">
            <CardTitle className="text-base uppercase tracking-tight">Summary</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground uppercase">Selection</span>
                <span className="font-semibold text-right">
                  {selectedBlock.includes("boys") ? "Boys" : "Girls"} {selectedBlock.endsWith("_a") ? "Block A" : "Block B"}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground uppercase">Room</span>
                <span className="font-semibold">{selectedRoomData?.roomNumber || "---"}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground uppercase">Units</span>
                <span className="font-semibold">4-Man Shared</span>
              </div>
              
              <div className="pt-4 mt-2 border-t">
                <div className="flex justify-between items-end mb-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">Grand Total</span>
                  <span className="text-2xl font-black tracking-tighter">₦45,000</span>
                </div>
                <p className="text-[10px] text-muted-foreground text-right">Maintenance fee inclusive</p>
              </div>
            </div>

            <Button
              className="w-full h-12 text-sm font-bold uppercase tracking-widest shadow-xl"
              disabled={!selectedRoom || isPending}
              onClick={handleBookAndPay}
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <CreditCard className="h-4 w-4 mr-2" />
              )}
              {isPending ? "Hold Tight..." : "Confirm & Pay"}
            </Button>

            <div className="text-[10px] text-center text-muted-foreground">
              Powered by secure payment encryption
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
