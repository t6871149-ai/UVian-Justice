"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { signUpWithEmail, signInWithGoogle } from "@/actions/auth";
import { SignUpSchema } from "@/lib/schemas";
import { Loader2 } from "lucide-react";
import { GoogleIcon } from "../icons/google-icon";

export function SignUpForm() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: z.infer<typeof SignUpSchema>) => {
    startTransition(async () => {
      const result = await signUpWithEmail(values);
      if (result.error) {
        toast({
          title: "Sign Up Failed",
          description: result.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success!",
          description: "Your account has been created.",
        });
        // Redirect is handled by the parent client component
      }
    });
  };

  const onGoogleSignIn = () => {
    startTransition(async () => {
      const result = await signInWithGoogle();
      if (result.error) {
        toast({
          title: "Google Sign-In Failed",
          description: result.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "You are now logged in with Google.",
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
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create account
        </Button>
         <Button variant="outline" type="button" className="w-full" onClick={onGoogleSignIn} disabled={isPending}>
           {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon className="mr-2 h-4 w-4"/>}
          Sign up with Google
        </Button>
      </form>
    </Form>
  );
}
