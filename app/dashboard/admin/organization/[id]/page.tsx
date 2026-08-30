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
  Chip,
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
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import PeopleIcon from "@mui/icons-material/People";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const presetCommittees = [
  { type: "women", name: "महिला समिति", nameEn: "Women's Committee" },
  { type: "central", name: "केन्द्रीय समिति", nameEn: "Central Committee" },
  { type: "provincial", name: "प्रदेश समिति", nameEn: "Provincial Committee" },
  { type: "district", name: "जिल्ला समन्वय समिति", nameEn: "District Coordination Committee" },
  { type: "institutional", name: "संस्थागत समिति", nameEn: "Institutional Committee" },
];

const provinceOptions = [
  "कोशी प्रदेश",
  "मधेश प्रदेश",
  "बागमती प्रदेश",
  "गण्डकी प्रदेश",
  "लुम्बिनी प्रदेश",
  "कर्णाली प्रदेश",
  "सुदूरपश्चिम प्रदेश",
];

const provinceEnglishNames = {
  "कोशी प्रदेश": "Koshi Province",
  "मधेश प्रदेश": "Madhesh Province",
  "बागमती प्रदेश": "Bagmati Province",
  "गण्डकी प्रदेश": "Gandaki Province",
  "लुम्बिनी प्रदेश": "Lumbini Province",
  "कर्णाली प्रदेश": "Karnali Province",
  "सुदूरपश्चिम प्रदेश": "Sudurpashchim Province",
};

const districtsByProvince = {
  "कोशी प्रदेश": [
    ["भोजपुर", "Bhojpur"], ["धनकुटा", "Dhankuta"], ["इलाम", "Ilam"], ["झापा", "Jhapa"],
    ["खोटाङ", "Khotang"], ["मोरङ", "Morang"], ["ओखलढुङ्गा", "Okhaldhunga"], ["पाँचथर", "Panchthar"],
    ["सङ्खुवासभा", "Sankhuwasabha"], ["सोलुखुम्बु", "Solukhumbu"], ["सुनसरी", "Sunsari"], ["ताप्लेजुङ", "Taplejung"],
    ["तेह्रथुम", "Terhathum"], ["उदयपुर", "Udayapur"],
  ],
  "मधेश प्रदेश": [
    ["बारा", "Bara"], ["धनुषा", "Dhanusha"], ["महोत्तरी", "Mahottari"], ["पर्सा", "Parsa"],
    ["रौतहट", "Rautahat"], ["सप्तरी", "Saptari"], ["सर्लाही", "Sarlahi"], ["सिराहा", "Siraha"],
  ],
  "बागमती प्रदेश": [
    ["भक्तपुर", "Bhaktapur"], ["चितवन", "Chitwan"], ["धादिङ", "Dhading"], ["दोलखा", "Dolakha"],
    ["काठमाडौं", "Kathmandu"], ["काभ्रेपलाञ्चोक", "Kavrepalanchok"], ["ललितपुर", "Lalitpur"], ["मकवानपुर", "Makwanpur"],
    ["नुवाकोट", "Nuwakot"], ["रामेछाप", "Ramechhap"], ["रसुवा", "Rasuwa"], ["सिन्धुली", "Sindhuli"], ["सिन्धुपाल्चोक", "Sindhupalchok"],
  ],
  "गण्डकी प्रदेश": [
    ["बागलुङ", "Baglung"], ["गोरखा", "Gorkha"], ["कास्की", "Kaski"], ["लमजुङ", "Lamjung"],
    ["मनाङ", "Manang"], ["मुस्ताङ", "Mustang"], ["म्याग्दी", "Myagdi"], ["नवलपुर", "Nawalpur"],
    ["पर्वत", "Parbat"], ["स्याङ्जा", "Syangja"], ["तनहुँ", "Tanahun"],
  ],
  "लुम्बिनी प्रदेश": [
    ["अर्घाखाँची", "Arghakhanchi"], ["बाँके", "Banke"], ["बर्दिया", "Bardiya"], ["दाङ", "Dang"],
    ["गुल्मी", "Gulmi"], ["कपिलवस्तु", "Kapilvastu"], ["नवलपरासी (बर्दघाट सुस्ता पश्चिम)", "Nawalparasi West"], ["पाल्पा", "Palpa"],
    ["प्युठान", "Pyuthan"], ["रोल्पा", "Rolpa"], ["रुकुम (पूर्वी भाग)", "Rukum East"], ["रुपन्देही", "Rupandehi"],
  ],
  "कर्णाली प्रदेश": [
    ["दैलेख", "Dailekh"], ["डोल्पा", "Dolpa"], ["हुम्ला", "Humla"], ["जाजरकोट", "Jajarkot"],
    ["जुम्ला", "Jumla"], ["कालिकोट", "Kalikot"], ["मुगु", "Mugu"], ["रुकुम (पश्चिम भाग)", "Rukum West"],
    ["सल्यान", "Salyan"], ["सुर्खेत", "Surkhet"],
  ],
  "सुदूरपश्चिम प्रदेश": [
    ["अछाम", "Achham"], ["बैतडी", "Baitadi"], ["बझाङ", "Bajhang"], ["बाजुरा", "Bajura"],
    ["डडेलधुरा", "Dadeldhura"], ["दार्चुला", "Darchula"], ["डोटी", "Doti"], ["कैलाली", "Kailali"], ["कञ्चनपुर", "Kanchanpur"],
  ],
};

const memberPositions = ["अध्यक्ष", "उपाध्यक्ष", "सचिव", "कोषाध्यक्ष", "सदस्य"];

const committeeIcons = {
  central: "🏛️",
  provincial: "🌍",
  district: "📍",
  institutional: "🏢",
  women: "👩",
};

const getCommitteeLocation = (committee) => {
  if (committee?.type === "district") {
    return committee.districtName || committee.districtNameEn || "";
  }
  if (committee?.type === "provincial") {
    return committee.provinceName || committee.provinceNameEn || "";
  }
  return "";
};

export default function AssociationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const associationId = params?.id;

  const [association, setAssociation] = useState(null);
  const [committees, setCommittees] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [filterProvince, setFilterProvince] = useState("all");
  const [filterCommitteeType, setFilterCommitteeType] = useState("all");

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

  // Expanded committee
  const [expandedCommittee, setExpandedCommittee] = useState(null);

  // Member assignment dialog
  const [openMemberDialog, setOpenMemberDialog] = useState(false);
  const [memberDialogCommittee, setMemberDialogCommittee] = useState(null);
  const [selectedMemberIds, setSelectedMemberIds] = useState([]);
  const [memberSearch, setMemberSearch] = useState("");
  const [memberProvince, setMemberProvince] = useState("");
  const [memberCommitteeId, setMemberCommitteeId] = useState("");
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [memberPosition, setMemberPosition] = useState("");

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
      setMembers(memberData ?? []);

      // Preserve old ID links, but immediately replace them with the canonical
      // readable association-slug URL.
      const canonicalSlug = associationData?.data?.slug;
      if (canonicalSlug && canonicalSlug !== associationId) {
        router.replace(`/dashboard/admin/organization/${canonicalSlug}`);
      }

      const failures = [];
      if (!associationResponse.ok) failures.push(`association (HTTP ${associationResponse.status})`);
      if (!committeesResponse.ok) failures.push(`committees (HTTP ${committeesResponse.status})`);
      if (!membersResponse.ok) failures.push(`members (HTTP ${membersResponse.status})`);
      if (failures.length > 0) setError(`Failed to load: ${failures.join(", ")}`);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }, [associationId, router]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Get unique provinces
  const uniqueProvinces = Array.from(
    new Set(
      committees
        .filter((c) => c.provinceName || c.provinceNameEn)
        .map((c) => c.provinceName || c.provinceNameEn)
    )
  ).sort();

  // Filter committees
  const filteredCommittees = committees.filter((c) => {
    if (filterCommitteeType !== "all" && c.type !== filterCommitteeType) return false;
    if (filterProvince !== "all" && (c.provinceName || c.provinceNameEn) !== filterProvince) return false;
    return true;
  });

  // Group committees by province
  const committeesByProvince = filteredCommittees.reduce((acc: Record<string, any[]>, committee) => {
    const province = committee.type === "provincial"
      ? "__provincial_committees__"
      : committee.provinceName || committee.provinceNameEn || "Other";
    if (!acc[province]) acc[province] = [];
    acc[province].push(committee);
    return acc;
  }, {});

  // Stats
  const stats = [
    { type: "central", label: "केन्द्रीय समिति", labelEn: "Central Committee", icon: "🏛️" },
    { type: "provincial", label: "प्रदेश समिति", labelEn: "Provincial Committee", icon: "🌍" },
    { type: "district", label: "जिल्ला समिति", labelEn: "District Coordination Committee", icon: "📍" },
    { type: "institutional", label: "प्रतिष्ठान समिति", labelEn: "Institutional Committee", icon: "🏢" },
  ];

  const handleProvinceChange = (value) => {
    setProvinceName(value);
    setProvinceNameEn(provinceEnglishNames[value] || "");
    setDistrictName("");
    setDistrictNameEn("");
    if (committeeType === "provincial") {
      setCommitteeName(value ? `${value} समिति` : "प्रदेश समिति");
      setCommitteeNameEn(value ? `${provinceEnglishNames[value]} Committee` : "Provincial Committee");
    }
  };

  const handleDistrictChange = (value, englishName) => {
    setDistrictName(value);
    setDistrictNameEn(englishName);
    if (committeeType === "district") {
      setCommitteeName(value ? `${value} जिल्ला समन्वय समिति` : "जिल्ला समन्वय समिति");
      setCommitteeNameEn(value ? `${englishName} District Coordination Committee` : "District Coordination Committee");
    }
  };

  const handleAddCommittee = async () => {
    const name = committeeName.trim();
    if (!name) {
      setError("Committee name is required");
      return;
    }
    if (committeeType === "provincial" && !provinceName.trim()) {
      setError("Province name is required for provincial committees");
      return;
    }
    if (committeeType === "district" && !districtName.trim()) {
      setError("District name is required for district coordination committees");
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
      setOpenAddDialog(false);
      setCommitteeName("");
      setCommitteeNameEn("");
      setCommitteeType("");
      setProvinceName("");
      setProvinceNameEn("");
      setDistrictName("");
      setDistrictNameEn("");
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  };

  const handleRenameCommittee = async () => {
    const name = committeeName.trim();
    if (!name) {
      setError("Committee name is required");
      return;
    }
    if (committeeType === "provincial" && !provinceName.trim()) {
      setError("Province name is required for provincial committees");
      return;
    }
    if (committeeType === "district" && !districtName.trim()) {
      setError("District name is required for district coordination committees");
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
      setCommittees((current) =>
        current.map((item) => (item._id === editingCommittee._id ? data.data : item))
      );
      setOpenEditDialog(false);
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCommittee = async (committee) => {
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
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
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

  const openAssignMembers = (committee) => {
    setMemberDialogCommittee(committee);
    setSelectedMemberIds((committee.members || []).map((member) => member._id));
    setMemberProvince(committee.provinceName || "");
    setMemberCommitteeId(committee._id);
    setSelectedMemberId("");
    setMemberPosition("");
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

  const handleSaveMembers = async () => {
    if (!memberDialogCommittee) return;
    if (!selectedMemberId || !memberPosition) {
      setError("Please select a member and position");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const existingMemberIds = selectedMemberIds.filter((id) => id !== selectedMemberId);
      const response = await fetch(
        `/api/admin/associations/${associationId}/committees/${memberCommitteeId || memberDialogCommittee._id}/members`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            memberIds: [...existingMemberIds, selectedMemberId],
            memberDetails: [
              ...(memberDialogCommittee.memberDetails || [])
                .filter((detail) => detail.member !== selectedMemberId),
              { member: selectedMemberId, position: memberPosition },
            ],
          }),
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to update members");
      setCommittees((current) =>
        current.map((c) => (c._id === data.data._id ? data.data : c))
      );
      setMemberDialogCommittee(data.data);
      setSelectedMemberIds((data.data.members || []).map((member) => member._id));
      setSelectedMemberId("");
      setMemberPosition("");
      setOpenMemberDialog(false);
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveMember = async (committee, memberId) => {
    if (!window.confirm("Remove this member?")) return;
    setSaving(true);
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

  const filteredMembersForDialog = () => {
    const query = memberSearch.trim().toLowerCase();
    if (!query) return members;
    return members.filter((member) =>
      `${member.name} ${member.email}`.toLowerCase().includes(query)
    );
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
      <Box component="main" sx={{ flexGrow: 1, minWidth: 0, p: { xs: 2, md: 4 } }}>
        <Box sx={{ maxWidth: 1440, mx: "auto" }}>
          {/* Workspace header */}
          <Button startIcon={<ArrowBackIcon />} onClick={() => router.push("/dashboard/admin/organization")} sx={{ mb: 2, px: 0, color: "text.secondary" }}>
            Back to Professional Associations
          </Button>
          <Card sx={{ mb: 3, overflow: "hidden", border: "1px solid #dce8ef", boxShadow: "0 8px 24px rgba(23, 59, 77, .08)" }}>
            <CardContent sx={{ p: { xs: 2.5, md: 3.5 }, background: "linear-gradient(120deg, #173b4d 0%, #087f73 100%)", color: "common.white" }}>
              <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ md: "center" }} gap={2.5}>
                <Box>
                  <Stack direction="row" spacing={1.25} alignItems="center">
                    <Box sx={{ display: "grid", placeItems: "center", width: 44, height: 44, borderRadius: 2, bgcolor: "rgba(255,255,255,.16)" }}>
                      <AccountTreeIcon />
                    </Box>
                    <Box>
                      <Typography variant="overline" sx={{ fontWeight: 800, letterSpacing: ".12em", color: "#8ce3d5" }}>Organization workspace</Typography>
                      <Typography variant="h4" sx={{ fontWeight: 800, lineHeight: 1.15 }}>{association.name}</Typography>
                    </Box>
                  </Stack>
                  <Typography sx={{ mt: 2, maxWidth: 760, color: "rgba(255,255,255,.78)" }}>
                    केन्द्रीय, प्रदेश, जिल्ला, संस्थागत र महिला समितिहरूको संरचना र सदस्य व्यवस्थापन गर्नुहोस्।
                  </Typography>
                </Box>
                <Button variant="contained" startIcon={<AddIcon />} onClick={openAdd} disabled={saving} sx={{ flexShrink: 0, bgcolor: "#8ce3d5", color: "#173b4d", fontWeight: 800, px: 2, "&:hover": { bgcolor: "#b3f0e5" } }}>
                  नयाँ समिति थप्नुहोस्
                </Button>
              </Stack>
            </CardContent>
          </Card>

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 3 }}
            action={
              <Button color="inherit" size="small" onClick={loadData} disabled={loading}>
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        {/* Organization overview */}
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(4, 1fr)" }, gap: 1.5, mb: 3 }}>
          {stats.map((stat) => {
            const count = committees.filter((c) => c.type === stat.type).length;
            const memberCount = committees
              .filter((c) => c.type === stat.type)
              .reduce((sum, c) => sum + (c.members?.length || 0), 0);
            return (
              <Card key={stat.type} sx={{ border: "1px solid #e2e9ed", boxShadow: "none", transition: "transform .15s ease, box-shadow .15s ease", "&:hover": { transform: "translateY(-2px)", boxShadow: "0 8px 18px rgba(23,59,77,.1)" } }}>
                <CardContent sx={{ p: 2 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>{stat.label}</Typography>
                      <Typography variant="h4" sx={{ mt: .25, color: "#173b4d", fontWeight: 800 }}>{count}</Typography>
                      <Typography variant="caption" color="text.secondary">{memberCount} सदस्य</Typography>
                    </Box>
                    <Typography sx={{ fontSize: "1.35rem" }}>{stat.icon}</Typography>
                  </Stack>
                </CardContent>
              </Card>
            );
          })}
        </Box>

        {/* Directory controls */}
        <Card sx={{ mb: 3, border: "1px solid #e2e9ed", boxShadow: "none" }}>
          <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
            <Stack direction={{ xs: "column", lg: "row" }} justifyContent="space-between" alignItems={{ lg: "center" }} gap={2}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: "#173b4d" }}>Committee directory</Typography>
                <Typography variant="body2" color="text.secondary">{filteredCommittees.length} of {committees.length} committees shown</Typography>
              </Box>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
          <FormControl size="small" sx={{ minWidth: { sm: 220 } }}>
            <InputLabel>Filter by Committee Type</InputLabel>
            <Select value={filterCommitteeType} label="Filter by Committee Type" onChange={(e) => setFilterCommitteeType(e.target.value)}>
              <MenuItem value="all">सबै समितिहरू</MenuItem>
              {presetCommittees.map((preset) => (
                <MenuItem key={preset.type} value={preset.type}>
                  {preset.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {uniqueProvinces.length > 0 && (
            <FormControl size="small" sx={{ minWidth: { sm: 220 } }}>
              <InputLabel>Filter by Province</InputLabel>
              <Select value={filterProvince} label="Filter by Province" onChange={(e) => setFilterProvince(e.target.value)}>
                <MenuItem value="all">सबै प्रदेशहरू</MenuItem>
                {uniqueProvinces.map((province) => (
                  <MenuItem key={province} value={province}>
                    {province}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        {/* Committees */}
        {filteredCommittees.length === 0 ? (
          <Card sx={{ bgcolor: "#f9fafb", border: "1px solid #e5e7eb" }}>
            <CardContent sx={{ py: 4, textAlign: "center" }}>
              <AccountTreeIcon sx={{ fontSize: 48, color: "text.secondary", mb: 1 }} />
              <Typography color="text.secondary">
                कुनै समिति भेटिएन। नयाँ समिति थप्न सक्नुहुन्छ।
              </Typography>
            </CardContent>
          </Card>
        ) : (
          Object.entries(committeesByProvince).map(([province, provCommittees]: [string, any[]]) => (
            <Box key={province} component="section" sx={{ mb: 4 }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                {province === "Other" || province === "__provincial_committees__" ? <AccountTreeIcon sx={{ color: "#087f73" }} /> : <LocationOnIcon sx={{ color: "#087f73" }} />}
                <Typography variant="h6" fontWeight={800} sx={{ color: "#173b4d" }}>{province === "__provincial_committees__" ? "प्रदेश समिति" : province === "Other" ? "National & other committees" : province}</Typography>
                <Chip label={`${(provCommittees as any[]).length} समितिहरू`} size="small" sx={{ fontWeight: 700, bgcolor: "#edf7f5", color: "#087f73" }} />
              </Stack>
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)", xl: "repeat(3, 1fr)" }, gap: 2 }}>
                {(provCommittees as any[]).map((committee) => (
                  <Card key={committee._id} sx={{ height: "100%", border: "1px solid #e2e9ed", boxShadow: "none", "&:hover": { borderColor: "#87c9c0", boxShadow: "0 8px 20px rgba(23,59,77,.08)" } }}>
                    <CardContent sx={{ p: 2.25, height: "100%", display: "flex", flexDirection: "column" }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="h6"
                            fontWeight={800}
                            role="link"
                            tabIndex={0}
                            onClick={() => router.push(`/dashboard/admin/organization/${associationId}/committee/${committee._id}`)}
                            onKeyDown={(event) => {
                              if (event.key === "Enter" || event.key === " ") router.push(`/dashboard/admin/organization/${associationId}/committee/${committee._id}`);
                            }}
                            sx={{ color: "#173b4d", cursor: "pointer", "&:hover": { color: "#087f73", textDecoration: "underline" } }}
                          >
                            {committeeIcons[committee.type] || "📋"} {committee.name}
                          </Typography>
                          {committee.nameEn && (
                            <Typography variant="body2" color="text.secondary">
                              {committee.nameEn}
                            </Typography>
                          )}
                          {getCommitteeLocation(committee) && (
                            <Typography variant="caption" display="block" sx={{ mt: 1, color: "primary.main" }}>
                              📍 {committee.type === "district" ? "जिल्ला: " : "प्रदेश: "}{getCommitteeLocation(committee)}
                            </Typography>
                          )}
                        </Box>
                        <Stack direction="row" spacing={0.5}>
                          <Tooltip title="Edit">
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

                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          <PeopleIcon fontSize="small" sx={{ color: "#087f73" }} />
                          <Typography variant="body2" fontWeight={700}>
                            {committee.members?.length || 0}
                          </Typography>
                        </Stack>
                        <Button size="small" startIcon={<PersonAddIcon />} onClick={() => router.push(`/dashboard/admin/organization/${associationId}/committee/${committee._id}`)} disabled={saving} sx={{ ml: "auto", fontWeight: 700 }}>
                          सदस्य व्यवस्थापन
                        </Button>
                      </Stack>

                      <Divider sx={{ my: 1.5 }} />

                      {(committee.members?.length || 0) > 0 ? (
                        <Box>
                          <Typography variant="caption" fontWeight={700} sx={{ mb: 1, display: "block" }}>
                            सदस्यहरू
                          </Typography>
                          <Stack spacing={1}>
                            {committee.members?.slice(0, expandedCommittee === committee._id ? undefined : 3).map((member) => (
                              <Stack key={member._id} direction="row" spacing={1} alignItems="center">
                                <Avatar src={member.image} sx={{ width: 24, height: 24 }}>
                                  {member.name?.[0]}
                                </Avatar>
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                  <Typography variant="caption" fontWeight={600} noWrap>
                                    {member.name}
                                  </Typography>
                                </Box>
                                <IconButton
                                  size="small"
                                  onClick={() => handleRemoveMember(committee, member._id)}
                                  disabled={saving}
                                  sx={{ p: 0 }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Stack>
                            ))}
                            {(committee.members?.length || 0) > 3 && (
                              <Button size="small" onClick={() => setExpandedCommittee(expandedCommittee === committee._id ? null : committee._id)} sx={{ alignSelf: "flex-start", px: 0, pt: .5, fontWeight: 700 }}>
                                {expandedCommittee === committee._id ? "कम देखाउनुहोस्" : `+${committee.members.length - 3} थप हेर्नुहोस्`}
                              </Button>
                            )}
                          </Stack>
                        </Box>
                      ) : (
                        <Typography variant="caption" color="text.secondary">
                          कुनै सदस्य नियुक्त गरिएको छैन
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Box>
          ))
        )}

        </Box>

        {/* Add Committee Dialog */}
        <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>नयाँ समिति थप्नुहोस्</DialogTitle>
          <DialogContent>
            <FormControl fullWidth size="small" sx={{ mt: 1 }}>
              <InputLabel>Preset</InputLabel>
              <Select label="Preset" value={committeeType} onChange={applyPreset}>
                <MenuItem value="">Custom…</MenuItem>
                {presetCommittees.map((preset) => (
                  <MenuItem key={preset.type} value={preset.type}>
                    {preset.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Committee name (Nepali)"
              value={committeeName}
              onChange={(e) => setCommitteeName(e.target.value)}
              sx={{ mt: 2 }}
              disabled={saving}
            />
            <TextField
              fullWidth
              label="Committee name (English)"
              value={committeeNameEn}
              onChange={(e) => setCommitteeNameEn(e.target.value)}
              sx={{ mt: 2 }}
              disabled={saving}
            />

            {(committeeType === "provincial" || committeeType === "district" || !committeeType) && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 700 }}>
                  Location Information (Optional)
                </Typography>
                <FormControl fullWidth size="small" sx={{ mt: 1.5 }}>
                  <InputLabel>प्रदेश (Province)</InputLabel>
                  <Select label="प्रदेश (Province)" value={provinceName} onChange={(e) => handleProvinceChange(e.target.value)} disabled={saving}>
                    {provinceOptions.map((province) => <MenuItem key={province} value={province}>{province} - {provinceEnglishNames[province]}</MenuItem>)}
                  </Select>
                </FormControl>
                {committeeType === "district" ? (
                  <FormControl fullWidth size="small" sx={{ mt: 1.5 }} disabled={!provinceName || saving}>
                    <InputLabel>जिल्ला (District)</InputLabel>
                    <Select label="जिल्ला (District)" value={districtName} onChange={(e) => {
                      const district = (districtsByProvince[provinceName] || []).find((item) => item[0] === e.target.value);
                      handleDistrictChange(e.target.value, district?.[1] || "");
                    }}>
                      {(districtsByProvince[provinceName] || []).map(([district, english]) => <MenuItem key={district} value={district}>{district} - {english}</MenuItem>)}
                    </Select>
                  </FormControl>
                ) : (
                  <TextField fullWidth label="जिल्ला नाम (District Name)" value={districtName} onChange={(e) => setDistrictName(e.target.value)} sx={{ mt: 1.5 }} disabled={saving} />
                )}
                <TextField
                  fullWidth
                  label="District name (English)"
                  value={districtNameEn}
                  onChange={(e) => setDistrictNameEn(e.target.value)}
                  sx={{ mt: 1.5 }}
                  disabled={saving}
                />
              </>
            )}
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button onClick={() => setOpenAddDialog(false)} disabled={saving}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleAddCommittee} disabled={saving || !committeeName.trim() || (committeeType === "provincial" && !provinceName) || (committeeType === "district" && !districtName)}>
              {saving ? "Adding..." : "Add Committee"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Committee Dialog */}
        <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>समिति विवरण सम्पादन गर्नुहोस्</DialogTitle>
          <DialogContent>
            <FormControl fullWidth size="small" sx={{ mt: 1 }}>
              <InputLabel>Committee Type</InputLabel>
              <Select label="Committee Type" value={committeeType} onChange={applyPreset}>
                <MenuItem value="">Custom…</MenuItem>
                {presetCommittees.map((preset) => (
                  <MenuItem key={preset.type} value={preset.type}>
                    {preset.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Committee name (Nepali)"
              value={committeeName}
              onChange={(e) => setCommitteeName(e.target.value)}
              sx={{ mt: 2 }}
              disabled={saving}
            />
            <TextField
              fullWidth
              label="Committee name (English)"
              value={committeeNameEn}
              onChange={(e) => setCommitteeNameEn(e.target.value)}
              sx={{ mt: 2 }}
              disabled={saving}
            />

            {editingCommittee?.members?.length > 0 && (
              <Alert severity="info" sx={{ mt: 2 }}>
                ⚠️ This committee has {editingCommittee.members.length} members. You can still change the structure.
              </Alert>
            )}

            {(committeeType === "provincial" || committeeType === "district" || !committeeType) && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 700 }}>
                  Location Information
                </Typography>
                <FormControl fullWidth size="small" sx={{ mt: 1.5 }}>
                  <InputLabel>प्रदेश (Province)</InputLabel>
                  <Select label="प्रदेश (Province)" value={provinceName} onChange={(e) => handleProvinceChange(e.target.value)} disabled={saving}>
                    {provinceOptions.map((province) => <MenuItem key={province} value={province}>{province} - {provinceEnglishNames[province]}</MenuItem>)}
                  </Select>
                </FormControl>
                {committeeType === "district" ? (
                  <FormControl fullWidth size="small" sx={{ mt: 1.5 }} disabled={!provinceName || saving}>
                    <InputLabel>जिल्ला (District)</InputLabel>
                    <Select label="जिल्ला (District)" value={districtName} onChange={(e) => {
                      const district = (districtsByProvince[provinceName] || []).find((item) => item[0] === e.target.value);
                      handleDistrictChange(e.target.value, district?.[1] || "");
                    }}>
                      {(districtsByProvince[provinceName] || []).map(([district, english]) => <MenuItem key={district} value={district}>{district} - {english}</MenuItem>)}
                    </Select>
                  </FormControl>
                ) : (
                  <TextField fullWidth label="जिल्ला नाम (District Name)" value={districtName} onChange={(e) => setDistrictName(e.target.value)} sx={{ mt: 1.5 }} disabled={saving} />
                )}
                <TextField
                  fullWidth
                  label="District name (English)"
                  value={districtNameEn}
                  onChange={(e) => setDistrictNameEn(e.target.value)}
                  sx={{ mt: 1.5 }}
                  disabled={saving}
                />
              </>
            )}
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button onClick={() => setOpenEditDialog(false)} disabled={saving}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleRenameCommittee} disabled={saving || !committeeName.trim() || (committeeType === "provincial" && !provinceName) || (committeeType === "district" && !districtName)}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add Members Dialog */}
        <Dialog open={openMemberDialog} onClose={() => setOpenMemberDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            सदस्य थप्नुहोस् - {memberDialogCommittee?.name}
            {getCommitteeLocation(memberDialogCommittee) && (
              <Typography component="span" display="block" variant="body2" color="text.secondary" sx={{ mt: .5 }}>
                {memberDialogCommittee?.type === "district" ? "जिल्ला" : "प्रदेश"}: {getCommitteeLocation(memberDialogCommittee)}
              </Typography>
            )}
          </DialogTitle>
          <DialogContent>
            <FormControl fullWidth size="small" sx={{ mt: 1 }}>
              <InputLabel>प्रदेश (Province)</InputLabel>
              <Select
                label="प्रदेश (Province)"
                value={memberProvince}
                onChange={(event) => {
                  const province = event.target.value;
                  setMemberProvince(province);
                  const firstCommittee = committees.find(
                    (committee) => committee.type === "provincial" && (committee.provinceName || committee.provinceNameEn) === province
                  );
                  if (firstCommittee) {
                    setMemberCommitteeId(firstCommittee._id);
                    setMemberDialogCommittee(firstCommittee);
                    setSelectedMemberIds((firstCommittee.members || []).map((member) => member._id));
                  }
                }}
                disabled={saving}
              >
                {provinceOptions.map((province) => (
                  <MenuItem key={province} value={province}>{province}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth size="small" sx={{ mt: 2 }}>
              <InputLabel>समिति नाम (Committee Name)</InputLabel>
              <Select
                label="समिति नाम (Committee Name)"
                value={memberCommitteeId}
                onChange={(event) => {
                  const committee = committees.find((item) => item._id === event.target.value);
                  if (!committee) return;
                  setMemberCommitteeId(committee._id);
                  setMemberDialogCommittee(committee);
                  setMemberProvince(committee.provinceName || committee.provinceNameEn || "");
                  setSelectedMemberIds((committee.members || []).map((member) => member._id));
                }}
                disabled={saving}
              >
                {committees
                  .filter((committee) => !memberProvince || (committee.provinceName || committee.provinceNameEn) === memberProvince)
                  .map((committee) => (
                    <MenuItem key={committee._id} value={committee._id}>{committee.name}</MenuItem>
                  ))}
              </Select>
            </FormControl>

            <FormControl fullWidth size="small" sx={{ mt: 2 }}>
              <InputLabel>सदस्य (Member)</InputLabel>
              <Select
                label="सदस्य (Member)"
                value={selectedMemberId}
                onChange={(event) => setSelectedMemberId(event.target.value)}
                disabled={saving}
              >
                {members.map((member) => (
                  <MenuItem key={member._id} value={member._id}>{member.name} ({member.email})</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth size="small" sx={{ mt: 2 }}>
              <InputLabel>पद (Position)</InputLabel>
              <Select
                label="पद (Position)"
                value={memberPosition}
                onChange={(event) => setMemberPosition(event.target.value)}
                disabled={saving}
              >
                {memberPositions.map((position) => (
                  <MenuItem key={position} value={position}>{position}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              size="small"
              label="सदस्य खोज्नुहोस्"
              value={memberSearch}
              onChange={(e) => setMemberSearch(e.target.value)}
              sx={{ mt: 2, mb: 2 }}
            />
            {filteredMembersForDialog().length === 0 ? (
              <Typography color="text.secondary">कुनै सदस्य भेटिएन।</Typography>
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
                    <Avatar src={member.image} sx={{ width: 28, height: 28 }}>
                      {member.name?.[0]}
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2" fontWeight={checked ? 600 : 400}>
                        {member.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {member.email}
                      </Typography>
                    </Box>
                  </Stack>
                );
              })
            )}
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button onClick={() => setOpenMemberDialog(false)} disabled={saving}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSaveMembers} disabled={saving || !selectedMemberId || !memberPosition}>
              {saving ? "Saving..." : "Save Member"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}
