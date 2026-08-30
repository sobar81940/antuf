"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, Box, Button, CircularProgress, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FemaleIcon from "@mui/icons-material/Female";
import Sidebar from "@/components/sidebar/SideBar";

/**
 * Women's Committee workspace entry point.
 *
 * The women's organization is a SEPARATE association (slug "women-committee").
 * This page provisions that association on first visit and then hands off to its
 * own full workspace, where the admin can build an independent committee
 * structure (add/edit/delete committees, assign members).
 */
export default function WomenCommitteePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const response = await fetch("/api/admin/associations/women", {
          credentials: "include",
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Unable to open the Women's Committee workspace");
        }

        if (cancelled) return;
        const slug = data.data?.slug || data.data?._id;
        router.replace(`/dashboard/admin/organization/${slug}`);
      } catch (loadError) {
        if (!cancelled) setError(loadError.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f4f7fb" }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 4 } }}>
        {error ? (
          <Box>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => router.push("/dashboard/admin/organization")}
              sx={{ mb: 2, px: 0, color: "text.secondary" }}
            >
              Back to Professional Associations
            </Button>
            <Alert severity="error">{error}</Alert>
          </Box>
        ) : (
          <Box sx={{ display: "grid", placeItems: "center", minHeight: "70vh", textAlign: "center" }}>
            <Box>
              <Box
                sx={{
                  display: "grid",
                  placeItems: "center",
                  width: 72,
                  height: 72,
                  mx: "auto",
                  borderRadius: 3,
                  bgcolor: "#fde8f1",
                  color: "#d14d83",
                }}
              >
                <FemaleIcon sx={{ fontSize: 38 }} />
              </Box>
              <Typography variant="h5" fontWeight={800} sx={{ mt: 2.5, color: "#182230" }}>
                {loading ? "Opening Women's Committee workspace…" : "Women's Committee"}
              </Typography>
              {loading && (
                <>
                  <Typography sx={{ mt: 1, color: "#667085" }}>
                    Preparing the separate women&apos;s organization…
                  </Typography>
                  <CircularProgress size={26} sx={{ mt: 2.5, color: "#d14d83" }} />
                </>
              )}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}