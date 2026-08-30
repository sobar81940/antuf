"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Sidebar from "@/components/sidebar/SideBar";
import AdminCardManagement from "@/components/admin/CardManagement/AdminCardManagement";
import UserManagement from "@/components/admin/user/UserManagement";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  Alert,
  Switch,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  Tabs,
  Tab,
} from "@mui/material";
import { format, parseISO } from "date-fns";
import { toast } from "react-toastify";

const Alluser = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [updatingRole, setUpdatingRole] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const { data: session, status } = useSession({ required: true });

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch("/api/members", {
          credentials: "include",
        });
        if (!response.ok) {
          const contentType = response.headers.get("content-type");
          let errorMessage = `Failed to fetch members: ${response.status}`;
          
          if (contentType?.includes("application/json")) {
            try {
              const errorData = await response.json();
              errorMessage = errorData.error || errorMessage;
            } catch (e) {
              console.error("Could not parse error response:", e);
            }
          } else {
            const text = await response.text();
            console.error("Non-JSON response:", text.substring(0, 200));
          }
          
          throw new Error(errorMessage);
        }
        const data = await response.json();
        setMembers(data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching members:", err);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      fetchMembers();
    }
  }, [session]);

  const handleStatusChange = async (memberId, currentStatus) => {
    try {
      setUpdating(true);
      setError(null);

      const response = await fetch(`/api/members/${memberId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isActive: !currentStatus,
        }),
        credentials: 'include', // Add this to include auth cookies
      });

      // Parse response data first
      const data = await response.json();

      // Then check for errors
      if (!response.ok) {
        throw new Error(data.error || "Failed to update status");
      }

      // If successful, update local state
      setMembers(prevMembers =>
        prevMembers.map(member =>
          member._id === memberId
            ? { ...member, isActive: !currentStatus }
            : member
        )
      );

      // Show success message
      toast.success(data.message || `User ${!currentStatus ? "activated" : "deactivated"} successfully`);

    } catch (error) {
      console.error("Status update error:", error);
      toast.error(error.message);
      setError(error.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleRoleChange = async (memberId, newRole, retryCount = 0) => {
    const MAX_RETRIES = 3;

    try {
      setUpdatingRole(true);
      setError(null);

      const response = await fetch(`/api/members/${memberId}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Check if error is retryable and we haven't exceeded max retries
        if (data.retryable && retryCount < MAX_RETRIES) {
          console.log(`Retrying role update (attempt ${retryCount + 1})`);
          await new Promise((resolve) => setTimeout(resolve, 1000));
          return handleRoleChange(memberId, newRole, retryCount + 1);
        }
        throw new Error(data.error || "Failed to update role");
      }

      setMembers(
        members.map((member) =>
          member._id === memberId ? data.user : member
        )
      );
    } catch (error) {
      console.error("Error updating role:", error);
      setError(error.message || "Failed to update user role");
    } finally {
      setUpdatingRole(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      if (!dateString) return "N/A";
      return format(parseISO(dateString), "MMM dd, yyyy");
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Invalid date";
    }
  };

  return (
    <Box sx={{ display: "flex", bgcolor: "#121212", minHeight: "100vh" }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Box
          sx={{
            background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
            p: 2,
            borderRadius: 2,
            mb: 3,
          }}
        >
          <Typography variant="h4" sx={{ color: "white", fontWeight: "bold" }}>
            Member Management
          </Typography>
        </Box>

        {/* Tabs for Member Management and Card Printing */}
        <Box sx={{ bgcolor: "#1E1E1E", borderRadius: 1, mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={(e, newValue) => setTabValue(newValue)}
            sx={{
              "& .MuiTab-root": {
                color: "rgba(255,255,255,0.7)",
                "&.Mui-selected": {
                  color: "white",
                },
              },
              "& .MuiTabs-indicator": {
                backgroundColor: "#2196F3",
              },
            }}
          >
            <Tab label="Members" />
            <Tab label="Card Printing" />
            <Tab label="All Users" />
          </Tabs>
        </Box>

        {/* Members Tab */}
        {tabValue === 0 && (
          <>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            ) : (
              <TableContainer component={Paper} sx={{ bgcolor: "#1E1E1E" }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                        Name
                      </TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                        Email
                      </TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                        Role
                      </TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                        Status
                      </TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                        Join Date
                      </TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                        Membership
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {members.map((member) => (
                      <TableRow
                        key={member._id}
                        sx={{
                          "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
                        }}
                      >
                        <TableCell sx={{ color: "white" }}>{member.name}</TableCell>
                        <TableCell sx={{ color: "white" }}>{member.email}</TableCell>
                        <TableCell>
                          <FormControl
                            size="small"
                            sx={{
                              minWidth: 120,
                              "& .MuiOutlinedInput-root": {
                                color: "white",
                                "& fieldset": {
                                  borderColor: "rgba(255, 255, 255, 0.23)",
                                },
                                "&:hover fieldset": {
                                  borderColor: "rgba(255, 255, 255, 0.5)",
                                },
                              },
                            }}
                          >
                            <Select
                              value={member.role}
                              onChange={(e) =>
                                handleRoleChange(member._id, e.target.value)
                              }
                              disabled={updatingRole || member.role === "admin"}
                              sx={{
                                color: "white",
                                ".MuiSvgIcon-root": {
                                  color: "white",
                                },
                              }}
                            >
                              <MenuItem value="user">User</MenuItem>
                              <MenuItem value="admin">Admin</MenuItem>
                              <MenuItem value="instructor">Instructor</MenuItem>
                            </Select>
                          </FormControl>
                          <Chip
                            label={member.role}
                            color={member.role === "admin" ? "error" : "info"}
                            size="small"
                            sx={{
                              ml: 1,
                              textTransform: "capitalize",
                              fontWeight: "medium",
                              "& .MuiChip-label": {
                                color: "white",
                              },
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Tooltip
                              title={`Click to ${
                                member.isActive ? "deactivate" : "activate"
                              } user`}
                            >
                              <Switch
                                checked={Boolean(member.isActive)}
                                onChange={() =>
                                  handleStatusChange(member._id, member.isActive)
                                }
                                disabled={updating}
                                sx={{
                                  "& .MuiSwitch-switchBase.Mui-checked": {
                                    color: "#00ff88",
                                  },
                                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                                    {
                                      backgroundColor: "#00ff88",
                                    },
                                }}
                              />
                            </Tooltip>
                            <Chip
                              label={member.isActive ? "Active" : "Inactive"}
                              color={member.isActive ? "success" : "error"}
                              size="small"
                            />
                          </Box>
                        </TableCell>
                        <TableCell sx={{ color: "white" }}>
                          {formatDate(member.createdAt)}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={member.membershipType || "Free"}
                            color="primary"
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </>
        )}

        {/* Card Printing Tab */}
        {tabValue === 1 && (
          <AdminCardManagement members={members} />
        )}

        {/* All Users Tab */}
        {tabValue === 2 && (
          <Box sx={{ bgcolor: "#1E1E1E", borderRadius: 1, p: 2 }}>
            <UserManagement />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Alluser;