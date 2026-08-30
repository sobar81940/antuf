"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Fade,
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider,
  Badge,
  Tooltip,
  Button,
  CircularProgress,
} from "@mui/material";
import {
  Close as CloseIcon,
  Send as SendIcon,
  SupportAgent as SupportIcon,
  Home as HomeIcon,
  QuestionAnswer as QuickbotsIcon,
  Help as FAQIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Chat as ChatIcon,
  ArrowBack as BackIcon,
  Schedule as ScheduleIcon,
} from "@mui/icons-material";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

const SupportChatWidget = () => {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [view, setView] = useState("home"); // home, quickbots, chat, faqs
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef(null);
  const audioRef = useRef(null);

  const quickbots = [
    { icon: "🔒", text: "Queries regarding password", category: "password" },
    { icon: "📡", text: "Queries regarding router", category: "router" },
    { icon: "🌐", text: "New internet connection", category: "connection" },
    { icon: "🔌", text: "Check internet connection", category: "check" },
    { icon: "👤", text: "Check my account details", category: "account" },
    { icon: "⏰", text: "Extend my account", category: "extend" },
    { icon: "📺", text: "NETTV related issue", category: "nettv" },
    { icon: "🎁", text: "Know about refer offer", category: "offer" },
  ];

  const faqs = [
    {
      question: "How do I reset my password?",
      answer: "You can reset your password by clicking on 'Forgot Password' on the login page. You'll receive a reset link via email.",
    },
    {
      question: "What are your support hours?",
      answer: "Our support team is available 24/7 to assist you with any queries.",
    },
    {
      question: "How can I contact support?",
      answer: "You can reach us via this chat widget, email at support@antuf.org, or call us at +977-1-XXXXXXX.",
    },
    {
      question: "How do I become a member?",
      answer: "Visit our registration page or contact our support team for membership information.",
    },
  ];

  useEffect(() => {
    // Initialize notification sound
    audioRef.current = new Audio();
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const playNotificationSound = () => {
    if (!audioRef.current) return;
    try {
      audioRef.current.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZTA0PVKvo7bFgGgY+lt7yxnQnBSh+zPLaizsIGGS56+WiUxELTKXh8bllHgU7kNXzyngqBSl5yfDgkD4MFWCz6uysWhwGO5PY88F2KQUogMzw2o4+ChVgs+rrrFscBjuT2PPBdikFKIDM8NqOPgoVYLPq66xbHAY7k9jzwXYpBSiAzPDajj4KFWCz6uusWxwGO5PY88F2KQUogMzw';
      audioRef.current.volume = 0.3;
      audioRef.current.play().catch(err => console.log('Sound play failed:', err));
    } catch (error) {
      console.log('Error playing sound:', error);
    }
  };

  const handleStartChat = () => {
    if (!session && !guestName) {
      setShowGuestForm(true);
      return;
    }
    setView("chat");
    // Add welcome message
    const welcomeMsg = {
      id: Date.now(),
      content: "Hi There! How can we help you today? We are here to help you with your questions. Ask us anything!",
      sender: "admin",
      senderName: "Support Team",
      timestamp: new Date().toISOString(),
    };
    setMessages([welcomeMsg]);
  };

  const handleGuestFormSubmit = () => {
    if (!guestName.trim() || !guestEmail.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(guestEmail)) {
      toast.error("Please enter a valid email");
      return;
    }
    setShowGuestForm(false);
    handleStartChat();
    toast.success("Welcome! You can now start chatting with our support team.");
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;

    const newMessage = {
      id: Date.now(),
      content: messageInput,
      sender: session ? "user" : "guest",
      senderName: session?.user?.name || guestName || "Guest",
      senderEmail: session?.user?.email || guestEmail,
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, newMessage]);
    setMessageInput("");

    // Send to backend
    try {
      setLoading(true);
      const response = await fetch("/api/support-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageInput,
          guestName: session?.user?.name || guestName,
          guestEmail: session?.user?.email || guestEmail,
          userId: session?.user?.id,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Simulate admin response (in production, this would come from WebSocket or polling)
        setTimeout(() => {
          const adminResponse = {
            id: Date.now() + 1,
            content: "Thank you for your message. Our support team will respond shortly.",
            sender: "admin",
            senderName: "Support Team",
            timestamp: new Date().toISOString(),
          };
          setMessages(prev => [...prev, adminResponse]);
          playNotificationSound();
          setUnreadCount(prev => prev + 1);
        }, 2000);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickbotClick = (quickbot) => {
    setView("chat");
    const quickbotMessage = {
      id: Date.now(),
      content: quickbot.text,
      sender: session ? "user" : "guest",
      senderName: session?.user?.name || guestName || "Guest",
      timestamp: new Date().toISOString(),
    };
    setMessages([quickbotMessage]);
    
    // Auto-response based on category
    setTimeout(() => {
      const responses = {
        password: "For password-related queries, you can reset your password from the login page or contact our support team for assistance.",
        router: "Router issues can often be resolved by restarting your device. If the problem persists, our technical team can help.",
        connection: "To set up a new internet connection, please provide your location and contact details. Our team will reach out to you.",
        check: "To check your internet connection status, you can visit our network status page or we can run diagnostics for you.",
        account: "Please provide your account number or registered email to check your account details securely.",
        extend: "To extend your account, you can renew online or contact our billing department for assistance.",
        nettv: "For NETTV related issues, please describe the problem and our technical support team will assist you.",
        offer: "Our referral program offers exciting rewards! Refer a friend and both of you get benefits. Contact us for more details.",
      };
      
      const response = {
        id: Date.now() + 1,
        content: responses[quickbot.category] || "Thank you for your query. Our support team will assist you shortly.",
        sender: "admin",
        senderName: "Support Team",
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, response]);
      playNotificationSound();
    }, 1000);
  };

  const handleToggle = () => {
    setOpen(!open);
    if (!open) {
      setUnreadCount(0);
    }
  };

  const handleBack = () => {
    setView("home");
  };

  return (
    <>
      {/* Floating Support Button */}
      <Tooltip title="Need Help?" placement="left">
        <Badge
          badgeContent={unreadCount}
          color="error"
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 1300,
          }}
        >
          <IconButton
            onClick={handleToggle}
            sx={{
              width: 60,
              height: 60,
              backgroundColor: "#1976d2",
              color: "white",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              "&:hover": {
                backgroundColor: "#1565c0",
                transform: "scale(1.1)",
              },
              transition: "all 0.3s ease",
            }}
          >
            {open ? <CloseIcon /> : <SupportIcon />}
          </IconButton>
        </Badge>
      </Tooltip>

      {/* Chat Widget */}
      <Fade in={open}>
        <Paper
          elevation={8}
          sx={{
            position: "fixed",
            bottom: 100,
            right: 24,
            width: { xs: "90vw", sm: 380 },
            height: { xs: "75vh", sm: 550 },
            zIndex: 1300,
            borderRadius: 3,
            overflow: "hidden",
            display: open ? "flex" : "none",
            flexDirection: "column",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
              color: "white",
              p: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {view !== "home" && (
                <IconButton size="small" onClick={handleBack} sx={{ color: "white" }}>
                  <BackIcon />
                </IconButton>
              )}
              <Avatar
                sx={{
                  bgcolor: "white",
                  color: "#1976d2",
                  width: 36,
                  height: 36,
                }}
              >
                <SupportIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontSize: "1rem", fontWeight: 600 }}>
                  {view === "home" ? "Hi There! How can we help you" : 
                   view === "quickbots" ? "Quickbots" :
                   view === "chat" ? "Support Chat" : "FAQs"}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  We are here to help you with your questions
                </Typography>
              </Box>
            </Box>
            <IconButton size="small" onClick={handleToggle} sx={{ color: "white" }}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Content Area */}
          <Box sx={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            {/* Home View */}
            {view === "home" && (
              <Box sx={{ p: 3 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  We are here to help you with your questions. Ask us anything!
                </Typography>

                <List sx={{ bgcolor: "#f5f5f5", borderRadius: 2 }}>
                  <ListItem disablePadding>
                    <ListItemButton onClick={handleStartChat}>
                      <ListItemIcon>
                        <ChatIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Start Conversation" 
                        primaryTypographyProps={{ fontWeight: 600 }}
                      />
                    </ListItemButton>
                  </ListItem>
                </List>

                <Divider sx={{ my: 2 }} />

                <List>
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => setView("quickbots")}>
                      <ListItemIcon>
                        <QuickbotsIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="Quickbots" />
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => setView("faqs")}>
                      <ListItemIcon>
                        <FAQIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="FAQs" />
                    </ListItemButton>
                  </ListItem>
                </List>

                <Box sx={{ mt: 3, p: 2, bgcolor: "#e3f2fd", borderRadius: 2 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <ScheduleIcon fontSize="small" />
                    Support Hours: 24/7
                  </Typography>
                </Box>
              </Box>
            )}

            {/* Quickbots View */}
            {view === "quickbots" && (
              <Box sx={{ p: 2, overflowY: "auto" }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Choose a topic to get quick assistance:
                </Typography>
                <List>
                  {quickbots.map((bot, index) => (
                    <ListItem key={index} disablePadding sx={{ mb: 1 }}>
                      <ListItemButton
                        onClick={() => handleQuickbotClick(bot)}
                        sx={{
                          border: "1px solid #e0e0e0",
                          borderRadius: 2,
                          "&:hover": {
                            bgcolor: "#f5f5f5",
                            borderColor: "#1976d2",
                          },
                        }}
                      >
                        <ListItemText 
                          primary={`${bot.icon} ${bot.text}`}
                          primaryTypographyProps={{ fontSize: "0.9rem" }}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            {/* FAQs View */}
            {view === "faqs" && (
              <Box sx={{ p: 2, overflowY: "auto" }}>
                {faqs.map((faq, index) => (
                  <Box key={index} sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                      {faq.question}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {faq.answer}
                    </Typography>
                    {index < faqs.length - 1 && <Divider sx={{ mt: 2 }} />}
                  </Box>
                ))}
              </Box>
            )}

            {/* Chat View */}
            {view === "chat" && (
              <>
                {/* Guest Form */}
                {showGuestForm ? (
                  <Box sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Start a Conversation
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      Please provide your details to continue
                    </Typography>
                    <TextField
                      fullWidth
                      label="Your Name"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      sx={{ mb: 2 }}
                      size="small"
                    />
                    <TextField
                      fullWidth
                      label="Your Email"
                      type="email"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      sx={{ mb: 2 }}
                      size="small"
                    />
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={handleGuestFormSubmit}
                      sx={{ mb: 1 }}
                    >
                      Start Chat
                    </Button>
                    <Button
                      fullWidth
                      variant="text"
                      onClick={() => setShowGuestForm(false)}
                    >
                      Back
                    </Button>
                  </Box>
                ) : (
                  <>
                    {/* Messages Area */}
                    <Box
                      sx={{
                        flex: 1,
                        overflowY: "auto",
                        p: 2,
                        bgcolor: "#fafafa",
                      }}
                    >
                      {messages.map((msg) => (
                        <Box
                          key={msg.id}
                          sx={{
                            display: "flex",
                            justifyContent: msg.sender === "admin" ? "flex-start" : "flex-end",
                            mb: 2,
                          }}
                        >
                          <Box
                            sx={{
                              maxWidth: "75%",
                              bgcolor: msg.sender === "admin" ? "white" : "#1976d2",
                              color: msg.sender === "admin" ? "text.primary" : "white",
                              p: 1.5,
                              borderRadius: 2,
                              boxShadow: 1,
                            }}
                          >
                            {msg.sender === "admin" && (
                              <Typography variant="caption" fontWeight={600} display="block">
                                {msg.senderName}
                              </Typography>
                            )}
                            <Typography variant="body2">{msg.content}</Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                opacity: 0.7,
                                fontSize: "0.7rem",
                                mt: 0.5,
                                display: "block",
                              }}
                            >
                              {new Date(msg.timestamp).toLocaleTimeString()}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                      {loading && (
                        <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
                          <CircularProgress size={24} />
                        </Box>
                      )}
                      <div ref={messagesEndRef} />
                    </Box>

                    {/* Message Input */}
                    <Box sx={{ p: 2, bgcolor: "white", borderTop: "1px solid #e0e0e0" }}>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <TextField
                          fullWidth
                          placeholder="Type your message..."
                          value={messageInput}
                          onChange={(e) => setMessageInput(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage();
                            }
                          }}
                          size="small"
                          multiline
                          maxRows={3}
                        />
                        <IconButton
                          onClick={handleSendMessage}
                          disabled={!messageInput.trim() || loading}
                          color="primary"
                          sx={{
                            bgcolor: "#1976d2",
                            color: "white",
                            "&:hover": { bgcolor: "#1565c0" },
                            "&:disabled": { bgcolor: "#e0e0e0" },
                          }}
                        >
                          <SendIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  </>
                )}
              </>
            )}
          </Box>

          {/* Footer */}
          <Box
            sx={{
              p: 1,
              textAlign: "center",
              borderTop: "1px solid #e0e0e0",
              bgcolor: "#fafafa",
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Powered by ANTUF Support
            </Typography>
          </Box>
        </Paper>
      </Fade>
    </>
  );
};

export default SupportChatWidget;
