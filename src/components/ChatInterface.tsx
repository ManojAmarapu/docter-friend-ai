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
      return "Hello! I'm HealthAI, your intelligent medical assistant. I can help with health questions, symptoms analysis, wellness advice, and medical document processing. What can I help you with today?";
    }

    // Specific health conditions and symptoms
    if (lowerMessage.includes('headache') || lowerMessage.includes('migraine')) {
      return "Headaches can have various causes - stress, dehydration, eye strain, or underlying conditions. For persistent headaches, I'd recommend consulting a healthcare provider. In the meantime, try staying hydrated, getting adequate rest, and managing stress. Would you like specific tips for headache relief?";
    }

    if (lowerMessage.includes('fever') || lowerMessage.includes('temperature')) {
      return "Fever is your body's natural response to fighting infection. Normal body temperature is around 98.6°F (37°C). If you have a fever above 101°F (38.3°C) that persists, please consult a healthcare provider. Stay hydrated and rest. What other symptoms are you experiencing?";
    }

    if (lowerMessage.includes('pain') || lowerMessage.includes('hurt') || lowerMessage.includes('ache')) {
      return "Pain can indicate various conditions depending on location and severity. For acute or severe pain, please seek immediate medical attention. For general aches, rest, ice/heat therapy, and over-the-counter pain relievers may help. Can you describe where the pain is located?";
    }

    if (lowerMessage.includes('diet') || lowerMessage.includes('nutrition') || lowerMessage.includes('food')) {
      return "Good nutrition is essential for health! A balanced diet should include fruits, vegetables, whole grains, lean proteins, and healthy fats. Stay hydrated and limit processed foods. Do you have specific dietary goals or restrictions I can help with?";
    }

    if (lowerMessage.includes('exercise') || lowerMessage.includes('workout') || lowerMessage.includes('fitness')) {
      return "Regular exercise is crucial for physical and mental health! Aim for at least 150 minutes of moderate aerobic activity weekly, plus strength training twice a week. Start gradually if you're new to exercise. What type of physical activity interests you?";
    }

    if (lowerMessage.includes('sleep') || lowerMessage.includes('tired') || lowerMessage.includes('insomnia')) {
      return "Quality sleep is vital for health! Adults need 7-9 hours nightly. Good sleep hygiene includes: consistent bedtime, comfortable environment, limiting screens before bed, and avoiding caffeine late in the day. Are you having trouble falling asleep or staying asleep?";
    }

    if (lowerMessage.includes('stress') || lowerMessage.includes('anxiety') || lowerMessage.includes('mental health')) {
      return "Mental health is just as important as physical health. Stress management techniques include deep breathing, meditation, regular exercise, and talking to someone you trust. If you're experiencing persistent anxiety or depression, please consider speaking with a mental health professional. What's causing you stress?";
    }

    // Medicine and treatment queries
    if (lowerMessage.includes('medicine') || lowerMessage.includes('medication') || lowerMessage.includes('drug')) {
      return "I can provide general information about medications, but never replace professional medical advice. Always consult your doctor or pharmacist about specific medications, dosages, and interactions. What medication information are you looking for?";
    }

    // Emergency situations
    if (lowerMessage.includes('emergency') || lowerMessage.includes('urgent') || lowerMessage.includes('severe')) {
      return "For medical emergencies, please call emergency services immediately (911 in the US). Signs requiring immediate attention include: chest pain, difficulty breathing, severe bleeding, loss of consciousness, or stroke symptoms. Is this an emergency situation?";
    }

    // General health queries
    if (lowerMessage.includes('health') || lowerMessage.includes('symptoms') || lowerMessage.includes('doctor') || 
        lowerMessage.includes('treatment') || lowerMessage.includes('wellness') || lowerMessage.includes('medical')) {
      return "I'm here to help with health-related questions! I can provide general health information, wellness tips, and guidance on when to seek professional care. Remember, I'm an AI assistant and my advice doesn't replace professional medical consultation. What specific health topic interests you?";
    }

    // Help requests
    if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
      return "I'm HealthAI, and I can help you with:\n• Health and wellness guidance\n• Symptom information and advice\n• Medical document analysis\n• Nutrition and fitness tips\n• When to seek professional care\n• General health education\n\nWhat health topic would you like to explore?";
    }

    // Thank you responses
    if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
      return "You're very welcome! I'm always here to help with your health questions and concerns. Stay healthy and feel free to ask anything else!";
    }

    // Document queries
    if (lowerMessage.includes('document') || lowerMessage.includes('analyze') || lowerMessage.includes('upload')) {
      return "I can analyze medical documents, lab reports, prescriptions, and health records. Upload your documents in the Document Manager section, and I'll help extract key information and provide insights. What type of document would you like me to analyze?";
    }

    // Insurance queries
    if (lowerMessage.includes('claim') || lowerMessage.includes('insurance') || lowerMessage.includes('policy')) {
      return "I can help with medical insurance questions, including understanding coverage, claim processes, and policy benefits. What insurance-related question do you have?";
    }

    // General conversation - more contextual
    if (lowerMessage.includes('how are you') || lowerMessage.includes('how do you feel')) {
      return "I'm doing well and ready to help! As an AI health assistant, I'm here 24/7 to support your health and wellness journey. How are you feeling today?";
    }

    if (lowerMessage.includes('what') || lowerMessage.includes('how') || lowerMessage.includes('why') || lowerMessage.includes('when')) {
      return "I'd be happy to help answer your question! Could you provide more specific details about what you'd like to know? I'm especially knowledgeable about health, wellness, and medical topics.";
    }

    // Default response that encourages health-related conversation
    return "I'm here to help with your health and wellness needs! Whether you have questions about symptoms, need wellness advice, want to discuss nutrition and fitness, or need help with medical documents, I'm ready to assist. What's on your mind today?";
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
        <ScrollArea ref={scrollAreaRef} className={`${messages.length <= 2 ? 'h-[400px]' : 'h-[500px]'} p-4`}>
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
            placeholder="Ask about your health, symptoms, wellness tips, or medical documents..."
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