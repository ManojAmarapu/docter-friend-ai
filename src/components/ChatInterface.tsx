import { useState, useRef, useEffect } from "react";
import { Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm DocumentAI, your LLM document processing assistant. I can help you process insurance queries, analyze policy documents, and provide structured decisions with JSON responses. Try asking about claim scenarios like '46-year-old male, knee surgery in Pune, 3-month policy' or upload documents for analysis!",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Insurance claim processing queries
    if (lowerMessage.includes('claim') || lowerMessage.includes('insurance') || lowerMessage.includes('policy')) {
      if (lowerMessage.includes('approve') || lowerMessage.includes('approved')) {
        return "Based on your query, I've analyzed the claim against policy terms. The claim appears to meet coverage criteria. I would need to review the specific policy clauses, patient age, procedure type, and waiting period to provide a detailed decision with amount calculation.";
      }
      if (lowerMessage.includes('reject') || lowerMessage.includes('denied')) {
        return "I can help analyze why a claim might be rejected. Common reasons include: exceeding policy limits, procedures not covered, insufficient waiting period, or missing documentation. Please provide more details about the specific case for detailed analysis.";
      }
      return "I can help process insurance claims and queries. Please provide details like patient age, procedure type, location, policy duration, and any specific coverage questions. I'll analyze against policy documents and provide structured decisions.";
    }
    
    // Document analysis queries
    if (lowerMessage.includes('document') || lowerMessage.includes('analyze') || lowerMessage.includes('extract')) {
      return "I can analyze various document types including PDFs, contracts, and emails. I use semantic understanding to extract key information, identify relevant clauses, and provide structured responses. What type of document would you like me to process?";
    }
    
    // Query processing
    if (lowerMessage.includes('query') || lowerMessage.includes('search') || lowerMessage.includes('find')) {
      return "I can process natural language queries to find relevant information from documents. I parse queries to identify key details like age, procedure, location, and policy terms, then search using semantic matching rather than just keywords. Try asking about a specific scenario!";
    }
    
    // Age, procedure, location pattern matching
    if (lowerMessage.match(/\d+/) && (lowerMessage.includes('year') || lowerMessage.includes('old'))) {
      const age = lowerMessage.match(/\d+/)?.[0];
      if (lowerMessage.includes('surgery') || lowerMessage.includes('procedure')) {
        return `I've identified a ${age}-year-old patient query involving a medical procedure. To provide a complete analysis, I would evaluate this against policy clauses considering age-related coverage, procedure eligibility, waiting periods, and geographical factors. Would you like me to process this as a formal claim query?`;
      }
    }
    
    // Policy and coverage queries
    if (lowerMessage.includes('coverage') || lowerMessage.includes('eligible') || lowerMessage.includes('waiting')) {
      return "I can help determine coverage eligibility by analyzing policy terms, waiting periods, geographical restrictions, and procedure classifications. Please provide the specific scenario details, and I'll evaluate against the relevant policy clauses.";
    }
    
    return "I'm DocumentAI, specialized in processing insurance claims and document analysis. I can help with: analyzing policy documents, processing natural language queries, determining claim eligibility, extracting structured information from documents, and providing JSON responses with decisions and justifications. What would you like me to help you with?";
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: messages.length + 2,
        text: generateAIResponse(inputMessage),
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Messages */}
      <Card className="flex-1 mb-4 border-border shadow-soft">
        <ScrollArea ref={scrollAreaRef} className="h-[500px] p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.sender === 'ai' && (
                  <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center shadow-medical flex-shrink-0">
                    <Bot className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
                
                <div
                  className={`max-w-[80%] rounded-lg p-3 shadow-soft ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card border border-border'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <p className={`text-xs mt-2 opacity-70 ${
                    message.sender === 'user' ? 'text-primary-foreground' : 'text-muted-foreground'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
                
                {message.sender === 'user' && (
                  <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center shadow-soft flex-shrink-0">
                    <User className="w-4 h-4 text-accent-foreground" />
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center shadow-medical flex-shrink-0">
                  <Bot className="w-4 h-4 text-primary-foreground" />
                </div>
                <div className="bg-card border border-border rounded-lg p-3 shadow-soft">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </Card>

      {/* Message Input */}
      <Card className="p-4 border-border shadow-soft">
        <div className="flex gap-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about insurance claims, policy coverage, or document analysis..."
            className="flex-1 border-border focus:ring-primary"
            disabled={isTyping}
          />
          <Button 
            onClick={handleSendMessage}
            disabled={isTyping || !inputMessage.trim()}
            className="bg-gradient-primary hover:shadow-glow transition-spring shadow-medical px-6"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
}