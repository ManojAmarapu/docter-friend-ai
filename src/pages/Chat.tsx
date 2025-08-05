import { ChatInterface } from "@/components/ChatInterface";

const Chat = () => {
  return (
    <div className="h-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Document AI Chat</h1>
        <p className="text-muted-foreground">
          Ask me about insurance claims, policy coverage, document analysis, or natural language queries.
        </p>
      </div>
      <ChatInterface />
    </div>
  );
};

export default Chat;