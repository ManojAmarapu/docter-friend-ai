import { ChatInterface } from "@/components/ChatInterface";

const Chat = () => {
  return (
    <div className="h-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">DocumentAI Assistant</h1>
        <p className="text-muted-foreground">
          Your intelligent assistant for health advice, document analysis, and general conversations.
        </p>
      </div>
      <ChatInterface />
    </div>
  );
};

export default Chat;