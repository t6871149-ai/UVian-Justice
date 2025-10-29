import { LoginForm } from "@/components/auth/login-form";
import { AuthLayout } from "@/components/auth/auth-layout";
import { LoginClient } from "@/components/auth/login-client";

export default function LoginPage() {
  return (
    <LoginClient>
      <AuthLayout
        title="Welcome Back"
        description="Sign in to access your dashboard"
        linkHref="/signup"
        linkText="Don't have an account? Sign Up"
      >
        <LoginForm />
      </AuthLayout>
    </LoginClient>
  );
}
