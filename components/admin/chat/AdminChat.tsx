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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
  Badge,
  Divider,
  Grid,
  Menu,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import VideocamIcon from "@mui/icons-material/Videocam";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import CallEndIcon from "@mui/icons-material/CallEnd";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import DeleteIcon from "@mui/icons-material/Delete";
import BlockIcon from "@mui/icons-material/Block";
import LockIcon from "@mui/icons-material/Lock";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import Sidebar from "@/components/sidebar/SideBar";
// Dynamic import for VideoCall component to avoid SSR issues
const VideoCallComponent = dynamic(
  () => import('../../VideoCall/VideoCallComponent'),
  { ssr: false }
);

const AdminChat = () => {
  const { data: session } = useSession();
  const [chatRooms, setChatRooms] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [openAssign, setOpenAssign] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openVideoCall, setOpenVideoCall] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isCallActive, setIsCallActive] = useState(false);
  const [quickResponses] = useState([
    "Thank you for contacting us. How can I help you today?",
    "I understand your concern. Let me look into this for you.",
    "This has been resolved. Is there anything else I can help with?",
    "Your request has been forwarded to the appropriate team.",
  ]);
  const messagesEndRef = useRef(null);
  const audioRef = useRef(null);
  const [previousMessageCount, setPreviousMessageCount] = useState({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);
  const [closeDialogOpen, setCloseDialogOpen] = useState(false);
  const [messageMenuAnchor, setMessageMenuAnchor] = useState(null);
  const [selectedMessageIndex, setSelectedMessageIndex] = useState(null);

  useEffect(() => {
    fetchChats();
    const interval = setInterval(fetchChats, 3000); // Poll every 3 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Create audio element for Facebook Messenger notification sound
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
      const response = await fetch("/api/chat");
      if (response.ok) {
        const data = await response.json();

        // Check for new messages from users and play sound
        data.forEach(chat => {
          const chatId = chat._id;
          const currentMessageCount = chat.messages.length;
          const previousCount = previousMessageCount[chatId];

          // Only notify if we have a previous count (not first load) and there are new messages
          if (previousCount !== undefined && currentMessageCount > previousCount) {
            // Check if the new message is from a user (not admin)
            const latestMessage = chat.messages[chat.messages.length - 1];
            if (latestMessage && latestMessage.senderRole !== "admin") {
              playFacebookMessengerSound();
              toast.info(`New message from ${chat.userName || 'Guest'}`, {
                position: "top-right",
                autoClose: 3000,
              });
            }
          }

          // Update the message count
          setPreviousMessageCount(prev => ({
            ...prev,
            [chatId]: currentMessageCount
          }));
        });

        setChatRooms(data);

        // Calculate unread messages
        const unread = data.reduce((acc, chat) => {
          const unreadMessages = chat.messages.filter(
            (msg) => !msg.isRead && msg.senderRole !== "admin"
          );
          return acc + unreadMessages.length;
        }, 0);
        setUnreadCount(unread);

        // Update selected chat if it exists
        if (selectedChat) {
          const updated = data.find((c) => c._id === selectedChat._id);
          if (updated) {
            setSelectedChat(updated);
            setMessages(updated.messages);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
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
        toast.success("Message sent");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    if (!selectedChat) return;

    try {
      const response = await fetch(`/api/chat/${selectedChat._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const updatedChat = await response.json();
        setSelectedChat(updatedChat);
        setChatRooms(
          chatRooms.map((c) => (c._id === updatedChat._id ? updatedChat : c))
        );
        toast.success(`Chat ${newStatus}`);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const handleAssignChat = async (adminId) => {
    if (!selectedChat) return;

    try {
      const response = await fetch(`/api/chat/${selectedChat._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ adminId }),
      });

      if (response.ok) {
        const updatedChat = await response.json();
        setSelectedChat(updatedChat);
        setChatRooms(
          chatRooms.map((c) => (c._id === updatedChat._id ? updatedChat : c))
        );
        setOpenAssign(false);
        toast.success("Chat assigned");
      }
    } catch (error) {
      console.error("Error assigning chat:", error);
      toast.error("Failed to assign chat");
    }
  };

  const filteredChats = chatRooms.filter((chat) => {
    let matchesStatus = filterStatus === "all" || chat.status === filterStatus;
    let matchesPriority = filterPriority === "all" || chat.priority === filterPriority;
    let matchesSearch = searchQuery === "" ||
      chat.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.subject?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesPriority && matchesSearch;
  });

  const stats = {
    total: chatRooms.length,
    active: chatRooms.filter((c) => c.status === "active").length,
    closed: chatRooms.filter((c) => c.status === "closed").length,
    urgent: chatRooms.filter((c) => c.priority === "urgent").length,
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

  const playFacebookMessengerSound = () => {
    if (!audioRef.current) return;

    // Facebook Messenger "pop" sound (base64 encoded WAV)
    try {
      // This is a simple notification sound encoded as base64 WAV
      const messengerSound = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';

      audioRef.current.src = messengerSound;
      audioRef.current.volume = 0.5; // 50% volume
      audioRef.current.play().catch(err => console.log('Sound play failed:', err));
    } catch (error) {
      console.log('Error playing sound:', error);
    }
  };

  const handleOpenMessageMenu = (event, messageIndex) => {
    setMessageMenuAnchor(event.currentTarget);
    setSelectedMessageIndex(messageIndex);
  };

  const handleCloseMessageMenu = () => {
    setMessageMenuAnchor(null);
    setSelectedMessageIndex(null);
  };

  const handleOpenDeleteDialog = (messageIndex) => {
    setMessageToDelete(messageIndex);
    setDeleteDialogOpen(true);
    handleCloseMessageMenu();
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setMessageToDelete(null);
  };

  const handleDeleteMessage = async () => {
    if (!selectedChat || messageToDelete === null) return;

    try {
      const response = await fetch(`/api/chat/${selectedChat._id}/message/${messageToDelete}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const updatedChat = await response.json();
        setSelectedChat(updatedChat);
        setMessages(updatedChat.messages);
        setChatRooms(
          chatRooms.map((c) => (c._id === updatedChat._id ? updatedChat : c))
        );
        toast.success("Message deleted successfully");
      } else {
        toast.error("Failed to delete message");
      }
    } catch (error) {
      console.error("Error deleting message:", error);
      toast.error("Failed to delete message");
    } finally {
      handleCloseDeleteDialog();
    }
  };

  return (
    <Box sx={{ display: "flex", bgcolor: "#f5f5f5", minHeight: "100vh" }}>
      {/* Sidebar */}
      <Box sx={{ width: { xs: 0, sm: 250, md: 280 }, bgcolor: "white", borderRight: "1px solid #e0e0e0" }}>
        <Sidebar />
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Stats Dashboard */}
        <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, bgcolor: "white", borderBottom: "1px solid #e0e0e0", overflowY: "auto", maxHeight: "30%" }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: "#1a1a2e" }}>
            Support Chat Dashboard
          </Typography>
          <Grid container spacing={2}>
            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 3
              }}>
              <Card sx={{ bgcolor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", borderRadius: 2 }}>
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Box>
                      <Typography variant="h4" sx={{ color: "black", fontWeight: 700 }}>
                        {stats.total}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "rgba(19, 19, 19, 0.9)" }}>
                        Total Chats
                      </Typography>
                    </Box>
                    <Badge badgeContent={unreadCount} color="error">
                      <NotificationsActiveIcon sx={{ fontSize: 32, color: "white" }} />
                    </Badge>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 3
              }}>
              <Card sx={{ bgcolor: "#4caf50", borderRadius: 2 }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="h4" sx={{ color: "white", fontWeight: 700 }}>
                    {stats.active}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.9)" }}>
                    Active Chats
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 3
              }}>
              <Card sx={{ bgcolor: "#ff9800", borderRadius: 2 }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="h4" sx={{ color: "white", fontWeight: 700 }}>
                    {stats.urgent}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.9)" }}>
                    Urgent
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 3
              }}>
              <Card sx={{ bgcolor: "#9e9e9e", borderRadius: 2 }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="h4" sx={{ color: "white", fontWeight: 700 }}>
                    {stats.closed}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.9)" }}>
                    Closed Chats
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Chat Container */}
        <Box sx={{ flex: 1, display: "flex", overflow: "hidden", gap: 0 }}>
          {/* Chat List */}
          <Box
            sx={{
              width: { xs: selectedChat ? "0%" : "100%", sm: "35%", md: "30%" },
              borderRight: "1px solid #e0e0e0",
              overflowY: "auto",
              bgcolor: "white",
              transition: "width 0.3s ease",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box sx={{ p: 2, borderBottom: "1px solid #e0e0e0", bgcolor: "white", position: "sticky", top: 0, zIndex: 10 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                <Typography variant="h6" sx={{ color: "#1a1a2e", fontWeight: 700, flex: 1 }}>
                  Support Tickets
                </Typography>
                {unreadCount > 0 && (
                  <Chip
                    label={`${unreadCount} new`}
                    size="small"
                    color="error"
                  />
                )}
              </Box>

              {/* Search Bar */}
              <TextField
                fullWidth
                size="small"
                placeholder="Search chats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ color: "#666", mr: 1 }} />,
                }}
                sx={{ mb: 2 }}
              />

              <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                <FormControl size="small" sx={{ flex: 1 }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    label="Status"
                  >
                    <MenuItem value="all">All Status</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="closed">Closed</MenuItem>
                    <MenuItem value="archived">Archived</MenuItem>
                  </Select>
                </FormControl>
                <FormControl size="small" sx={{ flex: 1 }}>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                    label="Priority"
                  >
                    <MenuItem value="all">All Priority</MenuItem>
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                    <MenuItem value="urgent">Urgent</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </Box>

            {/* Chat List Items */}
            <Box sx={{ flex: 1, overflowY: "auto" }}>
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                  <CircularProgress />
                </Box>
              ) : filteredChats.length === 0 ? (
                <Typography sx={{ p: 4, color: "#999", textAlign: "center" }}>
                  No chats found
                </Typography>
              ) : (
                filteredChats.map((chat) => {
                  const unreadMessages = chat.messages.filter(
                    (msg) => !msg.isRead && msg.senderRole !== "admin"
                  ).length;

                  return (
                    <Card
                      key={chat._id}
                      onClick={() => handleSelectChat(chat)}
                      sx={{
                        m: 1,
                        cursor: "pointer",
                        bgcolor: selectedChat?._id === chat._id ? "#e3f2fd" : "white",
                        border: selectedChat?._id === chat._id ? "2px solid #2196F3" : "1px solid #e0e0e0",
                        "&:hover": { bgcolor: "#f5f5f5", boxShadow: 2 },
                        transition: "all 0.2s",
                        borderRadius: 2,
                      }}
                    >
                      <CardContent sx={{ p: 1.5 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                          <Badge badgeContent={unreadMessages} color="error">
                            <Avatar
                              src={chat.userImage}
                              sx={{
                                width: 40,
                                height: 40,
                                bgcolor: chat.userId ? "#2196F3" : "#ff9800"
                              }}
                            >
                              {chat.userId ? chat.userName?.[0] : "G"}
                            </Avatar>
                          </Badge>
                          <Box sx={{ flex: 1, overflow: "hidden" }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.3 }}>
                              <Typography
                                variant="body2"
                                sx={{
                                  color: "#1a1a2e",
                                  fontWeight: 600,
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {chat.userId ? chat.userName : `Guest: ${chat.userName}`}
                              </Typography>
                              {!chat.userId && (
                                <Chip
                                  label="GUEST"
                                  size="small"
                                  sx={{
                                    height: 16,
                                    fontSize: "0.6rem",
                                    bgcolor: "#ff9800",
                                    color: "white",
                                    fontWeight: 600
                                  }}
                                />
                              )}
                            </Box>
                            <Typography
                              variant="caption"
                              sx={{
                                color: "#666",
                                display: "block",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                fontSize: "0.75rem"
                              }}
                            >
                              {chat.userId ? chat.subject : `${chat.userEmail}`}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                          <Chip
                            label={chat.status}
                            size="small"
                            color={getStatusColor(chat.status)}
                            sx={{ height: 18, fontSize: "0.7rem" }}
                          />
                          <Chip
                            label={chat.priority}
                            size="small"
                            color={getPriorityColor(chat.priority)}
                            sx={{ height: 18, fontSize: "0.7rem" }}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </Box>
          </Box>

          {/* Chat Window */}
          {selectedChat && (
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", bgcolor: "#fafafa", overflow: "hidden" }}>
              {/* Header */}
              <Box
                sx={{
                  p: 2,
                  bgcolor: "white",
                  borderBottom: "1px solid #e0e0e0",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, flex: 1, minWidth: 0 }}>
                  <Avatar
                    src={selectedChat.userImage}
                    sx={{
                      width: 45,
                      height: 45,
                      bgcolor: selectedChat.userId ? "#2196F3" : "#ff9800"
                    }}
                  >
                    {selectedChat.userId ? selectedChat.userName?.[0] : "G"}
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.3 }}>
                      <Typography variant="body1" sx={{ color: "#1a1a2e", fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {selectedChat.userId ? selectedChat.userName : `Guest: ${selectedChat.userName}`}
                      </Typography>
                      {!selectedChat.userId && (
                        <Chip
                          label="GUEST"
                          size="small"
                          sx={{
                            height: 18,
                            fontSize: "0.65rem",
                            bgcolor: "#ff9800",
                            color: "white",
                            fontWeight: 600
                          }}
                        />
                      )}
                    </Box>
                    <Typography variant="caption" sx={{ color: "#666", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {selectedChat.userId ?
                        `${selectedChat.subject}` :
                        `${selectedChat.userEmail}`
                      }
                    </Typography>
                  </Box>
                </Box>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Tooltip title="Start Video Call">
                    <IconButton
                      size="small"
                      onClick={handleStartVideoCall}
                      sx={{
                        color: "#4caf50",
                        bgcolor: "#e8f5e9",
                        "&:hover": { bgcolor: "#c8e6c9" }
                      }}
                    >
                      <VideocamIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <FormControl size="small" sx={{ minWidth: 100 }}>
                    <Select
                      value={selectedChat.status}
                      onChange={(e) => handleUpdateStatus(e.target.value)}
                    >
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="closed">Closed</MenuItem>
                      <MenuItem value="archived">Archived</MenuItem>
                    </Select>
                  </FormControl>
                  <IconButton
                    size="small"
                    onClick={() => setSelectedChat(null)}
                    sx={{ color: "#666" }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </Box>

              {/* Messages */}
              <Box
                sx={{
                  flex: 1,
                  overflowY: "auto",
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.5,
                  bgcolor: "#fafafa",
                }}
              >
                {messages.map((msg, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      display: "flex",
                      justifyContent: msg.senderRole === "admin" ? "flex-end" : "flex-start",
                      animation: "fadeIn 0.3s ease-in",
                      position: "relative",
                      "&:hover .message-options": {
                        opacity: 1,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        maxWidth: "70%",
                        bgcolor: msg.senderRole === "admin" ? "#2196F3" : "white",
                        color: msg.senderRole === "admin" ? "white" : "#1a1a2e",
                        p: 1.5,
                        borderRadius: 2,
                        boxShadow: 1,
                        position: "relative",
                      }}
                    >
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 1 }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="caption"
                            sx={{
                              color: msg.senderRole === "admin" ? "rgba(255,255,255,0.9)" : "#666",
                              display: "block",
                              fontWeight: 600,
                              mb: 0.3,
                            }}
                          >
                            {msg.senderName}
                          </Typography>
                          <Typography variant="body2" sx={{ wordBreak: "break-word", lineHeight: 1.4 }}>
                            {msg.content}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: msg.senderRole === "admin" ? "rgba(255,255,255,0.7)" : "#999",
                              display: "block",
                              mt: 0.5,
                              textAlign: "right",
                              fontSize: "0.7rem"
                            }}
                          >
                            {new Date(msg.timestamp).toLocaleTimeString()}
                          </Typography>
                        </Box>
                        <IconButton
                          className="message-options"
                          size="small"
                          onClick={(e) => handleOpenMessageMenu(e, idx)}
                          sx={{
                            opacity: 0,
                            transition: "opacity 0.2s",
                            color: msg.senderRole === "admin" ? "rgba(255,255,255,0.7)" : "#666",
                            "&:hover": {
                              bgcolor: msg.senderRole === "admin" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
                            },
                            minWidth: "32px",
                            minHeight: "32px",
                          }}
                        >
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  </Box>
                ))}
                <div ref={messagesEndRef} />
              </Box>

              {/* Input Area */}
              <Box sx={{ p: 2, bgcolor: "white", borderTop: "1px solid #e0e0e0" }}>
                {/* Quick Responses */}
                <Box sx={{ mb: 1.5, display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                  {quickResponses.map((response, idx) => (
                    <Chip
                      key={idx}
                      label={response.substring(0, 20) + "..."}
                      size="small"
                      onClick={() => setMessageInput(response)}
                      sx={{
                        cursor: "pointer",
                        fontSize: "0.7rem",
                        "&:hover": { bgcolor: "#e3f2fd" },
                      }}
                    />
                  ))}
                </Box>

                <Box sx={{ display: "flex", gap: 1, alignItems: "flex-end" }}>
                  <TextField
                    fullWidth
                    placeholder="Type message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    multiline
                    maxRows={3}
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        bgcolor: "#f5f5f5",
                      },
                    }}
                  />
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim()}
                    sx={{
                      background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                      minWidth: 60,
                      height: 40,
                    }}
                  >
                    <SendIcon fontSize="small" />
                  </Button>
                </Box>
              </Box>
            </Box>
          )}

          {/* No Chat Selected Message */}
          {!selectedChat && (
            <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "#fafafa" }}>
              <Box sx={{ textAlign: "center" }}>
                <VideocamIcon sx={{ fontSize: 60, color: "#ccc", mb: 2 }} />
                <Typography variant="h6" sx={{ color: "#999", mb: 1 }}>
                  No chat selected
                </Typography>
                <Typography variant="body2" sx={{ color: "#bbb" }}>
                  Select a chat to start messaging
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      </Box>

      {/* Assign Dialog */}
      <Dialog open={openAssign} onClose={() => setOpenAssign(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: "white", color: "#1a1a2e", fontWeight: 700 }}>
          Assign to Team Member
        </DialogTitle>
        <DialogContent sx={{ bgcolor: "white", pt: 2 }}>
          <Typography variant="body2" sx={{ color: "#666", mb: 2 }}>
            Assign this chat to yourself or another admin team member
          </Typography>
        </DialogContent>
        <DialogActions sx={{ bgcolor: "white", p: 2 }}>
          <Button onClick={() => setOpenAssign(false)} sx={{ color: "#666" }}>
            Cancel
          </Button>
          <Button
            onClick={() => handleAssignChat(session?.user?.id)}
            variant="contained"
            sx={{ background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)" }}
          >
            Assign to Me
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
          participantName={selectedChat.userName}
          participantImage={selectedChat.userImage}
        />
      )}

      {/* Message Options Menu */}
      <Menu
        anchorEl={messageMenuAnchor}
        open={Boolean(messageMenuAnchor)}
        onClose={handleCloseMessageMenu}
        PaperProps={{
          sx: {
            boxShadow: 3,
            borderRadius: 2,
            minWidth: 180,
          },
        }}
      >
        <MenuItem
          onClick={() => handleOpenDeleteDialog(selectedMessageIndex)}
          sx={{
            color: "#d32f2f",
            "&:hover": {
              bgcolor: "#ffebee",
            },
          }}
        >
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete Message
        </MenuItem>
      </Menu>

      {/* Delete Message Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: "#fff3e0", color: "#e65100", fontWeight: 700 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <DeleteIcon />
            Delete Message?
          </Box>
        </DialogTitle>
        <DialogContent sx={{ bgcolor: "white", pt: 3 }}>
          <Typography variant="body1" sx={{ color: "#666", mb: 2 }}>
            Are you sure you want to delete this message? This action cannot be undone.
          </Typography>
          {messageToDelete !== null && messages[messageToDelete] && (
            <Box
              sx={{
                p: 2,
                bgcolor: "#f5f5f5",
                borderRadius: 2,
                borderLeft: "3px solid #ff9800",
              }}
            >
              <Typography variant="caption" sx={{ color: "#666", display: "block", mb: 0.5 }}>
                {messages[messageToDelete].senderName}
              </Typography>
              <Typography variant="body2" sx={{ color: "#1a1a2e" }}>
                {messages[messageToDelete].content}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ bgcolor: "white", p: 2, gap: 1 }}>
          <Button
            onClick={handleCloseDeleteDialog}
            sx={{ color: "#666" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteMessage}
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            sx={{
              bgcolor: "#d32f2f",
              "&:hover": {
                bgcolor: "#b71c1c",
              },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminChat;
