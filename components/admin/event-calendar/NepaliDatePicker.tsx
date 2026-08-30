"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Typography,
  Paper,
  IconButton,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import type { SxProps, Theme } from "@mui/material/styles";

// Nepali calendar conversion utility
class NepaliDateConverter {
  // Nepali month names
  static nepaliMonths = [
    "बैशाख",
    "जेष्ठ",
    "आषाढ",
    "श्रावण",
    "भाद्र",
    "आश्विन",
    "कार्तिक",
    "मंसिर",
    "पौष",
    "माघ",
    "फाल्गुण",
    "चैत्र",
  ];

  static nepaliNumbers = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];

  static englishToNepaliNumber(num) {
    return String(num)
      .split("")
      .map((digit) => this.nepaliNumbers[parseInt(digit)])
      .join("");
  }

  static nepaliToEnglishNumber(str) {
    let result = "";
    for (let i = 0; i < str.length; i++) {
      const idx = this.nepaliNumbers.indexOf(str[i]);
      result += idx !== -1 ? idx : str[i];
    }
    return result;
  }

  // Nepali calendar to AD (Gregorian)
  static nepaliToAD(year, month, day) {
    // Nepali calendar is offset by 57 years and ~8-9 months
    // Months 1-9 (Baishakh to Phalgun): AD year = Nepali year + 56
    // Months 10-12 (Chaitra): AD year = Nepali year + 57
    const adYear = month <= 9 ? year + 56 : year + 57;
    const adMonth = month <= 9 ? month + 3 : month - 9;

    // Create date in AD
    const date = new Date(adYear, adMonth - 1, day);
    return date;
  }

  // AD (Gregorian) to Nepali calendar
  static adToNepali(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = d.getMonth() + 1; // Convert to 1-12
    const day = d.getDate();

    // Nepali year calculation: months 10-12 use year-57, months 1-9 use year-56
    let nepaliYear = month >= 10 ? year - 57 : year - 56;
    let nepaliMonth = month <= 9 ? month + 3 : month - 9;
    let nepaliDay = day;

    if (nepaliMonth > 12) {
      nepaliYear += 1;
      nepaliMonth -= 12;
    }

    return { year: nepaliYear, month: nepaliMonth, day: nepaliDay };
  }

  static formatNepaliDate(year, month, day) {
    const monthName = this.nepaliMonths[month - 1] || "";
    const yearStr = this.englishToNepaliNumber(year);
    const dayStr = this.englishToNepaliNumber(day);

    return `${dayStr} ${monthName} ${yearStr}`;
  }

  static getDaysInNepaliMonth(year, month) {
    // Simplified: Most Nepali months have 30 or 31 days
    // Chaitra (month 12) and Ashadh (month 3) typically have 32 days in leap years
    if ([3, 12].includes(month)) {
      return 32;
    }
    return 31;
  }
}

const NepaliDatePicker = ({
  value,
  onChange,
  label,
  disabled = false,
  sx,
}: {
  value?: any;
  onChange: (date: any) => void;
  label?: string;
  disabled?: boolean;
  sx?: SxProps<Theme>;
}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [nepaliYear, setNepaliYear] = useState(2080);
  const [nepaliMonth, setNepaliMonth] = useState(1);
  const [nepaliDay, setNepaliDay] = useState(1);
  const [viewMode, setViewMode] = useState("day"); // day, month, year

  // Initialize from existing value
  React.useEffect(() => {
    if (value) {
      const date = new Date(value);
      const nepali = NepaliDateConverter.adToNepali(date);
      setNepaliYear(nepali.year);
      setNepaliMonth(nepali.month);
      setNepaliDay(nepali.day);
    }
  }, [value, openDialog]);

  const handleDateSelect = (day) => {
    setNepaliDay(day);
    setViewMode("day"); // Reset to day view
  };

  const handleMonthSelect = (month) => {
    setNepaliMonth(month);
    setViewMode("day");
  };

  const handleYearSelect = (year) => {
    setNepaliYear(year);
    setViewMode("month");
  };

  const handleConfirm = () => {
    try {
      const adDate = NepaliDateConverter.nepaliToAD(nepaliYear, nepaliMonth, nepaliDay);
      onChange(adDate.toISOString());
      setOpenDialog(false);
    } catch (error) {
      console.error("Error converting date:", error);
    }
  };

  const handleCancel = () => {
    setOpenDialog(false);
    // Reset to current value
    if (value) {
      const date = new Date(value);
      const nepali = NepaliDateConverter.adToNepali(date);
      setNepaliYear(nepali.year);
      setNepaliMonth(nepali.month);
      setNepaliDay(nepali.day);
    }
  };

  const handleSelectToday = () => {
    const today = new Date();
    const nepali = NepaliDateConverter.adToNepali(today);
    setNepaliYear(nepali.year);
    setNepaliMonth(nepali.month);
    setNepaliDay(nepali.day);
    setViewMode("day");
  };

  const formatDisplayDate = () => {
    if (!value) return "कार्यक्रमको मिति चयन गर्नुहोस्";
    const date = new Date(value);
    const nepali = NepaliDateConverter.adToNepali(date);
    return NepaliDateConverter.formatNepaliDate(nepali.year, nepali.month, nepali.day);
  };

  const renderDayPicker = () => {
    const daysInMonth = NepaliDateConverter.getDaysInNepaliMonth(nepaliYear, nepaliMonth);
    const firstDay = new Date(NepaliDateConverter.nepaliToAD(nepaliYear, nepaliMonth, 1)).getDay();
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Days of month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return (
      <Box>
        {/* Weekday headers */}
        <Grid container spacing={0.5} sx={{ mb: 2 }}>
          {["आ", "स", "म", "ब", "ब", "श", "र"].map((day, idx) => (
            <Grid key={`weekday-${idx}`} sx={{ textAlign: "center" }} size={12 / 7}>
              <Typography 
                variant="caption" 
                sx={{ 
                  fontWeight: "bold", 
                  color: "#FF6B6B",
                  fontSize: "0.85rem"
                }}
              >
                {day}
              </Typography>
            </Grid>
          ))}
        </Grid>

        {/* Calendar days */}
        <Grid container spacing={0.5}>
          {days.map((day, index) => (
            <Grid key={index} size={12 / 7}>
              {day ? (
                <Button
                  fullWidth
                  onClick={() => handleDateSelect(day)}
                  sx={{
                    p: 1,
                    minHeight: "45px",
                    backgroundColor: nepaliDay === day ? "#FF6B6B" : "transparent",
                    color: nepaliDay === day ? "white" : "#333",
                    border: nepaliDay === day ? "2px solid #FF6B6B" : "1px solid #E0E0E0",
                    borderRadius: "8px",
                    fontWeight: nepaliDay === day ? "bold" : "normal",
                    fontSize: "0.95rem",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: nepaliDay === day ? "#FF6B6B" : "rgba(255,107,107,0.1)",
                      borderColor: "#FF6B6B",
                    },
                  }}
                >
                  {NepaliDateConverter.englishToNepaliNumber(day)}
                </Button>
              ) : (
                <Box />
              )}
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };

  const renderMonthPicker = () => {
    return (
      <Grid container spacing={1.5}>
        {NepaliDateConverter.nepaliMonths.map((month, index) => (
          <Grid key={index} size={6}>
            <Button
              fullWidth
              onClick={() => handleMonthSelect(index + 1)}
              sx={{
                p: 2.5,
                backgroundColor: nepaliMonth === index + 1 ? "#FF6B6B" : "#F5F5F5",
                color: nepaliMonth === index + 1 ? "white" : "#333",
                border: nepaliMonth === index + 1 ? "2px solid #FF6B6B" : "1px solid #E0E0E0",
                borderRadius: "8px",
                fontWeight: nepaliMonth === index + 1 ? "bold" : "normal",
                fontSize: "0.9rem",
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor: nepaliMonth === index + 1 ? "#FF6B6B" : "rgba(255,107,107,0.1)",
                  borderColor: "#FF6B6B",
                },
              }}
            >
              {month}
            </Button>
          </Grid>
        ))}
      </Grid>
    );
  };

  const renderYearPicker = () => {
    const startYear = Math.floor(nepaliYear / 10) * 10;
    const years = [];
    for (let i = startYear; i < startYear + 12; i++) {
      years.push(i);
    }

    return (
      <Grid container spacing={1.5}>
        {years.map((year) => (
          <Grid key={year} size={4}>
            <Button
              fullWidth
              onClick={() => handleYearSelect(year)}
              sx={{
                p: 2.5,
                backgroundColor: nepaliYear === year ? "#FF6B6B" : "#F5F5F5",
                color: nepaliYear === year ? "white" : "#333",
                border: nepaliYear === year ? "2px solid #FF6B6B" : "1px solid #E0E0E0",
                borderRadius: "8px",
                fontWeight: nepaliYear === year ? "bold" : "normal",
                fontSize: "0.9rem",
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor: nepaliYear === year ? "#FF6B6B" : "rgba(255,107,107,0.1)",
                  borderColor: "#FF6B6B",
                },
              }}
            >
              {NepaliDateConverter.englishToNepaliNumber(year)}
            </Button>
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <>
      <TextField
        fullWidth
        label={label}
        value={formatDisplayDate()}
        onClick={() => setOpenDialog(true)}
        disabled={disabled}
        sx={[
          {
            "& .MuiOutlinedInput-root": { color: "black" },
            "& .MuiInputBase-input": { color: "black", fontWeight: "bold" },
            cursor: "pointer",
          },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
        InputProps={{
          readOnly: true,
          style: { cursor: "pointer" },
        }}
      />

      <Dialog open={openDialog} onClose={handleCancel} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ 
          background: "linear-gradient(135deg, #FF6B6B 0%, #FFE66D 100%)",
          color: "black",
          fontWeight: "bold",
          fontSize: "1.3rem",
          py: 2
        }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6" sx={{ color: "black", fontWeight: "bold" }}>
              {viewMode === "day"
                ? `${NepaliDateConverter.nepaliMonths[nepaliMonth - 1]} ${NepaliDateConverter.englishToNepaliNumber(nepaliYear)}`
                : viewMode === "month"
                ? NepaliDateConverter.englishToNepaliNumber(nepaliYear)
                : "वर्ष चयन गर्नुहोस्"}
            </Typography>
            <Box>
              {viewMode !== "year" && (
                <Button
                  size="small"
                  onClick={() => setViewMode(viewMode === "day" ? "month" : "year")}
                  sx={{ color: "black", fontWeight: "bold", textTransform: "none" }}
                >
                  {viewMode === "day" ? "महिना" : "वर्ष"}
                </Button>
              )}
            </Box>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ bgcolor: "#FAFAFA", color: "black", pt: 3, pb: 2 }}>
          {viewMode === "day" && (
            <>
              {/* Month/Year navigation */}
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <IconButton
                  size="small"
                  onClick={() => {
                    if (nepaliMonth === 1) {
                      setNepaliMonth(12);
                      setNepaliYear(nepaliYear - 1);
                    } else {
                      setNepaliMonth(nepaliMonth - 1);
                    }
                  }}
                  sx={{ 
                    color: "#FF6B6B",
                    backgroundColor: "rgba(255,107,107,0.1)",
                    "&:hover": { backgroundColor: "rgba(255,107,107,0.2)" }
                  }}
                >
                  <ChevronLeftIcon />
                </IconButton>

                <Typography
                  onClick={() => setViewMode("month")}
                  sx={{
                    cursor: "pointer",
                    fontWeight: "bold",
                    color: "black",
                    flex: 1,
                    textAlign: "center",
                    fontSize: "1.1rem",
                    padding: "8px 12px",
                    borderRadius: 1,
                    "&:hover": {
                      backgroundColor: "rgba(255,107,107,0.1)"
                    }
                  }}
                >
                  {NepaliDateConverter.nepaliMonths[nepaliMonth - 1]} {NepaliDateConverter.englishToNepaliNumber(nepaliYear)}
                </Typography>

                <IconButton
                  size="small"
                  onClick={() => {
                    if (nepaliMonth === 12) {
                      setNepaliMonth(1);
                      setNepaliYear(nepaliYear + 1);
                    } else {
                      setNepaliMonth(nepaliMonth + 1);
                    }
                  }}
                  sx={{ 
                    color: "#FF6B6B",
                    backgroundColor: "rgba(255,107,107,0.1)",
                    "&:hover": { backgroundColor: "rgba(255,107,107,0.2)" }
                  }}
                >
                  <ChevronRightIcon />
                </IconButton>
              </Box>

              {/* Day picker */}
              {renderDayPicker()}
            </>
          )}

          {viewMode === "month" && (
            <>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <IconButton
                  size="small"
                  onClick={() => setNepaliYear(nepaliYear - 1)}
                  sx={{ 
                    color: "#FF6B6B",
                    backgroundColor: "rgba(255,107,107,0.1)",
                    "&:hover": { backgroundColor: "rgba(255,107,107,0.2)" }
                  }}
                >
                  <ChevronLeftIcon />
                </IconButton>

                <Typography
                  onClick={() => setViewMode("year")}
                  sx={{
                    cursor: "pointer",
                    fontWeight: "bold",
                    color: "black",
                    flex: 1,
                    textAlign: "center",
                    fontSize: "1.1rem",
                    padding: "8px 12px",
                    borderRadius: 1,
                    "&:hover": {
                      backgroundColor: "rgba(255,107,107,0.1)"
                    }
                  }}
                >
                  {NepaliDateConverter.englishToNepaliNumber(nepaliYear)}
                </Typography>

                <IconButton
                  size="small"
                  onClick={() => setNepaliYear(nepaliYear + 1)}
                  sx={{ 
                    color: "#FF6B6B",
                    backgroundColor: "rgba(255,107,107,0.1)",
                    "&:hover": { backgroundColor: "rgba(255,107,107,0.2)" }
                  }}
                >
                  <ChevronRightIcon />
                </IconButton>
              </Box>

              {/* Month picker */}
              {renderMonthPicker()}
            </>
          )}

          {viewMode === "year" && (
            <>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <IconButton
                  size="small"
                  onClick={() => setNepaliYear(Math.floor(nepaliYear / 10) * 10 - 10)}
                  sx={{ 
                    color: "#FF6B6B",
                    backgroundColor: "rgba(255,107,107,0.1)",
                    "&:hover": { backgroundColor: "rgba(255,107,107,0.2)" }
                  }}
                >
                  <ChevronLeftIcon />
                </IconButton>

                <Typography
                  sx={{
                    fontWeight: "bold",
                    color: "black",
                    flex: 1,
                    textAlign: "center",
                    fontSize: "1.1rem"
                  }}
                >
                  {NepaliDateConverter.englishToNepaliNumber(Math.floor(nepaliYear / 10) * 10)} -{" "}
                  {NepaliDateConverter.englishToNepaliNumber(Math.floor(nepaliYear / 10) * 10 + 9)}
                </Typography>

                <IconButton
                  size="small"
                  onClick={() => setNepaliYear(Math.floor(nepaliYear / 10) * 10 + 10)}
                  sx={{ 
                    color: "#FF6B6B",
                    backgroundColor: "rgba(255,107,107,0.1)",
                    "&:hover": { backgroundColor: "rgba(255,107,107,0.2)" }
                  }}
                >
                  <ChevronRightIcon />
                </IconButton>
              </Box>

              {/* Year picker */}
              {renderYearPicker()}
            </>
          )}
        </DialogContent>

        <DialogActions sx={{ bgcolor: "#FAFAFA", p: 2, gap: 1, borderTop: "1px solid #E0E0E0" }}>
          <Button
            onClick={handleSelectToday}
            variant="outlined"
            sx={{ 
              color: "#FF6B6B", 
              borderColor: "#FF6B6B", 
              fontWeight: "bold",
              textTransform: "none",
              fontSize: "0.95rem"
            }}
          >
            आज
          </Button>
          <Box sx={{ flex: 1 }} />
          <Button 
            onClick={handleCancel} 
            sx={{ 
              color: "#666",
              textTransform: "none",
              fontSize: "0.95rem"
            }}
          >
            रद्द गर्नुहोस्
          </Button>
          <Button
            onClick={handleConfirm}
            variant="contained"
            sx={{ 
              background: "linear-gradient(135deg, #FF6B6B 0%, #FFE66D 100%)", 
              color: "black", 
              fontWeight: "bold",
              textTransform: "none",
              fontSize: "0.95rem",
              "&:hover": {
                background: "linear-gradient(135deg, #FF5252 0%, #FFD54F 100%)"
              }
            }}
          >
            चयन गर्नुहोस्
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default NepaliDatePicker;
