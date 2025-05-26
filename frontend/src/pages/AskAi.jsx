import React, { useState, useContext, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { AppContext } from "../context/AppContext";

const AskAi = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("auto");
  const [conversationContext, setConversationContext] = useState([]);
  const { token, userData, doctors } = useContext(AppContext);
  const storageKey = `ai_chat_history_${token}`;

  // Load chat history from localStorage on component mount
  useEffect(() => {
    if (storageKey) {
      try {
        const savedMessages = localStorage.getItem(storageKey);
        const savedContext = localStorage.getItem(`${storageKey}_context`);
        const savedLanguage = localStorage.getItem(`${storageKey}_language`);
        console.log(userData);

        if (savedMessages) {
          const parsedMessages = JSON.parse(savedMessages);
          setMessages(parsedMessages);
        }

        if (savedContext) {
          const parsedContext = JSON.parse(savedContext);
          setConversationContext(parsedContext);
        }

        if (savedLanguage) {
          setSelectedLanguage(savedLanguage);
        }
      } catch (error) {
        console.error("Error loading chat history:", error);
        // Clear corrupted data
        if (storageKey) {
          localStorage.removeItem(storageKey);
          localStorage.removeItem(`${storageKey}_context`);
          localStorage.removeItem(`${storageKey}_language`);
        }
      }
    }
  }, []);

  // Save chat history to localStorage whenever messages change
  useEffect(() => {
    if (storageKey && messages.length > 0) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(messages));
      } catch (error) {
        console.error("Error saving chat history:", error);
      }
    }
  }, [messages]);

  // Save conversation context to localStorage whenever it changes
  useEffect(() => {
    if (storageKey && conversationContext.length > 0) {
      try {
        localStorage.setItem(
          `${storageKey}_context`,
          JSON.stringify(conversationContext)
        );
      } catch (error) {
        console.error("Error saving conversation context:", error);
      }
    }
  }, [conversationContext]);

  // Save selected language to localStorage whenever it changes
  useEffect(() => {
    if (storageKey) {
      try {
        localStorage.setItem(`${storageKey}_language`, selectedLanguage);
      } catch (error) {
        console.error("Error saving language preference:", error);
      }
    }
  }, [selectedLanguage]);

  const ai = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
  const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });

  const languages = [
    { code: "auto", name: "Auto Detect" },
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "ru", name: "Russian" },
    { code: "ja", name: "Japanese" },
    { code: "ko", name: "Korean" },
    { code: "zh", name: "Chinese" },
    { code: "ar", name: "Arabic" },
    { code: "hi", name: "Hindi" },
    { code: "tr", name: "Turkish" },
    { code: "da", name: "Danish" },
    { code: "my", name: "Myanmar" },
    { code: "th", name: "Thai" },
  ];

  // Generate clinic context dynamically from doctors data
  const generateClinicContext = () => {
    const doctorsList = doctors
      .map(
        (doctor, index) => `
${index + 1}. Dr. ${doctor.name} (ID: ${doctor._id})
   - Specialization: ${doctor.speciality}
   - Experience: ${doctor.experience} years
   - Expertise: ${doctor.about}
`
      )
      .join("\n");

    const languageInstruction =
      selectedLanguage === "auto"
        ? "Detect the patient's input language carefully and respond in the same language."
        : `Respond in ${
            languages.find((lang) => lang.code === selectedLanguage)?.name ||
            "English"
          }.`;

    return `
You are an AI health assistant at our medical clinic. Here are our available doctors:

${doctorsList}

IMPORTANT INSTRUCTIONS:
1. This is a conversational chat. The user may ask initial symptoms OR follow-up questions about previous recommendations.
2. If this is the first message or clearly about new symptoms, recommend suitable doctor(s) from our clinic.
3. If this is a follow-up question (asking for clarification, more details, scheduling info, etc.), provide helpful information based on the conversation context.
4. When recommending doctors, format their names as: **Dr. [Name]** (ID: [doctor_id])
5. Include the doctor's specialization and why they're suitable for the symptoms.
6. If the condition seems urgent, mention that as well.
7. ${languageInstruction}
8. Keep doctor names in their original language but translate everything else.
9. Be conversational and helpful - answer follow-up questions naturally.
10. Your first response should start with Hello Welcome from Nine Clinic in the respective language and then continue the conversation. Just only first response .
11. You can't make an appointment by yourself so if patients ask you to make an appointment, you can recommend to click the Drs. name in your response.
`;
  };

  // Function to parse AI response and extract doctor links
  const parseResponseWithLinks = (text) => {
    // Replace doctor name patterns with clickable links
    const doctorPattern = /\*\*Dr\. ([^*]+)\*\* \(ID: ([^)]+)\)/g;

    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = doctorPattern.exec(text)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        parts.push({
          type: "text",
          content: text.slice(lastIndex, match.index),
        });
      }

      // Add the doctor link
      parts.push({
        type: "doctor-link",
        doctorName: match[1],
        doctorId: match[2],
        content: `Dr. ${match[1]}`,
      });

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push({
        type: "text",
        content: text.slice(lastIndex),
      });
    }

    return parts.length > 0 ? parts : [{ type: "text", content: text }];
  };

  const handleDoctorClick = (doctorId) => {
    // Navigate to appointment page in a new tab
    window.open(`/appointment/${doctorId}`, "_blank");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = {
      type: "user",
      content: inputMessage,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Update conversation context
    const newContext = [
      ...conversationContext,
      { role: "user", content: inputMessage },
    ];
    setConversationContext(newContext);

    setInputMessage("");
    setIsLoading(true);

    try {
      const clinicContext = generateClinicContext();

      // Build conversation history for context
      const conversationHistory = newContext
        .slice(-6)
        .map(
          (msg) =>
            `${msg.role === "user" ? "Patient" : "Assistant"}: ${msg.content}`
        )
        .join("\n");

      const prompt = `${clinicContext}

Previous conversation context:
${conversationHistory}

Current patient message: ${inputMessage}

Please provide a helpful response based on whether this is about new symptoms or a follow-up question.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const aiResponse = response.text();

      // Update conversation context with AI response
      setConversationContext((prev) => [
        ...prev,
        { role: "assistant", content: aiResponse },
      ]);

      const aiMessage = {
        type: "ai",
        content: aiResponse,
        timestamp: new Date().toLocaleTimeString(),
        parsedContent: parseResponseWithLinks(aiResponse),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          type: "ai",
          content: "Sorry, something went wrong. Please try again later.",
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearConversation = () => {
    setMessages([]);
    setConversationContext([]);

    // Clear from localStorage as well
    if (storageKey) {
      try {
        localStorage.removeItem(storageKey);
        localStorage.removeItem(`${storageKey}_context`);
        localStorage.removeItem(`${storageKey}_language`);
      } catch (error) {
        console.error("Error clearing chat history:", error);
      }
    }
  };

  const renderMessageContent = (message) => {
    if (message.parsedContent) {
      return (
        <div>
          {message.parsedContent.map((part, index) => {
            if (part.type === "doctor-link") {
              return (
                <button
                  key={index}
                  onClick={() =>
                    handleDoctorClick(part.doctorId, part.doctorName)
                  }
                  className="text-blue-600 hover:text-blue-800 underline font-semibold cursor-pointer bg-transparent border-none p-0 text-left"
                  style={{ display: "inline" }}
                >
                  {part.content}
                </button>
              );
            }
            return <span key={index}>{part.content}</span>;
          })}
        </div>
      );
    }
    return <p>{message.content}</p>;
  };

  return (
    <div className=" bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-2 sm:p-4">
      <div
        className={`max-w-5xl mx-auto flex flex-col  ${
          messages.length > 3 ? "min-h-screen" : "h-[calc(80vh-2rem)]"
        } ${
          messages.length > 5 ? "sm:min-h-screen" : "sm:h-[calc(80vh-2rem)]"
        }`}
      >
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-t-2xl sm:rounded-t-3xl shadow-xl border border-white/20 p-3 sm:p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm sm:text-lg">
                  🏥
                </span>
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  AI Health Assistant
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">
                  Your personal medical consultation assistant
                </p>
              </div>
            </div>

            <div className="flex gap-2 sm:gap-3 items-center">
              {/* Mobile Language Selector */}
              <div className="flex items-center gap-1 sm:gap-2 bg-gray-50 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl">
                <label
                  htmlFor="language-select"
                  className="text-xs sm:text-sm font-medium text-gray-600"
                >
                  🌐
                </label>
                <select
                  id="language-select"
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="bg-transparent border-none focus:outline-none text-xs sm:text-sm font-medium text-gray-700 cursor-pointer max-w-[80px] sm:max-w-none"
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {window.innerWidth < 640
                        ? lang.code.toUpperCase()
                        : lang.name}
                    </option>
                  ))}
                </select>
              </div>

              {messages.length > 0 && (
                <button
                  onClick={clearConversation}
                  className="px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-red-50 text-red-600 rounded-lg sm:rounded-xl hover:bg-red-100 transition-colors duration-200 font-medium"
                >
                  <span className="sm:hidden">🗑️</span>
                  <span className="hidden sm:inline">🗑️ Clear</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 bg-white/60 backdrop-blur-sm shadow-xl border-x border-white/20 overflow-hidden">
          <div className="h-full overflow-y-auto p-3 sm:p-6 space-y-3 sm:space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            {messages.length === 0 && (
              <div className="text-center py-8 sm:py-20 px-4">
                <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <span className="text-2xl sm:text-4xl">🩺</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-700 mb-2 sm:mb-3">
                  Welcome to AI Health Assistant!
                </h2>
                <p className="text-sm sm:text-base text-gray-500 mb-2 max-w-md mx-auto">
                  I'm here to help you find the right doctor based on your
                  symptoms and health concerns.
                </p>
                <p className="text-xs sm:text-sm text-gray-400">
                  Simply describe what you're experiencing, and I'll recommend
                  the best specialists from our clinic.
                </p>
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex items-start gap-2 sm:gap-3 max-w-[90%] sm:max-w-[85%] ${
                    message.type === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.type === "user"
                        ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
                        : "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                    }`}
                  >
                    <span className="text-xs sm:text-sm font-medium">
                      {message.type === "user" ? (
                        <img
                          className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover"
                          src={userData.image}
                          alt="User"
                        />
                      ) : (
                        "🤖"
                      )}
                    </span>
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-md ${
                      message.type === "user"
                        ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-tr-md"
                        : "bg-white text-gray-800 rounded-tl-md border border-gray-100"
                    }`}
                  >
                    <div
                      className={`text-sm sm:text-base ${
                        message.type === "ai" ? "prose prose-sm max-w-none" : ""
                      }`}
                    >
                      {renderMessageContent(message)}
                    </div>
                    <div
                      className={`text-xs mt-1 sm:mt-2 ${
                        message.type === "user"
                          ? "text-blue-100"
                          : "text-gray-400"
                      }`}
                    >
                      {message.timestamp}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                    <span className="text-xs sm:text-sm text-white">🤖</span>
                  </div>
                  <div className="bg-white rounded-xl sm:rounded-2xl rounded-tl-md p-3 sm:p-4 shadow-md border border-gray-100">
                    <div className="flex gap-1 sm:gap-2">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white/80 backdrop-blur-sm rounded-b-2xl sm:rounded-b-3xl shadow-xl border border-white/20 p-3 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-4">
            <div className="flex gap-2 sm:gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder={
                    messages.length > 0
                      ? window.innerWidth < 640
                        ? "Ask a follow-up..."
                        : "Ask a follow-up question or describe new symptoms..."
                      : window.innerWidth < 640
                      ? "Describe your symptoms..."
                      : "💬 Describe your symptoms or ask a health question..."
                  }
                  className="w-full p-3 sm:p-4 pr-10 sm:pr-12 bg-gray-50 border border-gray-200 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-3 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-gray-700 placeholder-gray-400 text-sm sm:text-base"
                  disabled={isLoading}
                />
                <div className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  ✨
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className="px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl sm:rounded-2xl hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
              >
                {isLoading ? (
                  <>
                    <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span className="hidden sm:inline">Thinking...</span>
                  </>
                ) : (
                  <span>Send</span>
                )}
              </button>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-2 sm:gap-4">
                <span className="flex items-center gap-1">
                  💡 <strong className="hidden sm:inline">Tip:</strong>{" "}
                  <span className="hidden sm:inline">
                    Be specific about your symptoms for better recommendations
                  </span>
                  <span className="sm:hidden">Be specific about symptoms</span>
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="hidden sm:inline">AI Assistant Online</span>
                <span className="sm:hidden">Online</span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AskAi;
