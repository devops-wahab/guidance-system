"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import { loginSchema } from "@/lib/auth-schemas";
import { toast } from "sonner";

export function LoginForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Helper function to get friendly error messages
  const getFriendlyErrorMessage = (error: any): string => {
    const errorCode = error.code;

    switch (errorCode) {
      case "auth/user-not-found":
        return "No account found with this email address.";
      case "auth/wrong-password":
        return "Incorrect password. Please try again.";
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      case "auth/user-disabled":
        return "This account has been disabled. Please contact support.";
      case "auth/too-many-requests":
        return "Too many failed login attempts. Please try again later.";
      case "auth/network-request-failed":
        return "Network error. Please check your connection and try again.";
      case "auth/invalid-credential":
        return "Invalid email or password. Please check your credentials.";
      default:
        return error.message || "Failed to sign in. Please try again.";
    }
  };

  function onSubmit(values: z.infer<typeof loginSchema>) {
    startTransition(async () => {
      try {
        // Step 1: Sign in with Firebase client SDK
        const userCredential = await signInWithEmailAndPassword(
          auth,
          values.email,
          values.password,
        );

        // Step 2: Get ID token
        const idToken = await userCredential.user.getIdToken();

        // Step 3: Create session cookie via server action
        const { createSessionCookie } = await import("@/lib/auth-actions");
        const result = await createSessionCookie(idToken);

        if (result.error) {
          toast.error(result.error);
          return;
        }

        // Step 4: Get user role from token
        const tokenResult = await userCredential.user.getIdTokenResult();
        const userRole = tokenResult.claims.role as string;

        // Step 5: Sign out from client (session cookie handles auth now)
        await auth.signOut();

        // Step 6: Redirect based on role
        toast.success("Signed in successfully");

        switch (userRole) {
          case "admin":
            router.push("/admin");
            break;
          case "advisor":
            router.push("/advisor");
            break;
          case "student":
          default:
            router.push("/student");
            break;
        }
      } catch (err: any) {
        const friendlyMessage = getFriendlyErrorMessage(err);
        toast.error(friendlyMessage);
      }
    });
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4 w-full">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Login
          </CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        className="placeholder:text-sm placeholder:text-muted-foreground/60"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="your password"
                        className="placeholder:text-sm placeholder:text-muted-foreground/60"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? "Signing in..." : "Sign in"}
              </Button>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="underline hover:text-primary">
                  Register
                </Link>
              </div>
            </CardFooter>
          </form>
        </Form>
      </Card>
      <Link href="/" className="text-sm text-muted-foreground hover:underline">
        Back to Home
      </Link>
    </div>
  );
}
