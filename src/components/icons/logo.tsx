import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-6 w-6", className)}
    >
      <path d="M12 3v18" />
      <path d="M3 7h18" />
      <path d="M5 7a5 5 0 0 1 7-5 5 5 0 0 1 7 5" />
      <path d="M5 7c0 5.523 4.477 10 10 10" />
      <path d="M19 7c0 5.523-4.477 10-10 10" />
      <path d="M5 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0z" />
      <path d="M15 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0z" />
    </svg>
  );
}
