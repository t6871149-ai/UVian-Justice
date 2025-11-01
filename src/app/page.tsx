
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Logo } from "@/components/icons/logo";

export default function HomePage() {
  const bgImage = PlaceHolderImages.find((img) => img.id === "auth-background");

  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-4 flex justify-between items-center bg-background/80 backdrop-blur-sm sticky top-0 z-40 border-b">
         <Link href="/" className="flex items-center gap-2">
            <Logo className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold font-headline">UVian Justice - Nyay Sahayak</h1>
         </Link>
        <div className="space-x-2">
          <Button variant="ghost" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
      </header>
      <main className="flex-1">
        <section className="relative h-[60vh] flex items-center justify-center text-center">
            {bgImage && (
                <Image
                    src={bgImage.imageUrl}
                    alt={bgImage.description}
                    data-ai-hint={bgImage.imageHint}
                    fill
                    className="object-cover dark:brightness-[0.2] brightness-[0.8] grayscale-[30%]"
                />
            )}
            <div className="absolute inset-0 bg-black/30"></div>
            <div className="relative z-10 px-4 text-primary-foreground animate-in fade-in-50 slide-in-from-bottom-5 duration-500">
                <h2 className="text-4xl md:text-6xl font-bold font-headline">Your AI Legal Assistant for Indian Law</h2>
                <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl">
                    Get initial guidance, understand complex legal sections, and draft notices with the power of AI, grounded in the Indian legal framework.
                </p>
                <div className="mt-8">
                    <Button size="lg" asChild className="transition-transform duration-200 hover:scale-105">
                        <Link href="/signup">
                            Get Started Free
                            <ArrowRight className="ml-2"/>
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
        <section className="py-16 bg-background animate-in fade-in-50 slide-in-from-bottom-10 duration-700">
            <div className="container mx-auto px-4">
                <h3 className="text-3xl font-bold text-center mb-12">Features</h3>
                <div className="grid md:grid-cols-3 gap-8 text-center">
                    <div className="p-6 border rounded-lg shadow-sm bg-card transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                        <h4 className="font-semibold text-xl mb-2">Initial Legal Advice</h4>
                        <p className="text-muted-foreground">Ask legal questions and receive preliminary advice based on Indian law.</p>
                    </div>
                    <div className="p-6 border rounded-lg shadow-sm bg-card transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                        <h4 className="font-semibold text-xl mb-2">Document Summarization</h4>
                        <p className="text-muted-foreground">Upload and summarize legal documents to extract key points.</p>
                    </div>
                    <div className="p-6 border rounded-lg shadow-sm bg-card transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                        <h4 className="font-semibold text-xl mb-2">Draft Legal Notices</h4>
                        <p className="text-muted-foreground">Generate draft legal notices for various disputes and issues.</p>
                    </div>
                </div>
            </div>
        </section>
      </main>
      <footer className="p-4 text-center border-t text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} UVian Justice. All Rights Reserved.</p>
        <p>This is an AI-powered assistant for informational purposes only. Not a substitute for a qualified lawyer.</p>
      </footer>
    </div>
  );
}
