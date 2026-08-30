"use client";

import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Avatar,
  Card,
  CardContent,
  CircularProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  IconButton,
  Tooltip,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import VideocamIcon from "@mui/icons-material/Videocam";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import CallEndIcon from "@mui/icons-material/CallEnd";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

// Dynamic import for VideoCall component to avoid SSR issues
const VideoCallComponent = dynamic(
  () => import('../../VideoCall/VideoCallComponent'),
  { ssr: false }
);

const UserChat = () => {
  const { data: session } = useSession();
  const [chatRooms, setChatRooms] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [openNewChat, setOpenNewChat] = useState(false);
  const [newChatData, setNewChatData] = useState({
    subject: "",
    category: "general",
    priority: "medium",
  });
  const [openVideoCall, setOpenVideoCall] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isCallActive, setIsCallActive] = useState(false);
  const messagesEndRef = useRef(null);
  const audioRef = useRef(null);
  const [messageStatuses, setMessageStatuses] = useState({});

  useEffect(() => {
    if (session?.user?.id) {
      fetchChats();
    }
  }, [session?.user?.id]);

  useEffect(() => {
    // Create audio element for notification sounds
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

  useEffect(() => {
    let interval;
    if (isCallActive) {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCallActive]);

  const fetchChats = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/chat");
      if (response.ok) {
        const data = await response.json();
        setChatRooms(data);
        if (data.length > 0 && !selectedChat) {
          setSelectedChat(data[0]);
          setMessages(data[0].messages);
        }
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
      toast.error("Failed to load chats");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChat = (chatRoom) => {
    setSelectedChat(chatRoom);
    setMessages(chatRoom.messages);
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedChat) return;

    try {
      const response = await fetch(`/api/chat/${selectedChat._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageInput,
        }),
      });

      if (response.ok) {
        const updatedChat = await response.json();
        setSelectedChat(updatedChat);
        setMessages(updatedChat.messages);
        setMessageInput("");
        
        // Play sent sound
        playSound('sent');
        
        // Get the last message ID and simulate delivery/seen
        const lastMessage = updatedChat.messages[updatedChat.messages.length - 1];
        if (lastMessage && lastMessage._id) {
          simulateMessageDelivery(lastMessage._id);
        }
      } else {
        toast.error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Error sending message");
    }
  };

  const handleCreateNewChat = async () => {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newChatData),
      });

      if (response.ok) {
        const newChat = await response.json();
        setChatRooms([newChat, ...chatRooms]);
        setSelectedChat(newChat);
        setMessages([]);
        setOpenNewChat(false);
        setNewChatData({
          subject: "",
          category: "general",
          priority: "medium",
        });
        toast.success("Chat created successfully!");
      }
    } catch (error) {
      console.error("Error creating chat:", error);
      toast.error("Failed to create chat");
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      active: "success",
      closed: "error",
      archived: "warning",
    };
    return colors[status] || "default";
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: "info",
      medium: "warning",
      high: "error",
      urgent: "error",
    };
    return colors[priority] || "default";
  };

  const handleStartVideoCall = () => {
    if (!selectedChat) {
      toast.error('Please select a chat first');
      return;
    }
    setOpenVideoCall(true);
    setIsCallActive(true);
    setCallDuration(0);
    toast.success("Initiating video call...");
  };

  const handleEndVideoCall = () => {
    setOpenVideoCall(false);
    setIsCallActive(false);
    setCallDuration(0);
    setIsVideoEnabled(true);
    setIsAudioEnabled(true);
    setIsFullscreen(false);
    toast.info("Video call ended");
  };

  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
    toast.info(isVideoEnabled ? "Camera turned off" : "Camera turned on");
  };

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
    toast.info(isAudioEnabled ? "Microphone muted" : "Microphone unmuted");
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const formatCallDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const playSound = (type) => {
    if (!audioRef.current) return;
    
    // Different sounds for different events
    const sounds = {
      sent: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZTA0PVKvo7bFgGgY+lt7yxnQnBSh+zPLaizsIGGS56+WiUxELTKXh8bllHgU7kNXzyngqBSl5yfDgkD4MFWCz6uysWhwGO5PY88F2KQUogMzw2o4+ChVgs+rrrFscBjuT2PPBdikFKIDM8NqOPgoVYLPq66xbHAY7k9jzwXYpBSiAzPDajj4KFWCz6uusWxwGO5PY88F2KQUogMzy2o4+ChVgs+rrrFscBjuT2PPBdikFKIDM8NqOPgoVYLPq66xbHAY7k9jzwXYpBSiAzPDajj4KFWCz6uusWxwGO5PY88F2KQUogMzy2o4+ChVgs+rrrFscBjuT2PPBdikFKIDM8NqOPgoVYLPq66xbHAY7k9jzwXYpBSiAzPDajj4KFWCz6uusWxwGO5PY88F2KQUogMzy2o4+ChVgs+rrrFscBjuT2PPBdikFKIDM8NqOPgoVYLPq66xbHAY7k9jzwXYpBSiAzPDajj4KFWCz6uusWxwGO5PY88F2KQUogMzw2o4+ChVgs+rrrFscBjuT2PPBdikFKIDM8NqOPgoVYLPq66xbHAY7k9jzwXYpBSiAzPDajj4KFWCz6uusWxwGO5PY88F2KQUogMzw',
      delivered: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZTA0PVKvo7bFgGgY+lt7yxnQnBSh+zPLaizsIGGS56+WiUxELTKXh8bllHgU7kNXzyngqBSl5yfDgkD4MFWCz6uysWhwGO5PY88F2KQUogMzw2o4+ChVgs+rrrFscBjuT2PPBdikFKIDM8NqOPgoVYLPq66xbHAY7k9jzwXYpBSiAzPDajj4KFWCz6uusWxwGO5PY88F2KQUogMzy2o4+ChVgs+rrrFscBjuT2PPBdikFKIDM8NqOPgoVYLPq66xbHAY7k9jzwXYpBSiAzPDajj4KFWCz6uusWxwGO5PY88F2KQUogMzy2o4+ChVgs+rrrFscBjuT2PPBdikFKIDM8NqOPgoVYLPq66xbHAY7k9jzwXYpBSiAzPDajj4KFWCz6uusWxwGO5PY88F2KQUogMzy2o4+ChVgs+rrrFscBjuT2PPBdikFKIDM8NqOPgoVYLPq66xbHAY7k9jzwXYpBSiAzPDajj4KFWCz6uusWxwGO5PY88F2KQUogMzw2o4+ChVgs+rrrFscBjuT2PPBdikFKIDM8NqOPgoVYLPq66xbHAY7k9jzwXYpBSiAzPDajj4KFWCz6uusWxwGO5PY88F2KQUogMzw',
      seen: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZTA0PVKvo7bFgGgY+lt7yxnQnBSh+zPLaizsIGGS56+WiUxELTKXh8bllHgU7kNXzyngqBSl5yfDgkD4MFWCz6uysWhwGO5PY88F2KQUogMzw2o4+ChVgs+rrrFscBjuT2PPBdikFKIDM8NqOPgoVYLPq66xbHAY7k9jzwXYpBSiAzPDajj4KFWCz6uusWxwGO5PY88F2KQUogMzy2o4+ChVgs+rrrFscBjuT2PPBdikFKIDM8NqOPgoVYLPq66xbHAY7k9jzwXYpBSiAzPDajj4KFWCz6uusWxwGO5PY88F2KQUogMzy2o4+ChVgs+rrrFscBjuT2PPBdikFKIDM8NqOPgoVYLPq66xbHAY7k9jzwXYpBSiAzPDajj4KFWCz6uusWxwGO5PY88F2KQUogMzy2o4+ChVgs+rrrFscBjuT2PPBdikFKIDM8NqOPgoVYLPq66xbHAY7k9jzwXYpBSiAzPDajj4KFWCz6uusWxwGO5PY88F2KQUogMzw2o4+ChVgs+rrrFscBjuT2PPBdikFKIDM8NqOPgoVYLPq66xbHAY7k9jzwXYpBSiAzPDajj4KFWCz6uusWxwGO5PY88F2KQUogMzw'
    };

    try {
      audioRef.current.src = sounds[type] || sounds.sent;
      audioRef.current.volume = 0.3;
      audioRef.current.play().catch(err => console.log('Sound play failed:', err));
    } catch (error) {
      console.log('Error playing sound:', error);
    }
  };

  const updateMessageStatus = (messageId, status) => {
    setMessageStatuses(prev => ({
      ...prev,
      [messageId]: status
    }));

    // Play sound based on status
    if (status === 'delivered') {
      playSound('delivered');
      toast.info('Message delivered', { autoClose: 1000 });
    } else if (status === 'seen') {
      playSound('seen');
      toast.success('Message seen', { autoClose: 1000 });
    }
  };

  const simulateMessageDelivery = (messageId) => {
    // Simulate delivered status after 1 second
    setTimeout(() => {
      updateMessageStatus(messageId, 'delivered');
      
      // Simulate seen status after 3 more seconds
      setTimeout(() => {
        updateMessageStatus(messageId, 'seen');
      }, 3000);
    }, 1000);
  };

  return (
    <Box sx={{ display: "flex", height: "calc(100vh - 64px)", bgcolor: "#0a0e27" }}>
      {/* Chat List */}
      <Box
        sx={{
          width: { xs: "100%", md: "35%" },
          borderRight: "1px solid rgba(255,255,255,0.1)",
          overflowY: "auto",
          bgcolor: "#121212",
          display: selectedChat && window.innerWidth < 960 ? "none" : "block",
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ color: "white", mb: 2 }}>
            Messages
          </Typography>
          <Button
            fullWidth
            variant="contained"
            onClick={() => setOpenNewChat(true)}
            sx={{ background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)" }}
          >
            New Chat
          </Button>
        </Box>

        {loading ? (
          <CircularProgress sx={{ m: 2, color: "white" }} />
        ) : chatRooms.length === 0 ? (
          <Typography sx={{ p: 2, color: "rgba(255,255,255,0.5)" }}>
            No chats yet. Start a new conversation!
          </Typography>
        ) : (
          chatRooms.map((chat) => (
            <Card
              key={chat._id}
              onClick={() => handleSelectChat(chat)}
              sx={{
                m: 1,
                cursor: "pointer",
                bgcolor: selectedChat?._id === chat._id ? "#1E1E1E" : "#1A1A1A",
                border: selectedChat?._id === chat._id ? "1px solid #2196F3" : "none",
                "&:hover": { bgcolor: "#1E1E1E" },
              }}
            >
              <CardContent sx={{ p: 1.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Avatar
                    src={chat.adminImage || chat.userImage}
                    sx={{ width: 40, height: 40 }}
                  >
                    {chat.adminName?.[0] || chat.userName?.[0]}
                  </Avatar>
                  <Box sx={{ flex: 1, overflow: "hidden" }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "white",
                        fontWeight: 600,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {chat.subject}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "rgba(255,255,255,0.6)" }}
                    >
                      {chat.adminName || "Support Team"}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                  <Chip
                    label={chat.status}
                    size="small"
                    color={getStatusColor(chat.status)}
                    sx={{ height: 20 }}
                  />
                  <Chip
                    label={chat.priority}
                    size="small"
                    color={getPriorityColor(chat.priority)}
                    sx={{ height: 20 }}
                  />
                </Box>
              </CardContent>
            </Card>
          ))
        )}
      </Box>

      {/* Chat Window */}
      {selectedChat && (
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", bgcolor: "#0a0e27" }}>
          {/* Header */}
          <Box
            sx={{
              p: 2,
              borderBottom: "1px solid rgba(255,255,255,0.1)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography variant="h6" sx={{ color: "white" }}>
                {selectedChat.subject}
              </Typography>
              <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.6)" }}>
                {selectedChat.adminName || "Waiting for admin response..."}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Tooltip title="Start Video Call">
                <IconButton
                  onClick={handleStartVideoCall}
                  sx={{
                    bgcolor: "#4caf50",
                    color: "white",
                    "&:hover": { bgcolor: "#45a049" },
                  }}
                >
                  <VideocamIcon />
                </IconButton>
              </Tooltip>
              <Button
                size="small"
                onClick={() => setSelectedChat(null)}
                sx={{ color: "white" }}
              >
                <CloseIcon />
              </Button>
            </Box>
          </Box>

          {/* Messages */}
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              p: 2,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {messages.length === 0 ? (
              <Typography sx={{ color: "rgba(255,255,255,0.5)", textAlign: "center" }}>
                Start the conversation by sending a message...
              </Typography>
            ) : (
              messages.map((msg, idx) => (
                <Box
                  key={idx}
                  sx={{
                    display: "flex",
                    justifyContent:
                      msg.senderRole === session?.user?.role ? "flex-end" : "flex-start",
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: "70%",
                      bgcolor:
                        msg.senderRole === session?.user?.role
                          ? "#2196F3"
                          : "#1E1E1E",
                      color: "white",
                      p: 1.5,
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
                      {msg.content}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
                      <Typography
                        variant="caption"
                        sx={{ color: "rgba(255,255,255,0.7)" }}
                      >
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </Typography>
                      {msg.senderRole === session?.user?.role && (
                        <Box sx={{ display: "flex", alignItems: "center", ml: 0.5 }}>
                          {messageStatuses[msg._id] === 'seen' ? (
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Typography variant="caption" sx={{ color: "#4caf50", fontSize: "0.7rem" }}>
                                ✓✓
                              </Typography>
                            </Box>
                          ) : messageStatuses[msg._id] === 'delivered' ? (
                            <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.7)", fontSize: "0.7rem" }}>
                              ✓✓
                            </Typography>
                          ) : (
                            <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)", fontSize: "0.7rem" }}>
                              ✓
                            </Typography>
                          )}
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Box>
              ))
            )}
            <div ref={messagesEndRef} />
          </Box>

          {/* Input Area */}
          <Box sx={{ p: 2, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
            <Box sx={{ display: "flex", gap: 1 }}>
              <TextField
                fullWidth
                placeholder="Type your message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    handleSendMessage();
                  }
                }}
                multiline
                maxRows={3}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "white",
                    "& fieldset": {
                      borderColor: "rgba(255, 255, 255, 0.23)",
                    },
                  },
                }}
              />
              <Button
                variant="contained"
                endIcon={<SendIcon />}
                onClick={handleSendMessage}
                sx={{ background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)" }}
              >
                Send
              </Button>
            </Box>
          </Box>
        </Box>
      )}

      {/* New Chat Dialog */}
      <Dialog open={openNewChat} onClose={() => setOpenNewChat(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: "#1E1E1E", color: "white" }}>
          Start New Conversation
        </DialogTitle>
        <DialogContent sx={{ bgcolor: "#1E1E1E", color: "white" }}>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              label="Subject"
              value={newChatData.subject}
              onChange={(e) =>
                setNewChatData({ ...newChatData, subject: e.target.value })
              }
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "white",
                  "& fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.23)",
                  },
                },
              }}
            />
            <FormControl fullWidth>
              <InputLabel sx={{ color: "white" }}>Category</InputLabel>
              <Select
                value={newChatData.category}
                onChange={(e) =>
                  setNewChatData({ ...newChatData, category: e.target.value })
                }
                label="Category"
                sx={{
                  color: "white",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255, 255, 255, 0.23)",
                  },
                }}
              >
                <MenuItem value="general">General</MenuItem>
                <MenuItem value="support">Support</MenuItem>
                <MenuItem value="billing">Billing</MenuItem>
                <MenuItem value="technical">Technical</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel sx={{ color: "white" }}>Priority</InputLabel>
              <Select
                value={newChatData.priority}
                onChange={(e) =>
                  setNewChatData({ ...newChatData, priority: e.target.value })
                }
                label="Priority"
                sx={{
                  color: "white",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255, 255, 255, 0.23)",
                  },
                }}
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="urgent">Urgent</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ bgcolor: "#1E1E1E", p: 2 }}>
          <Button onClick={() => setOpenNewChat(false)} sx={{ color: "white" }}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateNewChat}
            variant="contained"
            sx={{ background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)" }}
          >
            Start Chat
          </Button>
        </DialogActions>
      </Dialog>

      {/* GetStream Video Call Component */}
      {selectedChat && (
        <VideoCallComponent
          open={openVideoCall}
          onClose={handleEndVideoCall}
          callId={`chat_${selectedChat._id}`}
          callType="default"
          participantName={selectedChat.adminName || "Support Team"}
          participantImage={selectedChat.adminImage}
        />
      )}
    </Box>
  );
};

export default UserChat;
