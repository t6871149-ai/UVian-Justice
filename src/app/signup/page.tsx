import { SignUpForm } from "@/components/auth/signup-form";
import { AuthLayout } from "@/components/auth/auth-layout";
import { SignupClient } from "@/components/auth/signup-client";

export default function SignUpPage() {
  return (
    <SignupClient>
      <AuthLayout
        title="Create an Account"
        description="Get started with your AI legal assistant"
        linkHref="/"
        linkText="Already have an account? Sign In"
      >
        <SignUpForm />
      </AuthLayout>
    </SignupClient>
  );
}
