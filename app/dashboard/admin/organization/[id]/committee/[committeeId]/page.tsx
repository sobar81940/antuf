"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "@/components/sidebar/SideBar";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import GroupsIcon from "@mui/icons-material/Groups";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import DeleteIcon from "@mui/icons-material/Delete";

const memberPositions = ["अध्यक्ष", "उपाध्यक्ष", "सचिव", "कोषाध्यक्ष", "सदस्य"];
const provinceOptions = [
  "कोशी प्रदेश",
  "मधेश प्रदेश",
  "बागमती प्रदेश",
  "गण्डकी प्रदेश",
  "लुम्बिनी प्रदेश",
  "कर्णाली प्रदेश",
  "सुदूरपश्चिम प्रदेश",
];

const committeeLocation = (committee) => {
  if (committee?.type === "district") return committee.districtName || committee.districtNameEn || "";
  if (committee?.type === "provincial") return committee.provinceName || committee.provinceNameEn || "";
  return "";
};

export default function CommitteeWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const associationId = params?.id as string;
  const committeeId = params?.committeeId as string;
  const [committee, setCommittee] = useState<any>(null);
  const [provincialCommittees, setProvincialCommittees] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [memberId, setMemberId] = useState("");
  const [position, setPosition] = useState("");
  const [search, setSearch] = useState("");
  const [customMember, setCustomMember] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    location: "",
    image: "",
  });
  const [uploadingImage, setUploadingImage] = useState(false);

  const loadData = useCallback(async () => {
    if (!associationId || !committeeId) return;
    setLoading(true);
    setError("");
    try {
      const [committeesResponse, membersResponse] = await Promise.all([
        fetch(`/api/admin/associations/${associationId}/committees`, { credentials: "include" }),
        fetch("/api/members", { credentials: "include" }),
      ]);
      const committeesData = committeesResponse.ok ? await committeesResponse.json() : null;
      const membersData = membersResponse.ok ? await membersResponse.json() : null;
      const foundCommittee = committeesData?.data?.find((item) => item._id === committeeId);
      if (!foundCommittee) throw new Error("Committee not found");
      setCommittee(foundCommittee);
      setProvincialCommittees((committeesData?.data ?? []).filter((item) => item.type === "provincial"));
      setMembers(membersData ?? []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load this committee");
    } finally {
      setLoading(false);
    }
  }, [associationId, committeeId]);

  useEffect(() => { loadData(); }, [loadData]);

  const availableMembers = useMemo(() => {
    const query = search.trim().toLowerCase();
    return members.filter((member) => {
      const isAssigned = (committee?.members || []).some((assigned) => assigned._id === member._id);
      return !isAssigned && (!query || `${member.name} ${member.email}`.toLowerCase().includes(query));
    });
  }, [committee, members, search]);

  const handleCustomImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "antuf/committee-members");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await response.json();
      if (!response.ok || !data?.url) {
        throw new Error(data?.error || "Failed to upload image");
      }

      setCustomMember((current) => ({ ...current, image: data.url }));
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Failed to upload image");
    } finally {
      setUploadingImage(false);
      event.target.value = "";
    }
  };

  const addMember = async () => {
    if (!committee) return;

    const hasExistingMember = Boolean(memberId && position);
    const hasCustomMember = Boolean(customMember.name.trim() && customMember.email.trim());
    if (!hasExistingMember && !hasCustomMember) {
      setError("Please select an existing member or fill out the custom member form.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const existingIds = new Set((committee.members || []).map((member) => member._id));
      const memberDetails = [...(committee.memberDetails || []).map((detail) => ({
        member: detail.member?._id || detail.member,
        position: detail.position,
      }))];

      if (hasExistingMember) {
        existingIds.add(memberId);
        memberDetails.push({ member: memberId, position });
      }

      const payload: any = {
        memberIds: [...existingIds],
        memberDetails,
      };

      if (hasCustomMember) {
        payload.customMember = {
          name: customMember.name.trim(),
          email: customMember.email.trim(),
          phone: customMember.phone.trim(),
          image: customMember.image || "",
          organization: committee?.association || "",
          committeeLevel: committee?.type || "",
          committeeName: committee?.name || "",
          committeeLocation: committeeLocation(committee),
          position: customMember.position.trim() || "सदस्य",
        };
      }

      const response = await fetch(`/api/admin/associations/${associationId}/committees/${committeeId}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to add member");
      setCommittee(data.data);
      setAddOpen(false);
      setMemberId("");
      setPosition("");
      setSearch("");
      setCustomMember({ name: "", email: "", phone: "", position: "", location: "", image: "" });
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to add member");
    } finally {
      setSaving(false);
    }
  };

  const removeMember = async (id: string) => {
    if (!committee || !window.confirm("Remove this member from the committee?")) return;
    setSaving(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/associations/${associationId}/committees/${committeeId}/members`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ memberId: id }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to remove member");
      setCommittee(data.data);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to remove member");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f4f7fb" }}><Sidebar /><Box sx={{ flex: 1, display: "grid", placeItems: "center" }}><CircularProgress /></Box></Box>;

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f4f7fb" }}>
      <Sidebar />
      <Box component="main" sx={{ flex: 1, minWidth: 0, p: { xs: 2, md: 4 } }}>
        <Box sx={{ maxWidth: 1050, mx: "auto" }}>
          <Button startIcon={<ArrowBackIcon />} onClick={() => router.push(`/dashboard/admin/organization/${associationId}`)} sx={{ mb: 2, px: 0, color: "text.secondary" }}>Back to organization</Button>
          {error && <Alert severity="error" sx={{ mb: 2 }} action={<Button color="inherit" size="small" onClick={loadData}>Retry</Button>}>{error}</Alert>}
          {committee && <>
            <Card sx={{ mb: 3, border: "1px solid #dce8ef", boxShadow: "0 8px 24px rgba(23,59,77,.08)", overflow: "hidden" }}>
              <CardContent sx={{ p: { xs: 2.5, md: 3.5 }, background: "linear-gradient(120deg, #173b4d, #087f73)", color: "white" }}>
                <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "center" }} gap={2}>
                  <Box>
                    <Typography variant="overline" sx={{ color: "#8ce3d5", fontWeight: 800, letterSpacing: ".12em" }}>Committee workspace</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800 }}>{committee.name}</Typography>
                    {committee.nameEn && <Typography sx={{ color: "rgba(255,255,255,.72)" }}>{committee.nameEn}</Typography>}
                    {committeeLocation(committee) && <Typography sx={{ mt: 1, color: "#d5f6ef" }}>📍 {committee.type === "district" ? "जिल्ला" : "प्रदेश"}: {committeeLocation(committee)}</Typography>}
                  </Box>
                  <Button variant="contained" startIcon={<PersonAddIcon />} onClick={() => setAddOpen(true)} disabled={saving} sx={{ bgcolor: "#8ce3d5", color: "#173b4d", fontWeight: 800, "&:hover": { bgcolor: "#b3f0e5" } }}>सदस्य थप्नुहोस्</Button>
                </Stack>
              </CardContent>
            </Card>
            <Card sx={{ border: "1px solid #e2e9ed", boxShadow: "none" }}>
              <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2.5 }}><GroupsIcon sx={{ color: "#087f73" }} /><Typography variant="h6" fontWeight={800}>Committee members ({committee.members?.length || 0})</Typography></Stack>
                {(committee.members?.length || 0) === 0 ? <Box sx={{ py: 6, textAlign: "center", color: "text.secondary" }}><GroupsIcon sx={{ fontSize: 44, mb: 1, opacity: .45 }} /><Typography>यो समितिमा अझै सदस्य थपिएको छैन।</Typography></Box> : <Stack spacing={1.25}>
                  {committee.members.map((member) => {
                    const detail = (committee.memberDetails || []).find((item) => (item.member?._id || item.member) === member._id);
                    return <Stack key={member._id} direction="row" alignItems="center" spacing={1.5} sx={{ p: 1.25, border: "1px solid #e8edef", borderRadius: 2 }}>
                      <Avatar src={member.image}>{member.name?.[0]}</Avatar><Box sx={{ flex: 1, minWidth: 0 }}><Typography fontWeight={700}>{member.name}</Typography><Typography variant="body2" color="text.secondary" noWrap>{member.email}</Typography></Box>
                      <Typography variant="body2" sx={{ color: "#087f73", fontWeight: 700 }}>{detail?.position || "सदस्य"}</Typography>
                      <Button color="error" size="small" startIcon={<DeleteIcon />} onClick={() => removeMember(member._id)} disabled={saving}>हटाउनुहोस्</Button>
                    </Stack>;
                  })}
                </Stack>}
              </CardContent>
            </Card>
            {committee.type === "provincial" && (
              <Card sx={{ mt: 2, border: "1px solid #e2e9ed", boxShadow: "none" }}>
                <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
                  <Typography variant="h6" fontWeight={800} sx={{ color: "#173b4d" }}>प्रदेश समिति</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1.75 }}>प्रदेश समिति बीचमा सिधै जानुहोस्।</Typography>
                  <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" }, gap: 1 }}>
                    {provinceOptions.map((province) => {
                      const provincialCommittee = provincialCommittees.find((item) => (item.provinceName || item.provinceNameEn) === province);
                      const isCurrent = provincialCommittee?._id === committee._id;
                      return (
                        <Button
                          key={province}
                          size="small"
                          variant={isCurrent ? "contained" : "outlined"}
                          disabled={!provincialCommittee || isCurrent}
                          onClick={() => router.push(`/dashboard/admin/organization/${associationId}/committee/${provincialCommittee._id}`)}
                          sx={{ justifyContent: "flex-start", textTransform: "none", fontWeight: 700, ...(isCurrent ? { bgcolor: "#087f73", "&:hover": { bgcolor: "#087f73" } } : {}) }}
                        >
                          {province} समिति{!provincialCommittee ? " (बनाइएको छैन)" : ""}
                        </Button>
                      );
                    })}
                  </Box>
                </CardContent>
              </Card>
            )}
          </>}
        </Box>
      </Box>
      <Dialog open={addOpen} onClose={() => setAddOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {committee?.name} मा सदस्य थप्नुहोस्
          {committee?.type === "provincial" && committeeLocation(committee) && (
            <Typography component="span" display="block" variant="body2" color="text.secondary" sx={{ mt: .5 }}>
              प्रदेश: {committeeLocation(committee)}
            </Typography>
          )}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 1 }}>Assign existing user</Typography>
            <TextField fullWidth size="small" label="सदस्य खोज्नुहोस्" value={search} onChange={(event) => setSearch(event.target.value)} sx={{ mb: 2 }} />
            <FormControl fullWidth size="small"><InputLabel>सदस्य</InputLabel><Select label="सदस्य" value={memberId} onChange={(event) => setMemberId(event.target.value)}>{availableMembers.map((member) => <MenuItem key={member._id} value={member._id}>{member.name} ({member.email})</MenuItem>)}</Select></FormControl>
            <FormControl fullWidth size="small" sx={{ mt: 2 }}><InputLabel>पद</InputLabel><Select label="पद" value={position} onChange={(event) => setPosition(event.target.value)}>{memberPositions.map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}</Select></FormControl>
          </Box>

          <Box sx={{ borderTop: "1px solid #e2e9ed", pt: 2.5 }}>
            <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 1.5 }}>Add custom member</Typography>
            <Stack spacing={2} alignItems="center">
              <Box sx={{ textAlign: "center" }}>
                <Avatar src={customMember.image || ""} sx={{ width: 72, height: 72, mb: 1, mx: "auto", bgcolor: "#dfeaf2" }}>
                  {customMember.name?.[0]?.toUpperCase() || "U"}
                </Avatar>
                <Button variant="outlined" component="label" size="small" disabled={uploadingImage}>
                  {uploadingImage ? "Uploading..." : "Upload Image"}
                  <input hidden accept="image/*" type="file" onChange={handleCustomImageUpload} />
                </Button>
              </Box>
              <TextField
                fullWidth
                size="small"
                label="Name"
                value={customMember.name}
                onChange={(event) => setCustomMember((current) => ({ ...current, name: event.target.value }))}
              />
              <TextField
                fullWidth
                size="small"
                label="Email"
                type="email"
                value={customMember.email}
                onChange={(event) => setCustomMember((current) => ({ ...current, email: event.target.value }))}
              />
              <TextField
                fullWidth
                size="small"
                label="Phone"
                value={customMember.phone}
                onChange={(event) => setCustomMember((current) => ({ ...current, phone: event.target.value }))}
              />
              <TextField
                fullWidth
                size="small"
                label="Location"
                value={customMember.location}
                onChange={(event) => setCustomMember((current) => ({ ...current, location: event.target.value }))}
              />
              <FormControl fullWidth size="small">
                <InputLabel>Custom member position</InputLabel>
                <Select
                  label="Custom member position"
                  value={customMember.position}
                  onChange={(event) => setCustomMember((current) => ({ ...current, position: event.target.value }))}
                >
                  {memberPositions.map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}
                </Select>
              </FormControl>
            </Stack>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}><Button onClick={() => setAddOpen(false)} disabled={saving}>Cancel</Button><Button variant="contained" onClick={addMember} disabled={saving}>{saving ? "Adding..." : "Add member"}</Button></DialogActions>
      </Dialog>
    </Box>
  );
}
