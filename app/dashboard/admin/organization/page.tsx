"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/sidebar/SideBar";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import BusinessIcon from "@mui/icons-material/Business";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";

const toSlug = (value) => value
  .toLowerCase()
  .trim()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-+|-+$/g, "");

export default function OrganizationAdminPage() {
  const router = useRouter();
  const [committeePreset, setCommitteePreset] = useState("");
  const [members, setMembers] = useState([]);
  const [associations, setAssociations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newAssociationName, setNewAssociationName] = useState("");
  const [newAssociationEnglishName, setNewAssociationEnglishName] = useState("");
  const [newAssociationSlug, setNewAssociationSlug] = useState("");
  const [savingAssociation, setSavingAssociation] = useState(false);
  const [selectedAssociation, setSelectedAssociation] = useState(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editingAssociation, setEditingAssociation] = useState(null);
  const [editAssociationName, setEditAssociationName] = useState("");

  useEffect(() => {
    setCommitteePreset(new URLSearchParams(window.location.search).get("committee") || "");
  }, []);

  useEffect(() => {
    Promise.all([
      fetch("/api/members", { credentials: "include" }),
      fetch("/api/admin/associations", { credentials: "include" }),
    ])
      .then(async ([membersResponse, associationsResponse]) => {
        if (!membersResponse.ok) throw new Error("Unable to load members");
        const memberData = await membersResponse.json();
        const associationData = associationsResponse.ok ? await associationsResponse.json() : { data: [] };
        setMembers(memberData);
        setAssociations(associationData.data || []);
        setSelectedAssociation(associationData.data?.[0] || null);
        if (committeePreset === "women" && associationData.data?.[0]?._id) {
          router.push(`/dashboard/admin/organization/${associationData.data[0].slug || associationData.data[0]._id}?committee=women`);
        }
      })
      .catch((loadError) => setError(loadError.message))
      .finally(() => setLoading(false));
  }, [committeePreset, router]);

  const handleAddAssociation = async () => {
    const name = newAssociationName.trim();
    const englishName = newAssociationEnglishName.trim();
    const slug = newAssociationSlug.trim();
    if (!name) {
      setError("Professional Association name is required");
      return;
    }
    if (!englishName) {
      setError("Professional Association English name is required");
      return;
    }
    if (!slug) {
      setError("Professional Association slug is required");
      return;
    }

    setSavingAssociation(true);
    setError("");
    try {
      const response = await fetch("/api/admin/associations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, englishName, slug }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to save association name");
      const nextAssociations = [...associations, data.data].sort((first, second) =>
        first.name.localeCompare(second.name)
      );
      setAssociations(nextAssociations);
      setSelectedAssociation(data.data);
      setNewAssociationName("");
      setNewAssociationEnglishName("");
      setNewAssociationSlug("");
      setOpenAddDialog(false);
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSavingAssociation(false);
    }
  };

  const openEditDialogFor = (association) => {
    setEditingAssociation(association);
    setEditAssociationName(association.name);
    setOpenEditDialog(true);
  };

  const closeEditDialog = () => {
    setEditingAssociation(null);
    setEditAssociationName("");
    setOpenEditDialog(false);
  };

  const handleRenameAssociation = async () => {
    const name = editAssociationName.trim();
    if (!name) {
      setError("Professional Association name is required");
      return;
    }
    if (!editingAssociation) return;

    setSavingAssociation(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/associations/${editingAssociation._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to rename association");
      const renamed = { ...editingAssociation, name: data.data.name };
      setAssociations((current) =>
        current
          .map((association) => (association._id === renamed._id ? renamed : association))
          .sort((first, second) => first.name.localeCompare(second.name))
      );
      setSelectedAssociation((current) => (current?._id === renamed._id ? renamed : current));
      // Keep members' association name in sync on the client
      setMembers((current) =>
        current.map((member) =>
          member.professionalAssociation === editingAssociation.name
            ? { ...member, professionalAssociation: renamed.name }
            : member
        )
      );
      closeEditDialog();
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSavingAssociation(false);
    }
  };

  const deleteAssociation = async (association) => {
    if (!association) return;
    if (!window.confirm(`Delete "${association.name}"? Members assigned to it will be unassigned.`)) return;

    setSavingAssociation(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/associations/${association._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to delete association");
      const remaining = associations.filter((item) => item._id !== association._id);
      setAssociations(remaining);
      setSelectedAssociation((current) =>
        current?._id === association._id ? (remaining[0] || null) : current
      );
      // Clear the association from members on the client
      setMembers((current) =>
        current.map((member) =>
          member.professionalAssociation === association.name
            ? { ...member, professionalAssociation: "" }
            : member
        )
      );
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSavingAssociation(false);
    }
  };

  const memberCountFor = (associationName) => {
    const normalizedAssociation = associationName.trim().toLowerCase();
    return members.filter((member) => {
      const assignedAssociation = member.professionalAssociation || member.organization || "";
      return assignedAssociation.trim().toLowerCase() === normalizedAssociation;
    }).length;
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f5f7fa" }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, minWidth: 0, p: { xs: 2, sm: 3, md: 5 } }}>
        <Box sx={{ maxWidth: 1280, mx: "auto" }}>
          <Box sx={{ mb: { xs: 3, md: 4 } }}>
            <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mb: 1 }}>
              <Box sx={{ display: "grid", placeItems: "center", width: 36, height: 36, borderRadius: 2, bgcolor: "#e0f2f1", color: "#087f73" }}><AccountTreeIcon fontSize="small" /></Box>
              <Typography variant="overline" sx={{ color: "#087f73", fontWeight: 800, letterSpacing: "0.14em" }}>Organization management</Typography>
            </Stack>
            <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" gap={2}>
              <Box>
                <Typography variant="h3" component="h1" sx={{ color: "#17212b", fontWeight: 800, fontSize: { xs: "2rem", md: "2.65rem" } }}>पेशागत सङ्घ</Typography>
                <Typography color="text.secondary" sx={{ mt: 0.75, maxWidth: 620 }}>Organize professional associations and open their committee structures from one place.</Typography>
              </Box>
              <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenAddDialog(true)} disabled={savingAssociation} sx={{ alignSelf: { xs: "stretch", md: "flex-start" }, minHeight: 44, px: 2.5, bgcolor: "#087f73", "&:hover": { bgcolor: "#05665c" } }}>Add association</Button>
            </Stack>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" }, gap: 2, mb: 3 }}>
            {[
              { label: "Associations", value: associations.length, icon: <BusinessIcon />, color: "#1769aa", bg: "#e7f0fb" },
              { label: "Total members", value: members.length, icon: <PeopleAltIcon />, color: "#087f73", bg: "#e0f2f1" },
              { label: "Selected workspace", value: selectedAssociation?.name || "None", icon: <AccountTreeIcon />, color: "#b45309", bg: "#fef3c7" },
            ].map((stat) => (
              <Card key={stat.label} sx={{ border: "1px solid #e1e7ee", boxShadow: "0 8px 24px rgba(31, 48, 75, 0.05)" }}>
                <CardContent sx={{ display: "flex", alignItems: "center", gap: 1.5, p: 2.25 }}>
                  <Box sx={{ display: "grid", placeItems: "center", width: 42, height: 42, borderRadius: 2, color: stat.color, bgcolor: stat.bg }}>{stat.icon}</Box>
                  <Box sx={{ minWidth: 0 }}><Typography variant="caption" color="text.secondary">{stat.label}</Typography><Typography noWrap={!loading} sx={{ color: "#17212b", fontWeight: 800, fontSize: stat.label === "Selected workspace" ? "1rem" : "1.65rem" }}>{loading || error ? "--" : stat.value}</Typography></Box>
                </CardContent>
              </Card>
            ))}
          </Box>

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1.35fr) minmax(300px, 0.65fr)" }, gap: 3, alignItems: "start" }}>
            <Card sx={{ border: "1px solid #e1e7ee", boxShadow: "0 10px 30px rgba(31, 48, 75, 0.06)" }}>
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography variant="h6" sx={{ color: "#17212b", fontWeight: 800 }}>Professional associations</Typography>
                <Typography color="text.secondary" sx={{ mt: 0.5, mb: 2.5 }}>Select an association to manage its committees.</Typography>
                {loading ? <Box sx={{ display: "flex", justifyContent: "center", py: 7 }}><CircularProgress /></Box> : associations.length === 0 ? (
                  <Box sx={{ py: 5, textAlign: "center", border: "1px dashed #cbd5df", borderRadius: 2 }}><BusinessIcon sx={{ fontSize: 42, color: "#94a3b8", mb: 1 }} /><Typography color="text.secondary">No professional associations yet.</Typography><Button size="small" startIcon={<AddIcon />} onClick={() => setOpenAddDialog(true)} sx={{ mt: 1 }}>Create the first one</Button></Box>
                ) : <Stack spacing={1.25}>{associations.map((association) => {
                  const count = association.memberCount ?? memberCountFor(association.name);
                  const isSelected = selectedAssociation?._id === association._id;
                  return <Box key={association._id} onClick={() => router.push(`/dashboard/admin/organization/${association.slug || association._id}`)} sx={{ display: "flex", alignItems: "center", gap: 1.5, p: 1.5, border: "1px solid", borderColor: isSelected ? "#087f73" : "#e1e7ee", borderRadius: 2, bgcolor: isSelected ? "#f0faf8" : "#fff", cursor: "pointer", transition: "border-color 160ms ease, transform 160ms ease", "&:hover": { borderColor: "#087f73", transform: "translateY(-1px)" } }}>
                    <Box sx={{ display: "grid", placeItems: "center", flexShrink: 0, width: 40, height: 40, borderRadius: 1.5, bgcolor: isSelected ? "#d5f1ec" : "#f0f4f7", color: isSelected ? "#087f73" : "#64748b" }}><BusinessIcon fontSize="small" /></Box>
                    <Box sx={{ minWidth: 0, flexGrow: 1 }}><Typography noWrap fontWeight={700} color="#17212b">{association.name}</Typography><Typography variant="body2" color="text.secondary">{count} member{count === 1 ? "" : "s"}</Typography></Box>
                    <Stack direction="row" spacing={0.25} onClick={(event) => event.stopPropagation()}><Tooltip title="Rename"><IconButton size="small" onClick={() => openEditDialogFor(association)} disabled={savingAssociation}><EditIcon fontSize="small" /></IconButton></Tooltip><Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => deleteAssociation(association)} disabled={savingAssociation}><DeleteIcon fontSize="small" /></IconButton></Tooltip></Stack>
                    <ArrowForwardIcon fontSize="small" sx={{ color: isSelected ? "#087f73" : "#94a3b8" }} />
                  </Box>;
                })}</Stack>}
              </CardContent>
            </Card>

            <Card sx={{ color: "white", bgcolor: "#173b4d", backgroundImage: "linear-gradient(145deg, #173b4d, #0d5960)", boxShadow: "0 12px 30px rgba(13, 59, 72, 0.18)" }}>
              <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}><Typography variant="overline" sx={{ color: "#8ce3d5", fontWeight: 800, letterSpacing: "0.12em" }}>Current workspace</Typography><Typography variant="h5" sx={{ mt: 1, fontWeight: 800 }}>{selectedAssociation?.name || "Choose an association"}</Typography><Typography sx={{ mt: 1, color: "rgba(255,255,255,.72)" }}>{selectedAssociation ? "Continue to committee management to build your organization structure." : "Create or select an association to get started."}</Typography><Button fullWidth variant="contained" endIcon={<ArrowForwardIcon />} disabled={!selectedAssociation} onClick={() => router.push(`/dashboard/admin/organization/${selectedAssociation?.slug || selectedAssociation?._id}`)} sx={{ mt: 3, bgcolor: "#8ce3d5", color: "#173b4d", "&:hover": { bgcolor: "#b3f0e5" } }}>Open committee workspace</Button></CardContent>
            </Card>
          </Box>
        </Box>

        {/* Add Professional Association Dialog */}
        <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} maxWidth="xs" fullWidth>
          <DialogTitle>Add Professional Association</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              fullWidth
              label="Association name (Nepali)"
              value={newAssociationName}
              onChange={(event) => setNewAssociationName(event.target.value)}
              disabled={savingAssociation}
              sx={{ mt: 1 }}
            />
            <TextField
              fullWidth
              label="Association name (English)"
              value={newAssociationEnglishName}
              onChange={(event) => {
                const englishName = event.target.value;
                setNewAssociationEnglishName(englishName);
                setNewAssociationSlug(toSlug(englishName) || "association");
              }}
              disabled={savingAssociation}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="Association slug"
              value={newAssociationSlug}
              onChange={(event) => setNewAssociationSlug(toSlug(event.target.value))}
              onKeyDown={(event) => {
                if (event.key === "Enter") handleAddAssociation();
              }}
              helperText="Used in URLs. Use lowercase letters, numbers, and hyphens."
              disabled={savingAssociation}
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button onClick={() => setOpenAddDialog(false)} disabled={savingAssociation}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleAddAssociation}
              disabled={savingAssociation || !newAssociationName.trim() || !newAssociationEnglishName.trim() || !newAssociationSlug.trim()}
            >
              {savingAssociation ? "Adding..." : "Add"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Rename Professional Association Dialog */}
        <Dialog open={openEditDialog} onClose={closeEditDialog} maxWidth="xs" fullWidth>
          <DialogTitle>Rename Association</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              fullWidth
              label="Association name"
              value={editAssociationName}
              onChange={(event) => setEditAssociationName(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") handleRenameAssociation();
              }}
              disabled={savingAssociation}
              sx={{ mt: 1 }}
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button onClick={closeEditDialog} disabled={savingAssociation}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleRenameAssociation}
              disabled={savingAssociation || !editAssociationName.trim()}
            >
              {savingAssociation ? "Saving..." : "Save"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}
