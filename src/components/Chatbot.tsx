import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles, AlertCircle } from 'lucide-react';

interface ChatMessage {
  sender: 'bot' | 'user';
  text: string;
  type?: 'clinical' | 'emergency' | 'general' | 'error';
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userName, setUserName] = useState<string | null>(localStorage.getItem('pandere_user_name'));
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    // Initial Greeting Logic (Lazy Initializer prevents cascading renders)
    const hour = new Date().getHours();
    let greetingStr = "Hello";
    if (hour < 12) greetingStr = "Good morning";
    else if (hour < 17) greetingStr = "Good afternoon";
    else greetingStr = "Good evening";

    const savedName = localStorage.getItem('pandere_user_name');
    const welcomeMsg = savedName 
      ? `Good to see you again, ${savedName}! How is your smile feeling today?`
      : `${greetingStr}! I'm the Clinical Care Assistant at Dr. Vinay's clinic. I'm here to support your dental journey. How are you feeling today?`;
    
    return [{ sender: 'bot', text: welcomeMsg }];
  });
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen, isTyping]);

  const handleSend = () => {
    if (!input.trim() || isTyping) return;

    const userText = input.trim();
    // VITAL: Ensure user message is added to state immediately
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInput('');
    setIsTyping(true);

    const delay = Math.min(Math.max(userText.length * 10, 800), 1800);

    setTimeout(() => {
      const lowerInput = userText.toLowerCase();
      let botResponse = "";
      let responseType: ChatMessage['type'] = 'general';

      // Feature 2: Strict & Professional Dental Domain Gatekeeper
      const dentalKeywords = [
        'tooth', 'teeth', 'dentist', 'pain', 'ache', 'gum', 'root canal', 'rct', 'braces', 'aligner', 
        'implant', 'cleaning', 'scaling', 'extraction', 'crown', 'bridge', 'filling', 'cavity', 'white',
        'veneer', 'denture', 'mumbai', 'gorai', 'appointment', 'schedule', 'book', 'cost', 'price',
        'dr. pandere', 'dentistry', 'oral', 'smile', 'bleeding', 'swelling', 'wisdom', 'sensitivity'
      ];

      const unrelatedKeywords = [
        'back pain', 'fever', 'headache', 'stomach', 'flu', 'covid', 'cancer', 'leg', 'arm', 'heart',
        'blood pressure', 'diabetes', 'prescription', 'surgery'
      ];

      const isDentalRelated = dentalKeywords.some(k => lowerInput.includes(k));
      const isUnrelated = unrelatedKeywords.some(k => lowerInput.includes(k));

      // 1. Unrelated Clinical Query (Strict Refusal)
      if (isUnrelated || (!isDentalRelated && lowerInput.length > 15 && !lowerInput.includes('name') && !lowerInput.includes('joke'))) {
        botResponse = "To ensure your clinical safety, I am strictly calibrated to provide advice on dental health and oral hygiene only. For general medical concerns, please consult a primary care physician. If you have a question about your teeth or smile, I'd be happy to assist!";
        responseType = 'error';
      }
      // 2. Greeting
      else if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
        botResponse = userName 
          ? `Welcome back, ${userName}! Is there something specific bothering your teeth today?`
          : "Hello! I'm the Clinical Assistant for Pandere Clinic. How may I assist with your dental health today?";
      } 
      // 3. Name Identity
      else if (lowerInput.includes('my name is')) {
        const name = userText.split('is').pop()?.trim() || "friend";
        setUserName(name);
        localStorage.setItem('pandere_user_name', name);
        botResponse = `A pleasure, ${name}! Are we looking to discuss a specific treatment or just a routine checkup?`;
      }
      // 4. Emergency Triage
      else if (lowerInput.includes('emergency') || lowerInput.includes('severe pain') || lowerInput.includes('bleeding')) {
        botResponse = "I'm sorry you're in pain. For severe dental trauma or uncontrollable bleeding, please use our direct emergency hotline. Should I show you the contact details right now?";
        responseType = 'emergency';
      }
      // 5. Clinical Specifics
      else if (lowerInput.includes('cost') || lowerInput.includes('price') || lowerInput.includes('emi')) {
        botResponse = "We prioritize financial transparency. Most major treatments like RCTs and Implants are eligible for our 0% EMI plans. Which treatment specifically are you considering?";
      }
      // 6. Generic Professional Handoff
      else {
        botResponse = "That's helpful context. Dr. Pandere focuses on precision care for exactly these kinds of concerns. Would you like to check our live schedule for a quick consultation?";
      }

      setMessages(prev => [...prev, { sender: 'bot', text: botResponse, type: responseType }]);
      setIsTyping(false);

      // Follow-up Feedback Loop
      setTimeout(() => {
        setMessages(prev => {
          const lastMsg = prev[prev.length - 1];
          if (lastMsg && lastMsg.sender === 'bot' && lastMsg.type !== 'error') {
            return [...prev, { sender: 'bot', text: "Just checking in—did that help clarify things, or should I explain our clinical approach further? 😊" }];
          }
          return prev;
        });
      }, 15000);

    }, delay);
  };

  const scrollToBooking = () => {
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
    setIsOpen(false);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 left-6 z-[100] w-14 h-14 rounded-full liquid-glass-strong text-white flex items-center justify-center hover:scale-110 shadow-2xl transition-all ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="fixed bottom-6 left-6 z-[100] w-80 sm:w-96 liquid-glass-strong rounded-[2rem] overflow-hidden shadow-2xl flex flex-col border border-white/20 animate-in slide-in-from-bottom-5">
          
          <div className="px-6 py-5 bg-white/5 border-b border-white/10 flex items-center justify-between backdrop-blur-3xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                  <span className="text-sm font-bold text-white tracking-tight">Clinical Assistant</span>
                  <span className="text-[10px] text-green-400 font-bold uppercase tracking-widest">Active • Gorai 1</span>
               </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 h-[400px] overflow-y-auto flex flex-col gap-5 custom-scrollbar bg-white/[0.02]">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 max-w-[90%] ${msg.sender === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border ${msg.sender === 'user' ? 'bg-white text-black border-white' : msg.type === 'error' ? 'bg-red-500/20 border-red-500/20' : 'bg-white/5 border-white/10'}`}>
                  {msg.sender === 'bot' ? (
                    msg.type === 'emergency' ? <AlertCircle className="w-4 h-4 text-red-400" /> : <Bot className="w-4 h-4 text-white" />
                  ) : <User className="w-4 h-4" />}
                </div>
                <div className={`px-5 py-4 rounded-2xl text-[13px] leading-relaxed shadow-xl ${msg.sender === 'user' ? 'bg-white/30 text-white font-medium border border-white/20 backdrop-blur-md rounded-tr-none' : 'bg-white/10 text-white/90 border border-white/10 rounded-tl-none'}`}>
                  {msg.text}
                  {msg.text.includes('schedule') && (
                    <button onClick={scrollToBooking} className="mt-3 block w-full py-3 bg-white text-black rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:scale-[1.02] transition-all">
                      Check Availability
                    </button>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-3 self-start animate-pulse">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/5">
                  <Bot className="w-4 h-4 text-white/40" />
                </div>
                <div className="px-5 py-3 rounded-2xl bg-white/5 border border-white/5 text-white/30 text-xs font-medium">
                  Reviewing clinical logic...
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="p-4 bg-white/5 border-t border-white/10 flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about dental pain, costs, visits..." 
              className="flex-1 bg-white/10 border border-white/10 rounded-2xl px-5 py-3 text-white outline-none focus:border-white/40 transition-all text-sm placeholder:text-white/20"
              disabled={isTyping}
            />
            <button 
              onClick={handleSend}
              disabled={isTyping || !input.trim()}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isTyping || !input.trim() ? 'bg-white/5 text-white/10' : 'bg-white text-black hover:scale-105 active:scale-95 shadow-lg'}`}
            >
              <Send className="w-5 h-5 ml-0.5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
