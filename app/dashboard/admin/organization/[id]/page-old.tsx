"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "@/components/sidebar/SideBar";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import GroupsIcon from "@mui/icons-material/Groups";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AccountTreeIcon from "@mui/icons-material/AccountTree";

const presetCommittees = [
  { type: "women", name: "महिला समिति", nameEn: "Women's Committee" },
  { type: "central", name: "केन्द्रीय समिति", nameEn: "Central Committee" },
  { type: "provincial", name: "प्रदेश समिति", nameEn: "Provincial Committee" },
  { type: "district", name: "जिल्ला समन्वय समिति", nameEn: "District Coordination Committee" },
  { type: "institutional", name: "संस्थागत समिति", nameEn: "Institutional Committee" },
];

const isWomenCommittee = (committee) => {
  const name = `${committee?.name || ""} ${committee?.nameEn || ""}`.toLowerCase();
  return committee?.type === "women" || name.includes("महिला") || name.includes("women");
};

export default function AssociationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [committeePreset, setCommitteePreset] = useState("");
  const associationId = params?.id;

  const [association, setAssociation] = useState(null);
  const [committees, setCommittees] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Add / edit dialog state
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editingCommittee, setEditingCommittee] = useState(null);
  const [committeeType, setCommitteeType] = useState("");
  const [committeeName, setCommitteeName] = useState("");
  const [committeeNameEn, setCommitteeNameEn] = useState("");
  const [provinceName, setProvinceName] = useState("");
  const [provinceNameEn, setProvinceNameEn] = useState("");
  const [districtName, setDistrictName] = useState("");
  const [districtNameEn, setDistrictNameEn] = useState("");

  // Expanded committee (shows its members)
  const [expandedCommittee, setExpandedCommittee] = useState(null);

  // Member assignment dialog state
  const [openMemberDialog, setOpenMemberDialog] = useState(false);
  const [memberDialogCommittee, setMemberDialogCommittee] = useState(null);
  const [selectedMemberIds, setSelectedMemberIds] = useState([]);
  const [memberSearch, setMemberSearch] = useState("");
  const [openedPresetDialog, setOpenedPresetDialog] = useState(false);

  const loadData = useCallback(async () => {
    if (!associationId) return;
    setLoading(true);
    setError("");
    try {
      const [associationResponse, committeesResponse, membersResponse] = await Promise.all([
        fetch(`/api/admin/associations/${associationId}`, { credentials: "include" }),
        fetch(`/api/admin/associations/${associationId}/committees`, { credentials: "include" }),
        fetch("/api/members", { credentials: "include" }),
      ]);

      const associationData = associationResponse.ok ? await associationResponse.json() : null;
      const committeesData = committeesResponse.ok ? await committeesResponse.json() : null;
      const memberData = membersResponse.ok ? await membersResponse.json() : null;

      const loadedCommittees = committeesData?.data ?? [];
      setAssociation(associationData?.data ?? null);
      setCommittees(loadedCommittees);
      setExpandedCommittee(loadedCommittees.find(isWomenCommittee) || null);
      setMembers(memberData ?? []);

      // Surface any failed request instead of silently showing an empty list
      const failures = [];
      if (!associationResponse.ok) {
        let detail = `association API (HTTP ${associationResponse.status})`;
        try {
          const body = await associationResponse.clone().json();
          if (body?.error) detail += ` — ${body.error}`;
        } catch {}
        failures.push(detail);
      }
      if (!committeesResponse.ok) {
        let detail = `committees API (HTTP ${committeesResponse.status})`;
        try {
          const body = await committeesResponse.clone().json();
          if (body?.error) detail += ` — ${body.error}`;
          if (body?.name) detail += ` [${body.name}]`;
        } catch {}
        failures.push(detail);
      }
      if (!membersResponse.ok) {
        let detail = `members API (HTTP ${membersResponse.status})`;
        try {
          const body = await membersResponse.clone().json();
          if (body?.error) detail += ` — ${body.error}`;
        } catch {}
        failures.push(detail);
      }
      if (failures.length > 0) {
        setError(`Failed to load: ${failures.join(", ")}`);
      }
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }, [associationId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    setCommitteePreset(new URLSearchParams(window.location.search).get("committee") || "");
  }, []);

  useEffect(() => {
    if (!loading && committeePreset === "women" && !openedPresetDialog) {
      setCommitteeType("women");
      setCommitteeName("महिला समिति");
      setCommitteeNameEn("Women's Committee");
      setOpenAddDialog(true);
      setOpenedPresetDialog(true);
    }
  }, [committeePreset, loading, openedPresetDialog]);

  const committeeMemberList = (committee) => committee.members || [];

  const openAssignMembers = (committee) => {
    setMemberDialogCommittee(committee);
    setSelectedMemberIds((committee.members || []).map((member) => member._id));
    setMemberSearch("");
    setOpenMemberDialog(true);
  };

  const toggleMember = (memberId) => {
    setSelectedMemberIds((current) =>
      current.includes(memberId)
        ? current.filter((id) => id !== memberId)
        : [...current, memberId]
    );
  };

  const filteredMembersForDialog = () => {
    const query = memberSearch.trim().toLowerCase();
    if (!query) return members;
    return members.filter((member) =>
      `${member.name} ${member.email}`.toLowerCase().includes(query)
    );
  };

  const handleSaveMembers = async () => {
    if (!memberDialogCommittee) return;
    setSaving(true);
    setError("");
    try {
      const response = await fetch(
        `/api/admin/associations/${associationId}/committees/${memberDialogCommittee._id}/members`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ memberIds: selectedMemberIds }),
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to update members");
      setCommittees((current) =>
        current.map((committee) => (committee._id === data.data._id ? data.data : committee))
      );
      setOpenMemberDialog(false);
      setMemberDialogCommittee(null);
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveMember = async (committee, memberId) => {
    if (!window.confirm("Remove this member from the committee?")) return;
    setSaving(true);
    setError("");
    try {
      const response = await fetch(
        `/api/admin/associations/${associationId}/committees/${committee._id}/members`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ memberId }),
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to remove member");
      setCommittees((current) =>
        current.map((item) => (item._id === data.data._id ? data.data : item))
      );
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  };

  const applyPreset = (event) => {
    const preset = presetCommittees.find((item) => item.type === event.target.value);
    setCommitteeType(event.target.value);
    setCommitteeName(preset?.name || "");
    setCommitteeNameEn(preset?.nameEn || "");
  };

  const openAdd = () => {
    setCommitteeType("");
    setCommitteeName("");
    setCommitteeNameEn("");
    setProvinceName("");
    setProvinceNameEn("");
    setDistrictName("");
    setDistrictNameEn("");
    setOpenAddDialog(true);
  };

  const handleAddCommittee = async () => {
    const name = committeeName.trim();
    if (!name) {
      setError("Committee name is required");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/associations/${associationId}/committees`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name,
          nameEn: committeeNameEn.trim(),
          type: committeeType,
          provinceName: provinceName.trim(),
          provinceNameEn: provinceNameEn.trim(),
          districtName: districtName.trim(),
          districtNameEn: districtNameEn.trim(),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to add committee");
      setCommittees((current) => [...current, data.data]);
      if (isWomenCommittee(data.data)) setExpandedCommittee(data.data);
      setOpenAddDialog(false);
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  };

  const openEdit = (committee) => {
    setEditingCommittee(committee);
    setCommitteeType(committee.type || "");
    setCommitteeName(committee.name);
    setCommitteeNameEn(committee.nameEn || "");
    setProvinceName(committee.provinceName || "");
    setProvinceNameEn(committee.provinceNameEn || "");
    setDistrictName(committee.districtName || "");
    setDistrictNameEn(committee.districtNameEn || "");
    setOpenEditDialog(true);
  };

  const handleRenameCommittee = async () => {
    const name = committeeName.trim();
    if (!name) {
      setError("Committee name is required");
      return;
    }
    if (!editingCommittee) return;
    setSaving(true);
    setError("");
    try {
      const response = await fetch(
        `/api/admin/associations/${associationId}/committees/${editingCommittee._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            name,
            nameEn: committeeNameEn.trim(),
            type: committeeType,
            provinceName: provinceName.trim(),
            provinceNameEn: provinceNameEn.trim(),
            districtName: districtName.trim(),
            districtNameEn: districtNameEn.trim(),
          }),
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to update committee");
      const updated = { 
        ...editingCommittee, 
        name, 
        nameEn: committeeNameEn.trim(), 
        type: committeeType,
        provinceName: provinceName.trim(),
        provinceNameEn: provinceNameEn.trim(),
        districtName: districtName.trim(),
        districtNameEn: districtNameEn.trim(),
      };
      setCommittees((current) =>
        current.map((item) => (item._id === updated._id ? updated : item))
      );
      setOpenEditDialog(false);
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCommittee = async (committee) => {
    if (!committee) return;
    if (!window.confirm(`Delete "${committee.name}"?`)) return;
    setSaving(true);
    setError("");
    try {
      const response = await fetch(
        `/api/admin/associations/${associationId}/committees/${committee._id}`,
        { method: "DELETE", credentials: "include" }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to delete committee");
      setCommittees((current) => current.filter((item) => item._id !== committee._id));
      setExpandedCommittee(null);
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f4f7fb" }}>
        <Sidebar />
        <Box component="main" sx={{ flexGrow: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  if (!association) {
    return (
      <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f4f7fb" }}>
        <Sidebar />
        <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 4 } }}>
          <Button startIcon={<ArrowBackIcon />} onClick={() => router.push("/dashboard/admin/organization")}>
            Back
          </Button>
          <Alert severity="error" sx={{ mt: 2 }}>{error || "Association not found"}</Alert>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f4f7fb" }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 4 } }}>
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "center" }} gap={2} sx={{ mb: 3 }}>
          <Box>
            <Button startIcon={<ArrowBackIcon />} onClick={() => router.push("/dashboard/admin/organization")} sx={{ mb: 1, px: 0 }}>
              Back to Professional Associations
            </Button>
            <Stack direction="row" spacing={1} alignItems="center">
              <AccountTreeIcon color="primary" />
              <Typography variant="h4" fontWeight={700} color="red">{association.name}</Typography>
            </Stack>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              Add central, provincial, district coordination, and women's committees, then assign members.
            </Typography>
          </Box>
          <Button variant="contained" startIcon={<AddIcon />} onClick={openAdd} disabled={saving}>
            Add Committee
          </Button>
        </Stack>

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
            action={
              <Button color="inherit" size="small" onClick={loadData} disabled={loading}>
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        {committees.length === 0 ? (
          <Card sx={{ mb: 3, borderTop: "4px solid #1769aa" }}>
            <CardContent>
              <Typography color="text.secondary">
                No committees yet. Add Central, Provincial, District Coordination, Women's, Institutional, or a custom committee.
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" }, gap: 2 }}>
            {committees.map((committee) => {
              const memberList = committeeMemberList(committee);
              const expanded = expandedCommittee?._id === committee._id;
              return (
                <Card key={committee._id} sx={{ border: expanded ? "2px solid #1769aa" : "1px solid #e5e7eb" }}>
                  <CardContent>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" fontWeight={700}>{committee.name}</Typography>
                        {committee.nameEn ? (
                          <Typography variant="body2" color="text.secondary">{committee.nameEn}</Typography>
                        ) : null}
                        {committee.provinceName && (
                          <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>
                            📍 {committee.provinceName}{committee.provinceNameEn ? ` (${committee.provinceNameEn})` : ""}
                          </Typography>
                        )}
                        {committee.districtName && (
                          <Typography variant="caption" display="block" color="text.secondary">
                            📍 {committee.districtName}{committee.districtNameEn ? ` (${committee.districtNameEn})` : ""}
                          </Typography>
                        )}
                      </Box>
                      <Stack direction="row" spacing={0.5}>
                        <Tooltip title="Edit Committee">
                          <IconButton size="small" onClick={() => openEdit(committee)} disabled={saving}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton size="small" color="error" onClick={() => handleDeleteCommittee(committee)} disabled={saving}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </Stack>
                    <Stack direction="row" spacing={0.5} alignItems="center" color="primary.main" sx={{ mt: 1.5 }}>
                      <GroupsIcon fontSize="small" />
                      <Typography fontWeight={700}>{memberList.length}</Typography>
                      <Button size="small" startIcon={<PersonAddIcon />} onClick={() => openAssignMembers(committee)} disabled={saving} sx={{ ml: "auto" }}>
                        Add Members
                      </Button>
                      <Button size="small" onClick={() => setExpandedCommittee(expanded ? null : committee)}>
                        {expanded ? "Hide members" : "View members"}
                      </Button>
                    </Stack>
                    {expanded && (
                      <Box sx={{ mt: 1.5 }}>
                        <Divider sx={{ mb: 1 }} />
                        {memberList.length === 0 ? (
                          <Typography color="text.secondary" variant="body2">No members assigned</Typography>
                        ) : memberList.map((member) => (
                          <Stack key={member._id} direction="row" spacing={1.5} alignItems="center" sx={{ py: 1, borderTop: "1px solid #e5e7eb" }}>
                            <Avatar src={member.image} sx={{ width: 28, height: 28 }}>{member.name?.[0]}</Avatar>
                            <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                              <Typography variant="body2" fontWeight={600}>{member.name}</Typography>
                              <Typography variant="caption" color="text.secondary">{member.email}</Typography>
                            </Box>
                            <IconButton size="small" color="error" onClick={() => handleRemoveMember(committee, member._id)} disabled={saving}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Stack>
                        ))}
                      </Box>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </Box>
        )}

        {/* Add Committee Dialog */}
        <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Add Committee</DialogTitle>
          <DialogContent>
            <FormControl fullWidth size="small" sx={{ mt: 1 }}>
              <InputLabel>Preset</InputLabel>
              <Select label="Preset" value={committeeType} onChange={applyPreset}>
                <MenuItem value="">Custom…</MenuItem>
                {presetCommittees.map((preset) => (
                  <MenuItem key={preset.type} value={preset.type}>{preset.nameEn}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField fullWidth label="Committee name" value={committeeName} onChange={(event) => setCommitteeName(event.target.value)} sx={{ mt: 2 }} disabled={saving} />
            <TextField fullWidth label="English name (optional)" value={committeeNameEn} onChange={(event) => setCommitteeNameEn(event.target.value)} sx={{ mt: 2 }} disabled={saving} />
            
            {(committeeType === "provincial" || committeeType === "district" || !committeeType) && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 700 }}>
                  Location Information (Optional)
                </Typography>
                <TextField fullWidth label="Province name (Nepali)" value={provinceName} onChange={(event) => setProvinceName(event.target.value)} sx={{ mt: 1.5 }} disabled={saving} />
                <TextField fullWidth label="Province name (English)" value={provinceNameEn} onChange={(event) => setProvinceNameEn(event.target.value)} sx={{ mt: 1.5 }} disabled={saving} />
                <TextField fullWidth label="District name (Nepali)" value={districtName} onChange={(event) => setDistrictName(event.target.value)} sx={{ mt: 1.5 }} disabled={saving} />
                <TextField fullWidth label="District name (English)" value={districtNameEn} onChange={(event) => setDistrictNameEn(event.target.value)} sx={{ mt: 1.5 }} disabled={saving} />
              </>
            )}
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button onClick={() => setOpenAddDialog(false)} disabled={saving}>Cancel</Button>
            <Button variant="contained" onClick={handleAddCommittee} disabled={saving || !committeeName.trim()}>
              {saving ? "Adding..." : "Add"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Rename Committee Dialog */}
        <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Edit Committee Structure & Details</DialogTitle>
          <DialogContent>
            <FormControl fullWidth size="small" sx={{ mt: 1 }}>
              <InputLabel>Committee Type</InputLabel>
              <Select label="Committee Type" value={committeeType} onChange={applyPreset}>
                <MenuItem value="">Custom…</MenuItem>
                {presetCommittees.map((preset) => (
                  <MenuItem key={preset.type} value={preset.type}>{preset.nameEn}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField fullWidth label="Committee name" value={committeeName} onChange={(event) => setCommitteeName(event.target.value)} sx={{ mt: 2 }} disabled={saving} />
            <TextField fullWidth label="English name (optional)" value={committeeNameEn} onChange={(event) => setCommitteeNameEn(event.target.value)} sx={{ mt: 2 }} disabled={saving} />
            
            {editingCommittee && editingCommittee.members && editingCommittee.members.length > 0 && (
              <Alert severity="info" sx={{ mt: 2 }}>
                ⚠️ This committee has {editingCommittee.members.length} member{editingCommittee.members.length !== 1 ? 's' : ''}. You can still change the structure and names.
              </Alert>
            )}

            {(committeeType === "provincial" || committeeType === "district" || !committeeType) && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 700 }}>
                  Location Information (Optional)
                </Typography>
                <TextField fullWidth label="Province name (Nepali)" value={provinceName} onChange={(event) => setProvinceName(event.target.value)} sx={{ mt: 1.5 }} disabled={saving} />
                <TextField fullWidth label="Province name (English)" value={provinceNameEn} onChange={(event) => setProvinceNameEn(event.target.value)} sx={{ mt: 1.5 }} disabled={saving} />
                <TextField fullWidth label="District name (Nepali)" value={districtName} onChange={(event) => setDistrictName(event.target.value)} sx={{ mt: 1.5 }} disabled={saving} />
                <TextField fullWidth label="District name (English)" value={districtNameEn} onChange={(event) => setDistrictNameEn(event.target.value)} sx={{ mt: 1.5 }} disabled={saving} />
              </>
            )}
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button onClick={() => setOpenEditDialog(false)} disabled={saving}>Cancel</Button>
            <Button variant="contained" onClick={handleRenameCommittee} disabled={saving || !committeeName.trim()}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogActions>
        </Dialog>
      {/* Add Members Dialog */}
        <Dialog open={openMemberDialog} onClose={() => setOpenMemberDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Add Members to {memberDialogCommittee?.name || "Committee"}</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              size="small"
              label="Search members"
              value={memberSearch}
              onChange={(event) => setMemberSearch(event.target.value)}
              sx={{ mb: 2 }}
            />
            {filteredMembersForDialog().length === 0 ? (
              <Typography color="text.secondary">No members found.</Typography>
            ) : (
              filteredMembersForDialog().map((member) => {
                const checked = selectedMemberIds.includes(member._id);
                return (
                  <Stack
                    key={member._id}
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                    sx={{ py: 0.75, cursor: "pointer", borderRadius: 1, "&:hover": { bgcolor: "action.hover" } }}
                    onClick={() => toggleMember(member._id)}
                  >
                    <Checkbox checked={checked} />
                    <Avatar src={member.image} sx={{ width: 28, height: 28 }}>{member.name?.[0]}</Avatar>
                    <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                      <Typography variant="body2" fontWeight={checked ? 600 : 400}>{member.name}</Typography>
                      <Typography variant="caption" color="text.secondary">{member.email}</Typography>
                    </Box>
                    {member.professionalAssociation ? (
                      <Typography variant="caption" color="primary">{member.professionalAssociation}</Typography>
                    ) : null}
                  </Stack>
                );
              })
            )}
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button onClick={() => setOpenMemberDialog(false)} disabled={saving}>Cancel</Button>
            <Button variant="contained" onClick={handleSaveMembers} disabled={saving}>
              {saving ? "Saving..." : `Save (${selectedMemberIds.length})`}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}