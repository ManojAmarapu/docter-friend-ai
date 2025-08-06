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
      text: "Hello! I'm DocumentAI, your intelligent assistant. I can help with health questions, document analysis, insurance queries, and general conversations. Feel free to ask me anything - whether it's about symptoms, wellness advice, document processing, or just want to chat!",
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
        "Hello! I'm DocumentAI, your intelligent assistant. I can help with health topics, document analysis, and general questions. What's on your mind?",
        "Hi there! I'm here to help with health advice, document processing, or just have a conversation. How can I assist you today?",
        "Hey! I'm your AI assistant ready to discuss health topics, analyze documents, or chat about anything. What would you like to know?"
      ];
      return greetings[Math.floor(Math.random() * greetings.length)];
    }

    // Health-related queries
    if (lowerMessage.includes('health') || lowerMessage.includes('symptoms') || lowerMessage.includes('medicine') || 
        lowerMessage.includes('doctor') || lowerMessage.includes('treatment') || lowerMessage.includes('pain') ||
        lowerMessage.includes('fever') || lowerMessage.includes('headache') || lowerMessage.includes('diet') ||
        lowerMessage.includes('exercise') || lowerMessage.includes('wellness')) {
      const healthResponses = [
        "I can help with health-related questions! However, please remember that I'm an AI assistant and my advice shouldn't replace professional medical consultation. What specific health topic would you like to discuss?",
        "Health is important! I can provide general health information and suggestions. For specific symptoms or conditions, it's always best to consult with a healthcare professional. What health question do you have?",
        "I'd be happy to discuss health topics with you. Whether it's about nutrition, exercise, general wellness, or symptoms, I can provide helpful information. What would you like to know about?"
      ];
      return healthResponses[Math.floor(Math.random() * healthResponses.length)];
    }

    // Help requests
    if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
      return "I can help you with:\n• Health and wellness questions\n• Document analysis and processing\n• Insurance policy queries\n• General conversations and advice\n• Processing natural language queries\n\nJust ask me anything you'd like to know!";
    }

    // Thank you responses
    if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
      const thankResponses = [
        "You're very welcome! I'm here whenever you need help with health questions, documents, or just want to chat.",
        "Happy to help! Feel free to ask me about anything else - health, documents, or general questions.",
        "My pleasure! Is there anything else I can assist you with today?"
      ];
      return thankResponses[Math.floor(Math.random() * thankResponses.length)];
    }

    // Medical procedure queries
    if (lowerMessage.includes('surgery') || lowerMessage.includes('operation') || lowerMessage.includes('procedure')) {
      return "If you're asking about a medical procedure, I can provide general information. However, for specific medical advice, please consult with a qualified healthcare professional. What procedure are you curious about?";
    }

    // Insurance claim processing queries
    if (lowerMessage.includes('claim') || lowerMessage.includes('insurance') || lowerMessage.includes('policy')) {
      const responses = [
        "I can help with insurance-related questions! Whether it's understanding policy terms, claim processes, or coverage details, feel free to ask.",
        "Insurance can be complex. I'm here to help explain policies, claims, and coverage. What specific insurance question do you have?",
        "I can assist with insurance queries and policy analysis. What would you like to know about your insurance or claims?"
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Document analysis queries
    if (lowerMessage.includes('document') || lowerMessage.includes('analyze') || lowerMessage.includes('extract') || lowerMessage.includes('upload')) {
      const responses = [
        "I can analyze documents for you! Upload them in the Document Manager section, and I'll help extract key information and analyze the content.",
        "Document analysis is one of my strengths. I can process various file types and extract meaningful information. What documents would you like me to analyze?",
        "I'm great at understanding and analyzing documents. Upload your files and I'll help you understand the key points and important information."
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    // General conversation responses
    const conversationalResponses = [
      "That's interesting! I'm here to help with various topics. Is there something specific you'd like to know or discuss?",
      "I'm listening! Whether it's about health, documents, or just general questions, I'm here to help. What's on your mind?",
      "I'd be happy to help you with that! Can you tell me more about what you're looking for?",
      "Feel free to ask me anything! I can discuss health topics, analyze documents, or just have a friendly conversation.",
      "I'm here to assist! Whether you need health advice, document analysis, or general information, just let me know how I can help."
    ];
    
    return conversationalResponses[Math.floor(Math.random() * conversationalResponses.length)];
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