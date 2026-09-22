import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Send, X, Sparkles, HelpCircle } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { getSavedFarmProfile, computeWaterIntelligence } from '../services/waterIntelligenceService';
import './VoiceAssistant.css';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const VoiceAssistant = () => {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize initial welcome message based on language
  useEffect(() => {
    let welcome = "Namaste! I am your AgriRakshak Voice Advisor. Ask me about irrigation, rainfall, groundwater, or crop status!";
    if (language === 'mr') {
      welcome = "नमस्कार! मी तुमचा ॲग्रीरक्षक सहाय्यक आहे. मला पाणी, पाऊस, भूजल किंवा पीक स्थितीबद्दल विचारा!";
    } else if (language === 'hi') {
      welcome = "नमस्ते! मैं आपका एग्रीरक्षक सहायक हूँ। मुझसे सिंचाई, बारिश, भूजल या फसल की स्थिति के बारे में पूछें!";
    }

    setMessages([
      {
        id: 'init-1',
        sender: 'assistant',
        text: welcome,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, [language]);

  // Initialize Web Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = language === 'mr' ? 'mr-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';

      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const resultTranscript = event.results[current][0].transcript;
        setInputText(resultTranscript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert(language === 'mr' ? 'आपल्या ब्राउझरमध्ये व्हॉइस इनपुट समर्थित नाही. कृपया टाइप करा.' : 'Voice recognition is not supported in this browser. Please type your query.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.lang = language === 'mr' ? 'mr-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error('Speech recognition start failed', err);
        setIsListening(false);
      }
    }
  };

  const processFarmerQuery = (query: string) => {
    const q = query.toLowerCase();
    const profile = getSavedFarmProfile();
    const waterData = computeWaterIntelligence(profile);

    let answer = "";

    // 1. Irrigation / पाणी / सिंचाई queries
    if (q.includes('पाणी') || q.includes('सिंचन') || q.includes('irrigate') || q.includes('water') || q.includes('सिंचाई')) {
      if (language === 'mr') {
        answer = `📢 आजचा निर्णय: ${waterData.decisionTitleMr}!\n\nकारण: ${waterData.reasonSummaryMr}\n\n• पाऊस अंदाज: ${waterData.rainfallForecastMm} मिमी (${waterData.rainfallExpectedProb}% शक्यता)\n• भूजल पातळी: ${waterData.groundwaterLevel.toLocaleString()} (${waterData.baselineDifferencePercent}% बेसलाइन फरक)`;
      } else if (language === 'hi') {
        answer = `📢 आज का निर्णय: ${waterData.decisionTitleHi}!\n\nकारण: ${waterData.reasonSummaryHi}\n\n• बारिश का अनुमान: ${waterData.rainfallForecastMm} मिमी (${waterData.rainfallExpectedProb}% संभावना)\n• भूजल स्तर: ${waterData.groundwaterLevel.toLocaleString()} (${waterData.baselineDifferencePercent}% बेसलाइन अंतर)`;
      } else {
        answer = `📢 Today's Decision: ${waterData.decisionTitle}!\n\nReason: ${waterData.reasonSummary}\n\n• Rainfall Forecast: ${waterData.rainfallForecastMm} mm (${waterData.rainfallExpectedProb}% prob)\n• Groundwater: ${waterData.groundwaterLevel.toLocaleString()} (${waterData.baselineDifferencePercent}% vs 5-yr baseline)`;
      }
    } 
    // 2. Rain / पाऊस / बारिश queries
    else if (q.includes('पाऊस') || q.includes('rain') || q.includes('weather') || q.includes('हवामान') || q.includes('बारिश')) {
      if (language === 'mr') {
        answer = `🌦️ हवामान अंदाज: पुढील २४ तासांत ${profile.location}, ${profile.district} येथे ${waterData.rainfallForecastMm} मिमी पावसाची शक्यता (${waterData.rainfallExpectedProb}%) आहे. तापमानाचा कमाल अंदाज ३१°C राहील.`;
      } else if (language === 'hi') {
        answer = `🌦️ मौसम का अनुमान: अगले 24 घंटों में ${profile.location}, ${profile.district} में ${waterData.rainfallForecastMm} मिमी बारिश की संभावना (${waterData.rainfallExpectedProb}%) है।`;
      } else {
        answer = `🌦️ Rain Forecast: Expecting ${waterData.rainfallForecastMm} mm of rain (${waterData.rainfallExpectedProb}% probability) in ${profile.location}, ${profile.district} over the next 24 hours.`;
      }
    } 
    // 3. Groundwater / भूजल queries
    else if (q.includes('भूजल') || q.includes('groundwater') || q.includes('विहीर') || q.includes('बोअरवेल') || q.includes('water table')) {
      if (language === 'mr') {
        answer = `💧 भूजल स्थिती: आपल्या भागातील चालू पातळी ${waterData.groundwaterLevel.toLocaleString()} आहे, जी ५ वर्षांच्या सरासरीपेक्षा (${waterData.groundwaterBaseline5Yr.toLocaleString()}) ${Math.abs(waterData.baselineDifferencePercent)}% कमी आहे. ताण पातळी: ${waterData.waterStress}.`;
      } else if (language === 'hi') {
        answer = `💧 भूजल स्थिति: आपके क्षेत्र का वर्तमान भूजल स्तर ${waterData.groundwaterLevel.toLocaleString()} है, जो 5-वर्षीय औसत (${waterData.groundwaterBaseline5Yr.toLocaleString()}) से ${Math.abs(waterData.baselineDifferencePercent)}% कम है। तनाव स्तर: ${waterData.waterStress}.`;
      } else {
        answer = `💧 Groundwater Telemetry: Current level is ${waterData.groundwaterLevel.toLocaleString()}, which is ${Math.abs(waterData.baselineDifferencePercent)}% below the 5-year historical average (${waterData.groundwaterBaseline5Yr.toLocaleString()}). Stress: ${waterData.waterStress}.`;
      }
    }
    // 4. Crop status / पिकाची स्थिती queries
    else if (q.includes('पीक') || q.includes('crop') || q.includes('health') || q.includes('तक्रार') || q.includes('फसल')) {
      if (language === 'mr') {
        answer = `🌱 पीक स्थिती: आपले मुख्य पीक ${profile.currentCrop} (${profile.landArea} एकर) निरोगी आहे. मातीतील ओलावा ${waterData.soilMoisturePercent}% आहे. अधिक तपासणीसाठी क्रॉप डॉक्टर स्कॅन वापरा!`;
      } else if (language === 'hi') {
        answer = `🌱 फसल की स्थिति: आपकी मुख्य फसल ${profile.currentCrop} (${profile.landArea} एकड़) स्वस्थ है। मिट्टी की नमी ${waterData.soilMoisturePercent}% है।`;
      } else {
        answer = `🌱 Crop Health: Your registered crop ${profile.currentCrop} (${profile.landArea} acres) is currently Healthy. Soil moisture is at ${waterData.soilMoisturePercent}%. Use Crop Doctor for visual leaf analysis!`;
      }
    }
    // Default fallback answer
    else {
      if (language === 'mr') {
        answer = `🌾 ॲग्रीरक्षक सल्ला: आपल्या ${profile.district} भागातील माहितीनुसार आजचा सिंचन निर्णय "${waterData.decisionTitleMr}" असा आहे. पुढील २४ तासांत ${waterData.rainfallForecastMm} मिमी पाऊस अपेक्षित आहे.`;
      } else if (language === 'hi') {
        answer = `🌾 एग्रीरक्षक सलाह: आपके ${profile.district} क्षेत्र के अनुसार आज का सिंचाई निर्णय "${waterData.decisionTitleHi}" है। अगले 24 घंटों में ${waterData.rainfallForecastMm} मिमी बारिश का अनुमान है।`;
      } else {
        answer = `🌾 AgriRakshak Advisory: Based on your ${profile.district} telemetry, today's farm decision is "${waterData.decisionTitle}". Expected rainfall in 24h is ${waterData.rainfallForecastMm} mm.`;
      }
    }

    return answer;
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    const reply = processFarmerQuery(text);

    setTimeout(() => {
      const assistantMsg: Message = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, assistantMsg]);
      speakText(reply);
    }, 400);
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text.replace(/[*_#•📢🌦️💧🌱🌾]/g, ''));
      utterance.lang = language === 'mr' ? 'mr-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  const sampleQuestions = [
    { text: 'आज पाणी द्यायचं का?', textEn: 'Should I irrigate today?', textHi: 'क्या आज पानी देना चाहिए?' },
    { text: 'आज पाऊस पडणार आहे का?', textEn: 'Will it rain today?', textHi: 'क्या आज बारिश होगी?' },
    { text: 'माझ्या पिकाची स्थिती काय आहे?', textEn: 'What is my crop status?', textHi: 'मेरी फसल की स्थिति क्या है?' },
    { text: 'भूजल पातळी किती आहे?', textEn: 'What is the groundwater level?', textHi: 'भूजल स्तर कितना है?' }
  ];

  return (
    <>
      {/* Floating Voice Button */}
      <button 
        className={`floating-voice-btn ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        title="Ask AgriRakshak / आवाज सहाय्यक"
        aria-label="Voice Assistant"
      >
        <Mic size={22} color="#ffffff" />
        <span className="voice-btn-label">
          {language === 'mr' ? 'बोला' : language === 'hi' ? 'बोलें' : 'Voice'}
        </span>
      </button>

      {/* Voice Assistant Modal / Drawer */}
      {isOpen && (
        <div className="voice-modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="voice-modal-card glass-panel animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="voice-modal-header">
              <div className="vm-title-wrap">
                <div className="vm-icon-box">
                  <Sparkles size={20} color="#1b5e20" />
                </div>
                <div>
                  <h3>{language === 'mr' ? 'ॲग्रीरक्षक व्हॉइस सहाय्यक' : language === 'hi' ? 'एग्रीरक्षक वॉयस सहायक' : 'AgriRakshak Voice Advisor'}</h3>
                  <p>{language === 'mr' ? 'आपल्या भाषेत प्रश्न विचारा' : language === 'hi' ? 'अपनी भाषा में प्रश्न पूछें' : 'Ask in Marathi, Hindi or English'}</p>
                </div>
              </div>
              <button className="vm-close-btn" onClick={() => setIsOpen(false)}>
                <X size={20} />
              </button>
            </div>

            {/* Messages Chat Area */}
            <div className="voice-messages-area">
              {messages.map(msg => (
                <div key={msg.id} className={`voice-msg-row ${msg.sender}`}>
                  <div className={`voice-msg-bubble ${msg.sender}`}>
                    <p>{msg.text}</p>
                    <span className="msg-timestamp">{msg.timestamp}</span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Sample Question Chips */}
            <div className="sample-questions-wrap">
              <div className="sample-hdr">
                <HelpCircle size={13} />
                <span>{language === 'mr' ? 'उदा. प्रश्न निवडा:' : language === 'hi' ? 'उदा. प्रश्न चुनें:' : 'Quick Questions:'}</span>
              </div>
              <div className="sample-chips-scroll">
                {sampleQuestions.map((q, idx) => {
                  const label = language === 'mr' ? q.text : language === 'hi' ? q.textHi : q.textEn;
                  return (
                    <button 
                      key={idx} 
                      className="sample-chip-btn"
                      onClick={() => handleSendMessage(label)}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Input & Microphone Action Bar */}
            <div className="voice-input-bar">
              <button 
                className={`mic-record-btn ${isListening ? 'listening' : ''}`}
                onClick={toggleListening}
                title={isListening ? 'Stop Listening' : 'Speak / बोला'}
              >
                {isListening ? <MicOff size={22} color="#ffffff" /> : <Mic size={22} color="#ffffff" />}
              </button>

              <input 
                type="text" 
                placeholder={isListening 
                  ? (language === 'mr' ? 'ऐकत आहे... बोला...' : language === 'hi' ? 'सुन रहा हूँ... बोलिए...' : 'Listening... speak now...') 
                  : (language === 'mr' ? 'प्रश्न येथे टाइप करा किंवा माईक दाबा...' : language === 'hi' ? 'प्रश्न यहाँ टाइप करें या माइक दबाएं...' : 'Type question or tap mic...')
                }
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleSendMessage(); }}
              />

              <button 
                className="send-msg-btn" 
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim()}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
