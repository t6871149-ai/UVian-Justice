import { getChatHistory } from "@/actions/chat";
import { DashboardClient } from "@/components/dashboard/dashboard-client";
import type { ChatMessage } from "@/lib/types";

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const initialMessages = await getChatHistory();
  
  // Convert Timestamps to Dates
  const formattedMessages: ChatMessage[] = initialMessages.map(msg => ({
    ...msg,
    createdAt: msg.createdAt.toDate(),
  }));

  return <DashboardClient initialMessages={formattedMessages} />;
}
