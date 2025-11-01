"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { createUserDocument } from "@/actions/auth";
import { LoginSchema } from "@/lib/schemas";
import { Loader2 } from "lucide-react";
import { GoogleIcon } from "../icons/google-icon";
import { 
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { getFirebaseClient } from "@/lib/firebase";

export function LoginForm() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const { auth } = getFirebaseClient();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleAuthSuccess = async (user: { uid: string; email: string | null; displayName?: string | null; photoURL?: string | null; }) => {
    // This will create the document if it doesn't exist, or merge it if it does.
    await createUserDocument({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    });
    toast({
      title: "Success",
      description: "You are now logged in.",
    });
    // Redirect is handled by the parent client component
  };

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    if (!auth) return;
    startTransition(async () => {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
        await handleAuthSuccess(userCredential.user);
      } catch (error: any) {
         if (error.code === 'auth/invalid-credential') {
            toast({
              title: "Login Failed",
              description: "Invalid email or password.",
              variant: "destructive",
            });
        } else {
           toast({
            title: "Login Failed",
            description: error.message || "An unexpected error occurred.",
            variant: "destructive",
          });
        }
      }
    });
  };

  const onGoogleSignIn = () => {
    if (!auth) return;
    startTransition(async () => {
       try {
        const provider = new GoogleAuthProvider();
        const userCredential = await signInWithPopup(auth, provider);
        await handleAuthSuccess(userCredential.user);
      } catch (error: any) {
        toast({
          title: "Google Sign-In Failed",
          description: error.message || "Failed to sign in with Google.",
          variant: "destructive",
        });
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="name@example.com"
                  {...field}
                  disabled={isPending}
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
              <div className="flex items-center">
                <FormLabel>Password</FormLabel>
                <Link
                  href="#"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <FormControl>
                <Input type="password" {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Login
        </Button>
        <Button variant="outline" type="button" className="w-full" onClick={onGoogleSignIn} disabled={isPending}>
           {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon className="mr-2 h-4 w-4"/>}
          Login with Google
        </Button>
      </form>
    </Form>
  );
}
