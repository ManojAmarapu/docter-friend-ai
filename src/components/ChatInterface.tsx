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
    
    // Greeting responses
    if (lowerMessage.includes('hi') || lowerMessage.includes('hello') || lowerMessage.includes('hey')) {
      const greetings = [
        "Hello! I'm your LLM Document Processing assistant. I can help you analyze insurance policies, process claims, and extract key information from documents. What would you like me to help you with?",
        "Hi there! I specialize in processing natural language queries for document analysis. You can ask me about insurance claims, policy coverage, or upload documents for analysis.",
        "Hey! I'm here to help with document processing and insurance queries. Try asking about a specific claim scenario or upload a document to get started!"
      ];
      return greetings[Math.floor(Math.random() * greetings.length)];
    }

    // Help requests
    if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
      return "I can help you with:\n• Processing natural language insurance queries\n• Analyzing policy documents and contracts\n• Extracting clauses and key information\n• Determining claim eligibility and amounts\n• Providing structured JSON responses with justifications\n\nTry asking: '25-year-old female, dental surgery in Mumbai, 6-month policy'";
    }

    // Thank you responses
    if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
      return "You're welcome! Feel free to ask me about any insurance queries or document analysis needs. I'm here to help with claim processing and policy analysis.";
    }

    // Specific query pattern matching (age + procedure + location)
    const ageMatch = lowerMessage.match(/(\d+)[-\s]?(year|yr|y|m|f|male|female)/i);
    const locationMatch = lowerMessage.match(/\b(mumbai|pune|delhi|bangalore|chennai|kolkata|hyderabad|ahmedabad|jaipur|lucknow)\b/i);
    const procedureMatch = lowerMessage.match(/\b(surgery|operation|treatment|procedure|therapy|consultation|checkup|scan|test)\b/i);
    
    if (ageMatch && (procedureMatch || locationMatch)) {
      const age = ageMatch[1];
      const procedure = procedureMatch?.[1] || 'medical procedure';
      const location = locationMatch?.[1] || 'specified location';
      
      return `I've parsed your query: ${age}-year-old patient requiring ${procedure} in ${location}. Based on standard policy analysis, I would evaluate:\n\n✓ Age eligibility criteria\n✓ Procedure coverage terms\n✓ Geographic restrictions\n✓ Waiting period requirements\n\nWould you like me to process this as a formal claim with JSON response including decision, amount, and clause justifications?`;
    }

    // Insurance claim processing queries
    if (lowerMessage.includes('claim') || lowerMessage.includes('insurance') || lowerMessage.includes('policy')) {
      const responses = [
        "I can process insurance claims by analyzing policy documents against your query. Please provide patient details like age, procedure type, location, and policy duration for structured analysis.",
        "For claim processing, I'll parse your natural language query, extract key details, match against policy clauses, and provide a JSON response with decision and justification.",
        "I specialize in insurance claim evaluation. Give me details like '30M, heart surgery, Delhi, 2-year policy' and I'll provide structured decision analysis."
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Document analysis queries
    if (lowerMessage.includes('document') || lowerMessage.includes('analyze') || lowerMessage.includes('extract') || lowerMessage.includes('upload')) {
      const responses = [
        "I can analyze various document types including insurance policies, contracts, and emails. Upload documents in the Document Manager section, and I'll extract relevant clauses and key information.",
        "For document analysis, I use semantic understanding to identify important clauses, coverage terms, and policy conditions. What type of document would you like me to process?",
        "I extract structured information from unstructured documents. Upload PDFs, Word files, or emails, and I'll provide clause mapping and semantic analysis."
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // JSON/structured response queries
    if (lowerMessage.includes('json') || lowerMessage.includes('structured') || lowerMessage.includes('decision')) {
      return "I provide structured JSON responses with:\n• Decision (approved/rejected)\n• Amount (if applicable)\n• Justification with specific clause references\n• Confidence scores and risk assessments\n\nTry giving me a claim scenario for a sample JSON response!";
    }

    // Default varied responses for other inputs
    const defaultResponses = [
      "I'm an LLM Document Processing System designed for insurance and legal document analysis. Ask me about claim scenarios, policy coverage, or document processing!",
      "I specialize in processing natural language queries against large document sets. Try asking about insurance claims or upload documents for analysis.",
      "I can help with semantic document search, clause extraction, and claim decision making. What specific query or document would you like me to process?",
      "As an AI document processor, I excel at understanding complex queries and mapping them to relevant policy clauses. How can I assist you today?"
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
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