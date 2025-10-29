import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Logo } from "@/components/icons/logo";

interface AuthLayoutProps {
  title: string;
  description: string;
  linkHref: string;
  linkText: string;
  children: React.ReactNode;
}

export function AuthLayout({
  title,
  description,
  linkHref,
  linkText,
  children,
}: AuthLayoutProps) {
  const bgImage = PlaceHolderImages.find((img) => img.id === "auth-background");

  return (
    <div className="w-full min-h-screen lg:grid lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <div className="flex items-center justify-center gap-2">
                <Logo className="h-8 w-8 text-primary"/>
                <h1 className="text-3xl font-bold font-headline">UVian Justice - Nyay Sahayak</h1>
            </div>
            <p className="text-balance text-muted-foreground mt-2">
                Your AI-powered legal assistant for Indian Law
            </p>
          </div>
          <Card className="mx-auto w-full max-w-md shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">{children}</div>
              <div className="mt-4 text-center text-sm">
                <Link href={linkHref} className="underline">
                  {linkText}
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="hidden bg-muted lg:block relative">
        {bgImage && (
          <Image
            src={bgImage.imageUrl}
            alt={bgImage.description}
            data-ai-hint={bgImage.imageHint}
            fill
            className="object-cover dark:brightness-[0.2] dark:grayscale"
          />
        )}
      </div>
    </div>
  );
}
