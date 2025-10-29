import { useAuth } from "@/context/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ChatMessageUserProps {
  content: string;
}

export function ChatMessageUser({ content }: ChatMessageUserProps) {
  const { user } = useAuth();
  return (
    <div className="flex items-start gap-4 justify-end">
      <div className="grid gap-1 flex-1">
        <div className="flex items-center gap-2 justify-end">
          <p className="font-semibold">You</p>
        </div>
        <div className="bg-primary text-primary-foreground p-3 rounded-lg max-w-prose">
          <p>{content}</p>
        </div>
      </div>
      <Avatar>
        <AvatarImage src={user?.photoURL ?? undefined} />
        <AvatarFallback>{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
    </div>
  );
}
