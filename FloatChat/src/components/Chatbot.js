import { useState, useRef, useEffect } from 'react';
import './Chatbot.css';
import { useAuth } from './AuthContext';
import { createUser, getUserByEmail } from './dbService';

export const Chatbot = () => {
  const { currentUser, login } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatTitle, setChatTitle] = useState('New Chat');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  // Helper function to get user-specific storage key
  const getUserChatsKey = (userId) => `chat-history-${userId}`;
  const getUserPendingChatKey = (userId) => `pending-chat-${userId}`;

  // Count user messages for unauthenticated users
  const userMessageCount = messages.filter(msg => msg.sender === 'user').length;

  // Check if user needs to login (after exactly 3 messages and not authenticated)
  const checkAndShowLoginModal = () => {
    // Show modal when user has sent exactly 3 messages and tries to send a 4th
    if (!currentUser && userMessageCount === 3) {
      setShowLoginModal(true);
      return true;
    }
    return false;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    console.log('ChatGPT-style ChatBot component mounted!');

    // Load theme from localStorage
    const savedTheme = localStorage.getItem('chatbot-theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
    }

    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser && !currentUser) {
      try {
        const userData = JSON.parse(savedUser);
        login(userData);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('currentUser');
      }
    }
  }, [currentUser, login]);

  // Load user-specific chat history when user changes
  useEffect(() => {
    if (currentUser) {
      // Load chats for this specific user
      const userChatsKey = getUserChatsKey(currentUser.id);
      const savedHistory = localStorage.getItem(userChatsKey);
      if (savedHistory) {
        try {
          setChatHistory(JSON.parse(savedHistory));
        } catch (error) {
          console.error('Error parsing user chat history:', error);
          setChatHistory([]);
        }
      } else {
        setChatHistory([]); // New user = empty history
      }

      // Check for user-specific pending chat state
      const userPendingKey = getUserPendingChatKey(currentUser.id);
      const pendingChat = localStorage.getItem(userPendingKey);
      if (pendingChat) {
        try {
          const chatState = JSON.parse(pendingChat);
          setMessages(chatState.messages || []);
          setCurrentChatId(chatState.currentChatId || null);
          setChatTitle(chatState.chatTitle || 'New Chat');
          
          // Clear the pending state for this user
          localStorage.removeItem(userPendingKey);
        } catch (error) {
          console.error('Error restoring user chat state:', error);
          localStorage.removeItem(userPendingKey);
        }
      }
    } else {
      // No user logged in = clear everything
      setChatHistory([]);
      setMessages([]);
      setCurrentChatId(null);
      setChatTitle('New Chat');
    }
  }, [currentUser]);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('chatbot-theme', newTheme ? 'dark' : 'light');
  };

  // Save chat history to user-specific localStorage
  const saveChatHistory = (history) => {
    if (currentUser) {
      localStorage.setItem(
        getUserChatsKey(currentUser.id), 
        JSON.stringify(history)
      );
    }
  };

  // Create new chat
  const createNewChat = () => {
    if (messages.length > 0 && currentUser) {
      // Generate a dynamic title based on the first user message
      const firstMessage = messages.find(msg => msg.sender === 'user')?.text || 'New Chat';
      const newTitle = firstMessage.length > 30 ? firstMessage.substring(0, 30) + '...' : firstMessage;

      const newChat = {
        id: Date.now(),
        title: newTitle,
        messages: messages,
        timestamp: new Date().toISOString()
      };
      const updatedHistory = [newChat, ...chatHistory];
      setChatHistory(updatedHistory);
      saveChatHistory(updatedHistory);
    }

    // Reset current chat
    setMessages([]);
    setCurrentChatId(null);
    setChatTitle('New Chat');
    setInputValue('');
  };

  // Load chat from history
  const loadChat = (chat) => {
    setMessages(chat.messages);
    setCurrentChatId(chat.id);
    setChatTitle(chat.title);
  };

  // Delete chat from history
  const deleteChat = (chatId) => {
    const updatedHistory = chatHistory.filter(chat => chat.id !== chatId);
    setChatHistory(updatedHistory);
    saveChatHistory(updatedHistory);

    if (currentChatId === chatId) {
      setMessages([]);
      setCurrentChatId(null);
      setChatTitle('New Chat');
    }
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Copy message to clipboard
  const copyMessage = (text) => {
    navigator.clipboard.writeText(text);
  };

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const userMessage = {
      id: Date.now(),
      text: `📎 Uploaded file: ${file.name}`,
      sender: 'user',
      timestamp: new Date(),
      file: file
    };
    setMessages(prev => [...prev, userMessage]);

    // Check if user needs to login (after 3 messages, i.e., userMessageCount will be 3 after adding the new message)
    if (!currentUser && messages.filter(msg => msg.sender === 'user').length === 2) {
      setShowLoginModal(true);
      return;
    }

    // Proceed with chat history update and bot response only if user is authenticated or within message limit
    if (!currentUser && messages.filter(msg => msg.sender === 'user').length >= 3) {
      return; // Stop further processing if modal was shown
    }

    // Update or create chat in history
    let updatedHistory = [...chatHistory];
    if (currentChatId) {
      updatedHistory = updatedHistory.map(chat =>
        chat.id === currentChatId
          ? { ...chat, messages: [...messages, userMessage], timestamp: new Date().toISOString() }
          : chat
      );
    } else {
      const newChat = {
        id: Date.now(),
        title: `File: ${file.name.length > 30 ? file.name.substring(0, 30) + '...' : file.name}`,
        messages: [userMessage],
        timestamp: new Date().toISOString()
      };
      updatedHistory = [newChat, ...chatHistory];
      setCurrentChatId(newChat.id);
      setChatTitle(newChat.title);
    }
    setChatHistory(updatedHistory);
    saveChatHistory(updatedHistory);

    // Generate bot response for file upload
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        const botResponse = {
          id: Date.now() + 1,
          text: `I can see you've uploaded "${file.name}". While I can't actually process files in this demo, in a real implementation I could analyze documents, images, and other file types to help you with your questions.`,
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botResponse]);

        // Update chat history with bot response
        updatedHistory = updatedHistory.map(chat =>
          chat.id === (currentChatId || updatedHistory[0]?.id)
            ? { ...chat, messages: [...chat.messages, botResponse], timestamp: new Date().toISOString() }
            : chat
        );
        setChatHistory(updatedHistory);
        saveChatHistory(updatedHistory);
        setIsTyping(false);
      }, 1500);
    }, 500);
  };

  const quickActions = [
    { id: 1, text: "What are your features?", action: "features" },
    { id: 2, text: "Pricing plans", action: "pricing" },
    { id: 3, text: "Get support", action: "support" },
    { id: 4, text: "Demo request", action: "demo" }
  ];

  const generateQuickActionResponse = (action) => {
    switch(action) {
      case "features":
        return "🚀 **FloatChat Features Overview**\n\nI'm excited to tell you about FloatChat's comprehensive feature set! Our platform is designed to revolutionize how teams communicate and collaborate.\n\n**🔥 Core Features:**\n\n💬 **Advanced Messaging:**\n• Real-time chat with instant delivery\n• Rich text formatting (bold, italic, code blocks)\n• Emoji reactions and custom stickers\n• Message threading for organized discussions\n• Voice and video messages\n• Message search with powerful filters\n\n📁 **File Sharing & Collaboration:**\n• Drag-and-drop file uploads\n• Support for all file types (documents, images, videos)\n• Real-time collaborative editing\n• Version control and file history\n• Cloud storage integration (Google Drive, Dropbox, OneDrive)\n\n👥 **Team Collaboration:**\n• Unlimited group chats and channels\n• Screen sharing and video conferencing\n• Interactive whiteboards\n• Task management and project tracking\n• Calendar integration and scheduling\n\n🔧 **Integrations & Automation:**\n• 100+ app integrations (Slack, Teams, Zoom, etc.)\n• Custom webhooks and API access\n• Automated workflows and bots\n• Third-party marketplace\n\n🛡️ **Security & Privacy:**\n• End-to-end encryption\n• Two-factor authentication\n• Advanced permission controls\n• GDPR and SOC 2 compliance\n• Regular security audits\n\nWhich feature interests you most? I'd love to dive deeper into any specific area!";

      case "pricing":
        return "💰 **FloatChat Pricing Plans**\n\nWe believe in transparent, fair pricing that scales with your needs! Here's our complete pricing breakdown:\n\n**🆓 Free Plan - $0/month**\n• Up to 5 team members\n• 10,000 message history\n• Basic file sharing (100MB/file)\n• Standard integrations\n• Community support\n• Perfect for small teams getting started!\n\n**💼 Professional Plan - $9/month per user**\n• Unlimited team members\n• Unlimited message history\n• Advanced file sharing (1GB/file)\n• All advanced integrations\n• Priority email support\n• Advanced search and filters\n• Custom branding options\n• Video conferencing (up to 50 participants)\n• Most popular choice! 🌟\n\n**🏢 Enterprise Plan - Custom Pricing**\n• Everything in Professional\n• Advanced security features\n• Single Sign-On (SSO)\n• Dedicated account manager\n• 24/7 phone support\n• Custom integrations\n• Advanced analytics and reporting\n• Unlimited storage\n• SLA guarantees\n\n**💡 Special Offers:**\n• 20% discount on annual plans\n• 30-day free trial for all paid plans\n• Non-profit discounts available\n• Volume pricing for large teams\n\n**🎯 Why Choose FloatChat?**\n• No setup fees or hidden costs\n• Cancel anytime, no contracts\n• 30-day money-back guarantee\n• Free migration assistance\n• Regular feature updates included\n\nWant to start with a free trial? I can help you get set up right away!";

      case "support":
        return "🤝 **FloatChat Support - We're Here to Help!**\n\nWelcome to FloatChat support! I'm here to ensure you have the best possible experience with our platform.\n\n**🎯 How I Can Help You:**\n\n🔧 **Technical Support:**\n• Account setup and configuration\n• Integration troubleshooting\n• Performance optimization\n• Bug reports and issue resolution\n• Feature guidance and best practices\n\n📚 **Learning Resources:**\n• Step-by-step tutorials\n• Video guides and walkthroughs\n• Best practice recommendations\n• Advanced feature explanations\n• Use case examples\n\n⚡ **Quick Solutions:**\n• Password resets and account recovery\n• Billing and subscription questions\n• Team management assistance\n• Settings and preferences help\n• Mobile app support\n\n**📞 Multiple Support Channels:**\n• **Live Chat** (like this!) - Instant responses\n• **Email Support** - support@floatchat.com\n• **Help Center** - Comprehensive documentation\n• **Video Calls** - For complex issues\n• **Community Forum** - Peer-to-peer help\n\n**⏰ Support Hours:**\n• Live Chat: 24/7 for urgent issues\n• Email: Response within 2-4 hours\n• Phone: Business hours (9 AM - 6 PM EST)\n\n**🚀 Pro Tips:**\n• Check our Help Center first for instant answers\n• Use specific details when describing issues\n• Screenshots help us resolve problems faster\n• Don't hesitate to ask follow-up questions!\n\nWhat specific area do you need help with today? I'm ready to provide detailed assistance!";

      case "demo":
        return "🎬 **FloatChat Demo - See It In Action!**\n\nI'd absolutely love to show you what FloatChat can do! Our interactive demo will give you a hands-on experience with all our powerful features.\n\n**🌟 What You'll See in the Demo:**\n\n💬 **Live Messaging Experience:**\n• Real-time chat interface\n• Rich text formatting tools\n• File sharing in action\n• Message reactions and threading\n• Search and filter capabilities\n\n🎯 **Collaboration Features:**\n• Screen sharing demonstration\n• Whiteboard collaboration\n• Video conferencing\n• Task management integration\n• Calendar synchronization\n\n🔧 **Integration Showcase:**\n• Popular app connections\n• Workflow automation examples\n• Custom bot interactions\n• API capabilities\n• Third-party tool demos\n\n📊 **Admin & Analytics:**\n• Team management interface\n• Usage analytics dashboard\n• Security settings overview\n• Billing and subscription management\n\n**🎪 Demo Options:**\n\n**🖥️ Self-Guided Demo (5-10 minutes):**\n• Interactive online walkthrough\n• Try features at your own pace\n• No registration required\n• Available 24/7\n\n**👨‍💼 Personal Demo (30 minutes):**\n• One-on-one with our product expert\n• Customized to your use case\n• Q&A session included\n• Best practices discussion\n• Implementation planning\n\n**🏢 Team Demo (45-60 minutes):**\n• Present to your entire team\n• Custom scenarios and workflows\n• Integration planning\n• Pricing discussion\n• Migration strategy\n\n**📅 Ready to Get Started?**\nI can set up any of these demo options for you right now! Which type of demo interests you most?\n\n**Bonus:** All demo participants get a 30-day extended trial and 20% off their first year! 🎁";

      default:
        return "I'd be happy to help you with that! Could you provide more details about what you're looking for?";
    }
  };

  const generateBotResponse = (userInput) => {
    const input = userInput.toLowerCase();

    if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
      return "Hello! 👋 Welcome to FloatChat AI Assistant! I'm here to help you with a wide range of topics and questions. Whether you're looking for information about our platform, need assistance with technical issues, want to explore our features, or just want to have a conversation, I'm ready to assist you.\n\nFeel free to ask me anything - from simple questions to complex problems. I can help with:\n• FloatChat features and capabilities\n• Technical support and troubleshooting\n• General information and explanations\n• Creative tasks and brainstorming\n• And much more!\n\nWhat would you like to know or discuss today?";
    } else if (input.includes('help')) {
      return "I'm absolutely here to help! 🤝 As your FloatChat AI Assistant, I can assist you with a comprehensive range of topics and tasks.\n\n**Here's what I can help you with:**\n\n📋 **FloatChat Platform:**\n• Features and functionality explanations\n• Account setup and management\n• Integration with other tools\n• Best practices and tips\n\n🔧 **Technical Support:**\n• Troubleshooting common issues\n• Step-by-step guidance\n• Performance optimization\n• Security and privacy questions\n\n💡 **General Assistance:**\n• Answering questions on various topics\n• Providing explanations and tutorials\n• Creative problem-solving\n• Research and information gathering\n\nJust let me know what specific area you need help with, and I'll provide detailed, helpful information tailored to your needs!";
    } else if (input.includes('price') || input.includes('cost') || input.includes('pricing')) {
      return "Great question about our pricing! 💰 FloatChat offers flexible and competitive pricing plans designed to meet different needs and budgets.\n\n**Our Pricing Structure:**\n\n🆓 **Free Plan:**\n• Basic chat functionality\n• Limited message history\n• Standard support\n• Perfect for trying out the platform\n\n💼 **Professional Plan - $9/month:**\n• Unlimited messaging\n• Full chat history\n• Advanced features\n• Priority support\n• File sharing capabilities\n• Custom integrations\n\n🏢 **Enterprise Plan - Custom Pricing:**\n• All Professional features\n• Advanced security\n• Custom branding\n• Dedicated support\n• API access\n• Volume discounts available\n\n**Why Choose FloatChat?**\n• No hidden fees\n• Cancel anytime\n• 30-day money-back guarantee\n• Transparent pricing\n• Regular feature updates included\n\nWould you like more details about any specific plan or feature?";
    } else if (input.includes('feature') || input.includes('what can')) {
      return "Excellent question! 🚀 FloatChat is packed with powerful features designed to enhance your communication and productivity experience.\n\n**Core Features:**\n\n💬 **Advanced Messaging:**\n• Real-time chat with instant delivery\n• Rich text formatting and emoji support\n• Message reactions and threading\n• Voice and video messages\n• Message search and filtering\n\n📁 **File Management:**\n• Drag-and-drop file sharing\n• Support for all file types\n• Cloud storage integration\n• File preview and collaboration\n• Version control and history\n\n👥 **Collaboration Tools:**\n• Group chats and channels\n• Screen sharing capabilities\n• Collaborative whiteboards\n• Task management integration\n• Calendar synchronization\n\n🔧 **Integration & Automation:**\n• Connect with 100+ popular tools\n• Custom webhooks and APIs\n• Automated workflows\n• Bot integrations\n• Third-party app marketplace\n\n🛡️ **Security & Privacy:**\n• End-to-end encryption\n• Two-factor authentication\n• Advanced permission controls\n• Compliance with major standards\n• Regular security audits\n\n📊 **Analytics & Insights:**\n• Usage analytics and reports\n• Performance metrics\n• User engagement tracking\n• Custom dashboards\n\nWhich specific feature would you like to learn more about?";
    } else if (input.includes('thank')) {
      return "You're absolutely welcome! 😊 I'm genuinely happy I could help you today.\n\nIt's my pleasure to assist you with any questions or challenges you might have. That's exactly what I'm here for - to make your FloatChat experience as smooth and productive as possible.\n\n**Feel free to reach out anytime if you need:**\n• More detailed explanations\n• Step-by-step guidance\n• Additional feature information\n• Technical support\n• Or just want to chat!\n\nI'm always available and ready to help. Is there anything else you'd like to know or explore? I'm here whenever you need assistance! 🤝";
    } else if (input.includes('bye') || input.includes('goodbye')) {
      return "Goodbye! 👋 It's been wonderful chatting with you today.\n\nThank you for using FloatChat AI Assistant! I hope I was able to provide helpful information and answer your questions effectively.\n\n**Before you go, remember:**\n• I'm available 24/7 whenever you need assistance\n• Your chat history is saved for easy reference\n• Feel free to start a new conversation anytime\n• Don't hesitate to reach out with any future questions\n\n**Quick tip:** You can always return to previous conversations using the chat history in the sidebar.\n\nHave a fantastic day, and I look forward to helping you again soon! Take care! ✨";
    } else if (input.includes('regenerate')) {
      const regenerateResponses = [
        "Let me provide you with a fresh perspective on that! 🔄\n\nI understand you're looking for a different approach or more detailed information. I'm happy to elaborate further or take a completely different angle on your question.\n\nCould you let me know what specific aspect you'd like me to focus on or explain differently? I can provide:\n• More technical details\n• Simplified explanations\n• Alternative solutions\n• Additional examples\n• Different perspectives\n\nJust let me know how I can better assist you!",
        "Absolutely! Let me give you a more comprehensive response. 💡\n\nI appreciate you asking for a regenerated answer - it helps me provide better, more tailored information for your needs.\n\nHere's what I can offer:\n• More detailed explanations with examples\n• Step-by-step breakdowns\n• Alternative approaches to consider\n• Additional resources and tips\n• Practical implementation advice\n\nWhat specific area would you like me to dive deeper into?",
        "Of course! I'm happy to provide a fresh take on your question. ✨\n\nSometimes a different perspective or more detailed explanation is exactly what's needed. I'm here to ensure you get the most helpful and comprehensive information possible.\n\nLet me know if you'd like me to:\n• Focus on specific aspects\n• Provide more examples\n• Explain in simpler terms\n• Give more technical details\n• Suggest alternative solutions\n\nHow can I better address your needs?"
      ];
      return regenerateResponses[Math.floor(Math.random() * regenerateResponses.length)];
    } else {
      const responses = [
        "That's a fascinating topic! 🤔 I'd love to help you explore this further.\n\nTo provide you with the most accurate and helpful information, could you give me a bit more context about what you're looking for? The more details you share, the better I can tailor my response to your specific needs.\n\n**For example:**\n• Are you looking for general information or specific guidance?\n• Is this related to FloatChat features or something else?\n• Do you need step-by-step instructions or conceptual explanations?\n• Are there particular aspects you're most interested in?\n\nI'm here to provide comprehensive, detailed answers that truly help you achieve your goals!",
        "Great question! 💡 I'm excited to help you with this.\n\nI want to make sure I give you the most valuable and detailed response possible. To do that effectively, it would be helpful to understand a bit more about your specific situation or what you're trying to accomplish.\n\n**Here's how I can assist:**\n• Provide detailed explanations with examples\n• Offer step-by-step guidance\n• Share best practices and tips\n• Suggest alternative approaches\n• Connect you with relevant resources\n\nCould you elaborate on what specific aspect interests you most? I'm ready to dive deep into the details and provide comprehensive information!",
        "Excellent! I'm here to provide you with thorough, helpful information. 🎯\n\nI believe in giving detailed, actionable responses that truly address your needs. To ensure I provide the most relevant and comprehensive answer, I'd appreciate a bit more context about your question.\n\n**I can help with:**\n• In-depth explanations and analysis\n• Practical solutions and recommendations\n• Detailed tutorials and guides\n• Comparative information and options\n• Troubleshooting and problem-solving\n\nWhat specific information or guidance would be most valuable to you right now? I'm committed to providing thorough, helpful responses!",
        "I'm really glad you asked! 🌟 This gives me an opportunity to provide you with comprehensive, detailed information.\n\nI specialize in giving thorough, well-explained responses that cover all the important aspects of your question. To make sure I address exactly what you need, could you help me understand:\n\n• What's your main goal or objective?\n• Are there specific challenges you're facing?\n• What level of detail would be most helpful?\n• Are you looking for immediate solutions or long-term strategies?\n\n**My approach:**\n• Comprehensive explanations with context\n• Practical examples and use cases\n• Step-by-step guidance when needed\n• Multiple perspectives and options\n• Follow-up suggestions and resources\n\nLet's dive into the details together!"
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
  };

  const handleQuickAction = (action) => {
    // Create the user message for the quick action
    let questionText = '';
    switch (action) {
      case 'features':
        questionText = 'What are your features?';
        break;
      case 'pricing':
        questionText = 'What are your pricing plans?';
        break;
      case 'support':
        questionText = 'I need support';
        break;
      case 'demo':
        questionText = 'I’d like to request a demo';
        break;
      default:
        questionText = 'Tell me more';
    }

    const userMessage = {
      id: Date.now(),
      text: questionText,
      sender: 'user',
      timestamp: new Date(),
    };

    // Add the new message to the messages array
    setMessages(prev => [...prev, userMessage]);

    // Check if user needs to login (after 3 messages, i.e., userMessageCount will be 3 after adding the new message)
    if (!currentUser && messages.filter(msg => msg.sender === 'user').length === 2) {
      setShowLoginModal(true);
      return;
    }

    // Proceed with chat history update and bot response only if user is authenticated or within message limit
    if (!currentUser && messages.filter(msg => msg.sender === 'user').length >= 3) {
      return; // Stop further processing if modal was shown
    }

    // Update or create chat in history
    let updatedHistory = [...chatHistory];
    if (currentChatId) {
      updatedHistory = updatedHistory.map(chat =>
        chat.id === currentChatId
          ? { ...chat, messages: [...messages, userMessage], timestamp: new Date().toISOString() }
          : chat
      );
    } else {
      const newChat = {
        id: Date.now(),
        title: questionText.length > 30 ? questionText.substring(0, 30) + '...' : questionText,
        messages: [userMessage],
        timestamp: new Date().toISOString(),
      };
      updatedHistory = [newChat, ...chatHistory];
      setCurrentChatId(newChat.id);
      setChatTitle(newChat.title);
    }
    setChatHistory(updatedHistory);
    saveChatHistory(updatedHistory);

    // Generate bot response
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        const botResponse = {
          id: Date.now() + 1,
          text: generateQuickActionResponse(action),
          sender: 'bot',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, botResponse]);

        // Update chat history with bot response
        updatedHistory = updatedHistory.map(chat =>
          chat.id === (currentChatId || updatedHistory[0]?.id)
            ? { ...chat, messages: [...chat.messages, botResponse], timestamp: new Date().toISOString() }
            : chat
        );
        setChatHistory(updatedHistory);
        saveChatHistory(updatedHistory);
        setIsTyping(false);
      }, 1500);
    }, 500);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Create the new user message
    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    // Add the new message to the messages array
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Check if user needs to login (after 3 messages, i.e., userMessageCount will be 3 after adding the new message)
    if (!currentUser && messages.filter(msg => msg.sender === 'user').length === 2) {
      setShowLoginModal(true);
      return;
    }

    // Proceed with chat history update and bot response only if user is authenticated or within message limit
    if (!currentUser && messages.filter(msg => msg.sender === 'user').length >= 3) {
      return; // Stop further processing if modal was shown
    }

    setIsTyping(true);

    // Update or create chat in history
    let updatedHistory = [...chatHistory];
    if (currentChatId) {
      updatedHistory = updatedHistory.map(chat =>
        chat.id === currentChatId
          ? { ...chat, messages: [...messages, userMessage], timestamp: new Date().toISOString() }
          : chat
      );
    } else {
      const newChat = {
        id: Date.now(),
        title: inputValue.length > 30 ? inputValue.substring(0, 30) + '...' : inputValue,
        messages: [userMessage],
        timestamp: new Date().toISOString(),
      };
      updatedHistory = [newChat, ...chatHistory];
      setCurrentChatId(newChat.id);
      setChatTitle(newChat.title);
    }
    setChatHistory(updatedHistory);
    saveChatHistory(updatedHistory);

    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputValue }),
      });
      if (!response.ok) {
        throw new Error('API error');
      }
      const data = await response.json();
      const botMessage = {
        id: Date.now() + 1,
        text: data.reply || 'No response from bot.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);

      // Update chat history with bot response
      updatedHistory = updatedHistory.map(chat =>
        chat.id === (currentChatId || updatedHistory[0]?.id)
          ? { ...chat, messages: [...chat.messages, botMessage], timestamp: new Date().toISOString() }
          : chat
      );
      setChatHistory(updatedHistory);
      saveChatHistory(updatedHistory);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 2,
        text: 'Error: Unable to connect to the backend API.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);

      // Update chat history with error message
      updatedHistory = updatedHistory.map(chat =>
        chat.id === (currentChatId || updatedHistory[0]?.id)
          ? { ...chat, messages: [...chat.messages, errorMessage], timestamp: new Date().toISOString() }
          : chat
      );
      setChatHistory(updatedHistory);
      saveChatHistory(updatedHistory);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // Updated Login Modal Component
  const LoginModal = () => (
    <div className="login-modal-overlay">
      <div className="login-modal">
        <div className="login-modal-header">
          <h3>Continue Your Conversation</h3>
          <button 
            className="close-modal-btn"
            onClick={() => setShowLoginModal(false)}
          >
            ×
          </button>
        </div>
        <div className="login-modal-body">
          <p>You've used your 3 free messages. Please login to continue chatting.</p>
          <div className="login-modal-actions">
            <button 
              className="login-btn primary"
              onClick={() => {
                setShowLoginModal(false);
                // Save current chat state for this specific user before redirecting
                if (currentUser) {
                  localStorage.setItem(
                    getUserPendingChatKey(currentUser.id), 
                    JSON.stringify({
                      messages: messages,
                      currentChatId: currentChatId,
                      chatTitle: chatTitle,
                      timestamp: new Date().toISOString()
                    })
                  );
                }
                // Redirect to authentication page
                window.location.href = '/auth';
              }}
            >
              Login / Sign Up
            </button>
            <button 
              className="login-btn secondary"
              onClick={() => setShowLoginModal(false)}
            >
              Maybe Later
            </button>
          </div>
          <div className="login-modal-info">
            <p>💡 <strong>After login</strong>, you'll be redirected back to continue your conversation.</p>
            <p>🔒 <strong>Your chats are private</strong> - each user account has separate chat history.</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`chatgpt-container ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
      {/* Login Modal */}
      {showLoginModal && <LoginModal />}

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <div className="sidebar-header">
          <button className="new-chat-btn" onClick={createNewChat}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            New Chat
          </button>
        </div>

        <div className="chat-history">
          <div className="chat-history-header">
            Recent Chats {currentUser && `(${currentUser.email})`}
          </div>
          {(() => {
            if (!currentUser) {
              return (
                <div className="no-chats-message">
                  <p>Please login to see your chat history</p>
                </div>
              );
            }

            const today = new Date();
            const oneDayAgo = new Date(today.getTime() - 24 * 60 * 60 * 1000);
            const newChats = chatHistory.filter(
              chat => new Date(chat.timestamp) >= oneDayAgo
            );
            const olderChats = chatHistory.filter(
              chat => new Date(chat.timestamp) < oneDayAgo
            );

            if (newChats.length === 0 && olderChats.length === 0) {
              return (
                <div className="no-chats-message">
                  <p>No chats yet. Start a new conversation!</p>
                </div>
              );
            }

            return (
              <>
                {newChats.length > 0 && (
                  <>
                    <div className="chat-history-subheader">New Chats (Last 24 Hours)</div>
                    {newChats.map((chat) => (
                      <div key={chat.id} className={`chat-history-item ${currentChatId === chat.id ? 'active' : ''}`}>
                        <div className="chat-item-content" onClick={() => loadChat(chat)}>
                          <div className="chat-title">{chat.title}</div>
                          <div className="chat-timestamp">
                            {new Date(chat.timestamp).toLocaleDateString()}
                          </div>
                        </div>
                        <button className="delete-chat-btn" onClick={() => deleteChat(chat.id)}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                        </button>
                      </div>
                    ))}
                  </>
                )}
                {olderChats.length > 0 && (
                  <>
                    <div className="chat-history-subheader">Older Chats</div>
                    {olderChats.map((chat) => (
                      <div key={chat.id} className={`chat-history-item ${currentChatId === chat.id ? 'active' : ''}`}>
                        <div className="chat-item-content" onClick={() => loadChat(chat)}>
                          <div className="chat-title">{chat.title}</div>
                          <div className="chat-timestamp">
                            {new Date(chat.timestamp).toLocaleDateString()}
                          </div>
                        </div>
                        <button className="delete-chat-btn" onClick={() => deleteChat(chat.id)}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                        </button>
                      </div>
                    ))}
                  </>
                )}
              </>
            );
          })()}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="main-chat-area">
        {/* Hamburger Menu Button */}
        <button className="hamburger-btn" onClick={toggleSidebar} title="Toggle Sidebar">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        {/* Messages */}
        <div className="chatgpt-messages">
          {messages.length === 0 ? (
            <div className="welcome-message">
              <h2>Welcome to FloatChat Bot</h2>
              <p>I'm here to help you with any questions about FloatChat. Feel free to ask me about features, pricing, or anything else!</p>

              {/* Show message limit info for unauthenticated users */}
              {!currentUser && (
                <div className="message-limit-info">
                  <p>💡 <strong>Free trial:</strong> You can send up to 3 messages without logging in.</p>
                </div>
              )}

              {/* Quick Action Suggestions */}
              <div className="quick-suggestions">
                <div className="suggestions-title">Try asking about:</div>
                <div className="suggestions-grid">
                  {quickActions.map((action) => (
                    <button
                      key={action.id}
                      className="suggestion-btn"
                      onClick={() => handleQuickAction(action.action)}
                      disabled={!currentUser && userMessageCount >= 3}
                    >
                      {action.text}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className={`message-group ${message.sender}`}>
                <div className="message-content">
                  <div className={`message-avatar ${message.sender}`}>
                    {message.sender === 'user' ? 'U' : 'AI'}
                  </div>
                  <div className="message-wrapper">
                    <div className={`message-bubble ${message.sender}`}>
                      {message.text}
                    </div>
                    <div className="message-actions">
                      <button
                        className="message-action-btn"
                        onClick={() => copyMessage(message.text)}
                        title="Copy message"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <path d="M16 4H18C19.1046 4 20 4.89543 20 6V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V6C4 4.89543 4.89543 4 6 4H8M16 4C16 2.89543 15.1046 2 14 2H10C8.89543 2 8 2.89543 8 4M16 4C16 5.10457 15.1046 6 14 6H10C8.89543 6 8 5.10457 8 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                      {message.sender === 'bot' && (
                        <button
                          className="message-action-btn"
                          onClick={() => {
                            setIsTyping(true);
                            setTimeout(() => {
                              const newResponse = generateBotResponse("regenerate");
                              const updatedMessages = messages.map(msg =>
                                msg.id === message.id
                                  ? { ...msg, text: newResponse }
                                  : msg
                              );
                              setMessages(updatedMessages);

                              // Update chat history with regenerated response
                              if (currentUser) {
                                const updatedHistory = chatHistory.map(chat =>
                                  chat.id === currentChatId
                                    ? { ...chat, messages: updatedMessages, timestamp: new Date().toISOString() }
                                    : chat
                                );
                                setChatHistory(updatedHistory);
                                saveChatHistory(updatedHistory);
                              }
                              setIsTyping(false);
                            }, 1500);
                          }}
                          title="Regenerate response"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <path d="M1 4V10H7M23 20V14H17M20.49 9C19.9828 7.56678 19.1209 6.28392 17.9845 5.27493C16.8482 4.26595 15.4745 3.56905 13.9917 3.24575C12.5089 2.92246 10.9652 2.98546 9.51691 3.42597C8.06861 3.86648 6.75974 4.67105 5.71 5.76L1 10M23 14L18.29 18.24C17.2403 19.329 15.9314 20.1335 14.4831 20.574C13.0348 21.0145 11.4911 21.0775 10.0083 20.7542C8.52547 20.431 7.1518 19.7341 6.01547 18.7251C4.87913 17.7161 4.01717 16.4332 3.51 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}

          {isTyping && (
            <div className="typing-indicator">
              <div className="typing-content">
                <div className="typing-avatar">AI</div>
                <div className="typing-bubble">
                  <div className="typing-dots">
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="chatgpt-input">
          <div className="chatgpt-input-container">
            <div className="input-wrapper">
              <button
                className="attachment-btn"
                onClick={() => fileInputRef.current?.click()}
                title="Attach file"
                disabled={!currentUser && userMessageCount >= 3}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M21.44 11.05L12.25 20.24C11.1242 21.3658 9.59722 22.0001 8.005 22.0001C6.41278 22.0001 4.88583 21.3658 3.76 20.24C2.63417 19.1142 1.99994 17.5872 1.99994 15.995C1.99994 14.4028 2.63417 12.8758 3.76 11.75L12.95 2.56C13.7006 1.80944 14.7186 1.38787 15.78 1.38787C16.8414 1.38787 17.8594 1.80944 18.61 2.56C19.3606 3.31056 19.7821 4.32856 19.7821 5.39C19.7821 6.45144 19.3606 7.46944 18.61 8.22L9.41 17.41C9.03494 17.7851 8.52556 17.9972 8 17.9972C7.47444 17.9972 6.96506 17.7851 6.59 17.41C6.21494 17.0349 6.00284 16.5256 6.00284 16C6.00284 15.4744 6.21494 14.9651 6.59 14.59L15.07 6.12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <textarea
                ref={inputRef}
                className="chatgpt-input-field"
                placeholder={
                  !currentUser && userMessageCount >= 3 
                    ? "Please login to continue chatting..." 
                    : "Message FloatChat Bot..."
                }
                value={inputValue}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                rows="1"
                disabled={!currentUser && userMessageCount >= 3}
                onFocus={() => {
                  if (!currentUser && userMessageCount >= 3) {
                    setShowLoginModal(true);
                  }
                }}
              />
              <button
                className="chatgpt-send-button"
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || (!currentUser && userMessageCount >= 3)}
              >
                <svg className="send-icon" viewBox="0 0 24 24">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                </svg> 
              </button>
            </div>
            <div className="input-footer">
              <div className="input-info">
                {!currentUser && userMessageCount >= 3 ? (
                  <span style={{color: '#ff6b6b'}}>
                    🔒 Message limit reached. Please login to continue.
                  </span>
                ) : !currentUser ? (
                  `💡 Free trial: ${3 - userMessageCount} messages remaining`
                ) : (
                  `🔒 Chat history private to ${currentUser.email}`
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        style={{ display: 'none' }}
        accept=".txt,.pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
      />
    </div>
  );
};