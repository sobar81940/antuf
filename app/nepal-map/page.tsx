"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Container,
  Paper,
  Grid,
  Card,
  Chip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Divider,
} from "@mui/material";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import CloseIcon from "@mui/icons-material/Close";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PeopleIcon from "@mui/icons-material/People";
import TerrainIcon from "@mui/icons-material/Terrain";
import SVGComponent from"./map"
 
const NepalMap = () => {
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [hoveredProvince, setHoveredProvince] = useState(null);

  // Province data with districts and information
  const provinces = {
    koshi: {
      id: 1,
      name: "कोशी प्रदेश",
      nameEn: "Koshi Province",
      capital: "विराटनगर",
      capitalEn: "Biratnagar",
      area: "25,905 km²",
      population: "4,534,943",
      districts: ["मोरङ", "सुनसरी", "धनकुटा", "तेह्रथुम", "संखुवासभा", "भोजपुर", "सोलुखुम्बु", "ओखलढुंगा", "खोटाङ", "उदयपुर", "झापा", "इलाम", "पाँचथर", "ताप्लेजुंग"],
      color: "#FF9E67",
      description: "पूर्वी नेपालमा अवस्थित कोशी प्रदेश प्राकृतिक सुन्दरता र सांस्कृतिक विविधताको केन्द्र हो।"
    },
    madhesh: {
      id: 2,
      name: "मधेश प्रदेश",
      nameEn: "Madhesh Province",
      capital: "जनकपुरधाम",
      capitalEn: "Janakpurdham",
      area: "9,661 km²",
      population: "6,126,288",
      districts: ["सप्तरी", "सिराहा", "धनुषा", "महोत्तरी", "सर्लाही", "रौतहट", "बारा", "पर्सा"],
      color: "#FFA07A",
      description: "तराई क्षेत्रमा अवस्थित मधेश प्रदेश कृषि र उद्योगको मुख्य केन्द्र हो।"
    },
    bagmati: {
      id: 3,
      name: "बागमती प्रदेश",
      nameEn: "Bagmati Province",
      capital: "हेटौंडा",
      capitalEn: "Hetauda",
      area: "20,300 km²",
      population: "6,084,042",
      districts: ["सिन्धुली", "रामेछाप", "दोलखा", "काभ्रेपलाञ्चोक", "सिन्धुपाल्चोक", "काठमाडौं", "भक्तपुर", "ललितपुर", "नुवाकोट", "रसुवा", "धादिङ", "मकवानपुर", "चितवन"],
      color: "#B0E57C",
      description: "राजधानी काठमाडौं समेट्ने बागमती प्रदेश नेपालको राजनैतिक र आर्थिक केन्द्र हो।"
    },
    gandaki: {
      id: 4,
      name: "गण्डकी प्रदेश",
      nameEn: "Gandaki Province",
      capital: "पोखरा",
      capitalEn: "Pokhara",
      area: "21,504 km²",
      population: "2,479,745",
      districts: ["गोरखा", "लमजुङ", "तनहुँ", "स्याङ्जा", "कास्की", "मनाङ", "मुस्ताङ", "म्याग्दी", "पर्वत", "बागलुङ", "नवलपरासी पूर्व"],
      color: "#87CEEB",
      description: "पर्यटकीय गन्तव्य पोखरा र अन्नपूर्ण हिमाल समेट्ने गण्डकी प्रदेश।"
    },
    lumbini: {
      id: 5,
      name: "लुम्बिनी प्रदेश",
      nameEn: "Lumbini Province",
      capital: "देउखुरी",
      capitalEn: "Deukhuri",
      area: "22,288 km²",
      population: "5,124,225",
      districts: ["रुपन्देही", "कपिलवस्तु", "पाल्पा", "नवलपरासी पश्चिम", "गुल्मी", "अर्घाखाँची", "प्युठान", "रोल्पा", "पूर्वी रुकुम", "बाँके", "बर्दिया", "दाङ"],
      color: "#F4E6A1",
      description: "भगवान् बुद्धको जन्मस्थल लुम्बिनी समेट्ने यो प्रदेश धार्मिक र सांस्कृतिक महत्वको केन्द्र हो।"
    },
    karnali: {
      id: 6,
      name: "कर्णाली प्रदेश",
      nameEn: "Karnali Province",
      capital: "वीरेन्द्रनगर",
      capitalEn: "Birendranagar",
      area: "27,984 km²",
      population: "1,570,418",
      districts: ["पश्चिम रुकुम", "सल्यान", "दोलपा", "जुम्ला", "कालिकोट", "मुगु", "हुम्ला", "जाजरकोट", "दैलेख", "सुर्खेत"],
      color: "#D4AF37",
      description: "नेपालको सबैभन्दा ठूलो तर जनसंख्या कम भएको कर्णाली प्रदेश प्राकृतिक स्रोतले धनी छ।"
    },
    sudurpaschim: {
      id: 7,
      name: "सुदूरपश्चिम प्रदेश",
      nameEn: "Sudurpaschim Province",
      capital: "गोदावरी",
      capitalEn: "Godawari",
      area: "19,539 km²",
      population: "2,552,517",
      districts: ["कैलाली", "कन्चनपुर", "डडेलधुरा", "बैतडी", "दार्चुला", "बझाङ", "बाजुरा", "अछाम", "डोटी"],
      color: "#E9967A",
      description: "सुदूर पश्चिममा अवस्थित यो प्रदेश सांस्कृतिक विविधता र प्राकृतिक सौन्दर्यले भरिपूर्ण छ।"
    }
  };

  const handleProvinceClick = (provinceKey) => {
    setSelectedProvince(provinces[provinceKey]);
  };

  const handleCloseDialog = () => {
    setSelectedProvince(null);
  };

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          minHeight: "40vh",
          background: "linear-gradient(135deg, #DC143C 0%, #8B0000 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          py: { xs: 4, md: 6 },
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)",
            zIndex: 1,
          },
        }}
      >
        <Container
          maxWidth="lg"
          sx={{ position: "relative", zIndex: 2, textAlign: "center" }}
        >
          <Typography
            variant="h2"
            sx={{
              color: "#fff",
              fontWeight: "800",
              mb: 2,
              fontSize: { xs: "2rem", md: "3.5rem" },
              textShadow: "0 4px 20px rgba(0,0,0,0.3)",
            }}
          >
            नेपालको नक्सा
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: "rgba(255,255,255,0.95)",
              fontSize: { xs: "1rem", md: "1.3rem" },
              textShadow: "0 2px 10px rgba(0,0,0,0.2)",
            }}
          >
            Nepal Political Map - Seven Provinces
          </Typography>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 8 } }}>
        {/* Info Cards */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          <Grid
            size={{
              xs: 12,
              md: 4
            }}>
            <Card
              sx={{
                p: 3,
                textAlign: "center",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
              }}
            >
              <LocationOnIcon sx={{ fontSize: 50, mb: 2 }} />
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                7
              </Typography>
              <Typography variant="h6">प्रदेशहरू / Provinces</Typography>
            </Card>
          </Grid>
          <Grid
            size={{
              xs: 12,
              md: 4
            }}>
            <Card
              sx={{
                p: 3,
                textAlign: "center",
                background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                color: "white",
              }}
            >
              <TerrainIcon sx={{ fontSize: 50, mb: 2 }} />
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                77
              </Typography>
              <Typography variant="h6">जिल्लाहरू / Districts</Typography>
            </Card>
          </Grid>
          <Grid
            size={{
              xs: 12,
              md: 4
            }}>
            <Card
              sx={{
                p: 3,
                textAlign: "center",
                background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                color: "white",
              }}
            >
              <PeopleIcon sx={{ fontSize: 50, mb: 2 }} />
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                29M+
              </Typography>
              <Typography variant="h6">जनसंख्या / Population</Typography>
            </Card>
          </Grid>
        </Grid>

        {/* Interactive Map */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 4 },
            mb: 6,
            background: "linear-gradient(135deg, #fff 0%, #f8f9fa 100%)",
            border: "2px solid #f0f0f0",
            borderRadius: 4,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              textAlign: "center",
              mb: 4,
              fontWeight: 800,
              color: "#1a1a2e",
            }}
          >
            प्रदेशहरू चयन गर्नुहोस् / Select Province
          </Typography>

          {/* SVG Map Container */}
          {/* <Box
            sx={{
              position: "relative",
              width: "100%",
              maxWidth: "1200px",
              margin: "0 auto",
              aspectRatio: "3/1",
              background: "linear-gradient(to bottom, #e3f2fd 0%, #f5f5f5 100%)",
              borderRadius: 3,
              padding: 2,
              boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
              "& svg": {
                width: "100%",
                height: "100%",
              },
            }}
          >
            <svg
              viewBox="0 0 1200 400"
              xmlns="http://www.w3.org/2000/svg"
              style={{ display: "block" }}
            >
          
              <defs>
                <filter id="provinceShadow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur in="SourceAlpha" stdDeviation="4"/>
                  <feOffset dx="2" dy="3" result="offsetblur"/>
                  <feComponentTransfer>
                    <feFuncA type="linear" slope="0.4"/>
                  </feComponentTransfer>
                  <feMerge>
                    <feMergeNode/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>

                <linearGradient id="koshiGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#FF8C5A', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#FF6B3D', stopOpacity: 1 }} />
                </linearGradient>

                <linearGradient id="madheshGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#FFB088', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#FF9A6C', stopOpacity: 1 }} />
                </linearGradient>

                <linearGradient id="bagmatiGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#A8E063', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#8BC34A', stopOpacity: 1 }} />
                </linearGradient>

                <linearGradient id="gandakiGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#7EC8E3', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#5DADE2', stopOpacity: 1 }} />
                </linearGradient>

                <linearGradient id="lumbiniGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#F9E79F', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#F4D03F', stopOpacity: 1 }} />
                </linearGradient>

                <linearGradient id="karnaliGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#DAA520', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#CD9509', stopOpacity: 1 }} />
                </linearGradient>

                <linearGradient id="sudurpaschimGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#E59866', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#DC7633', stopOpacity: 1 }} />
                </linearGradient>
              </defs>

             
              <rect width="1200" height="400" fill="transparent" />

          
              <path
                d="M 50,200 L 80,160 L 110,140 L 140,130 L 170,125 L 195,125 L 210,135 L 220,155 L 225,180 L 225,210 L 220,240 L 210,265 L 190,285 L 160,295 L 130,300 L 100,295 L 70,280 L 50,260 L 40,230 Z"
                fill={hoveredProvince === 'sudurpaschim' ? '#F0A090' : 'url(#sudurpaschimGradient)'}
                stroke="#DC143C"
                strokeWidth="3"
                filter="url(#provinceShadow)"
                style={{
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  opacity: hoveredProvince === 'sudurpaschim' ? 1 : 0.95,
                }}
                onMouseEnter={() => setHoveredProvince('sudurpaschim')}
                onMouseLeave={() => setHoveredProvince(null)}
                onClick={() => handleProvinceClick('sudurpaschim')}
              />
              <text x="140" y="215" textAnchor="middle" fill="#fff" fontSize="18" fontWeight="bold" pointerEvents="none" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                सुदूरपश्चिम
              </text>


              <path
                d="M 220,155 L 240,130 L 270,110 L 300,95 L 335,85 L 370,82 L 400,85 L 425,95 L 445,110 L 460,130 L 470,155 L 472,185 L 468,215 L 458,245 L 440,270 L 415,287 L 385,297 L 350,300 L 315,295 L 280,285 L 250,268 L 230,245 L 225,210 Z"
                fill={hoveredProvince === 'karnali' ? '#E6C347' : 'url(#karnaliGradient)'}
                stroke="#DC143C"
                strokeWidth="3"
                filter="url(#provinceShadow)"
                style={{
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  opacity: hoveredProvince === 'karnali' ? 1 : 0.95,
                }}
                onMouseEnter={() => setHoveredProvince('karnali')}
                onMouseLeave={() => setHoveredProvince(null)}
                onClick={() => handleProvinceClick('karnali')}
              />
              <text x="350" y="195" textAnchor="middle" fill="#fff" fontSize="20" fontWeight="bold" pointerEvents="none" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                कर्णाली
              </text>

             
              <path
                d="M 210,265 L 230,245 L 250,268 L 280,285 L 315,295 L 350,300 L 385,297 L 415,287 L 440,270 L 455,285 L 465,305 L 470,325 L 465,345 L 450,358 L 425,367 L 390,372 L 350,373 L 310,370 L 270,362 L 235,350 L 210,330 L 195,305 Z"
                fill={hoveredProvince === 'lumbini' ? '#FFF0B0' : 'url(#lumbiniGradient)'}
                stroke="#DC143C"
                strokeWidth="3"
                filter="url(#provinceShadow)"
                style={{
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  opacity: hoveredProvince === 'lumbini' ? 1 : 0.95,
                }}
                onMouseEnter={() => setHoveredProvince('lumbini')}
                onMouseLeave={() => setHoveredProvince(null)}
                onClick={() => handleProvinceClick('lumbini')}
              />
              <text x="350" y="335" textAnchor="middle" fill="#fff" fontSize="20" fontWeight="bold" pointerEvents="none" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                लुम्बिनी
              </text>


              <path
                d="M 445,110 L 475,95 L 510,85 L 545,80 L 580,80 L 610,85 L 635,95 L 655,110 L 670,130 L 680,155 L 682,185 L 678,215 L 668,243 L 650,265 L 625,280 L 595,290 L 560,295 L 525,295 L 490,290 L 460,278 L 440,260 L 458,245 L 468,215 L 472,185 Z"
                fill={hoveredProvince === 'gandaki' ? '#A0DEFF' : 'url(#gandakiGradient)'}
                stroke="#DC143C"
                strokeWidth="3"
                filter="url(#provinceShadow)"
                style={{
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  opacity: hoveredProvince === 'gandaki' ? 1 : 0.95,
                }}
                onMouseEnter={() => setHoveredProvince('gandaki')}
                onMouseLeave={() => setHoveredProvince(null)}
                onClick={() => handleProvinceClick('gandaki')}
              />
              <text x="575" y="185" textAnchor="middle" fill="#fff" fontSize="20" fontWeight="bold" pointerEvents="none" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                गण्डकी
              </text>

            
              <path
                d="M 655,110 L 685,100 L 720,95 L 755,93 L 788,95 L 815,102 L 835,115 L 850,135 L 860,160 L 865,190 L 863,220 L 855,248 L 840,272 L 818,290 L 790,302 L 755,308 L 720,310 L 685,305 L 655,295 L 630,280 L 650,265 L 668,243 L 678,215 L 682,185 L 680,155 Z"
                fill={hoveredProvince === 'bagmati' ? '#C0F090' : 'url(#bagmatiGradient)'}
                stroke="#DC143C"
                strokeWidth="3"
                filter="url(#provinceShadow)"
                style={{
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  opacity: hoveredProvince === 'bagmati' ? 1 : 0.95,
                }}
                onMouseEnter={() => setHoveredProvince('bagmati')}
                onMouseLeave={() => setHoveredProvince(null)}
                onClick={() => handleProvinceClick('bagmati')}
              />
              <text x="760" y="200" textAnchor="middle" fill="#fff" fontSize="20" fontWeight="bold" pointerEvents="none" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                बागमती
              </text>

        
              <path
                d="M 465,305 L 490,290 L 525,295 L 560,295 L 595,290 L 625,280 L 655,295 L 685,305 L 720,310 L 755,308 L 790,302 L 818,290 L 840,305 L 855,325 L 865,348 L 868,368 L 860,385 L 840,395 L 810,398 L 770,398 L 725,395 L 675,390 L 625,383 L 575,375 L 525,368 L 480,358 L 450,345 Z"
                fill={hoveredProvince === 'madhesh' ? '#FFB090' : 'url(#madheshGradient)'}
                stroke="#DC143C"
                strokeWidth="3"
                filter="url(#provinceShadow)"
                style={{
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  opacity: hoveredProvince === 'madhesh' ? 1 : 0.95,
                }}
                onMouseEnter={() => setHoveredProvince('madhesh')}
                onMouseLeave={() => setHoveredProvince(null)}
                onClick={() => handleProvinceClick('madhesh')}
              />
              <text x="665" y="355" textAnchor="middle" fill="#fff" fontSize="20" fontWeight="bold" pointerEvents="none" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                मधेश
              </text>

              <path
                d="M 835,115 L 870,105 L 910,100 L 950,98 L 990,100 L 1025,107 L 1055,120 L 1080,140 L 1100,165 L 1115,195 L 1120,225 L 1118,255 L 1108,283 L 1090,308 L 1065,327 L 1033,342 L 995,352 L 955,357 L 915,357 L 875,352 L 840,342 L 818,327 L 840,305 L 818,290 L 840,272 L 855,248 L 863,220 L 865,190 L 860,160 L 850,135 Z"
                fill={hoveredProvince === 'koshi' ? '#FF7F50' : 'url(#koshiGradient)'}
                stroke="#DC143C"
                strokeWidth="3"
                filter="url(#provinceShadow)"
                style={{
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  opacity: hoveredProvince === 'koshi' ? 1 : 0.95,
                }}
                onMouseEnter={() => setHoveredProvince('koshi')}
                onMouseLeave={() => setHoveredProvince(null)}
                onClick={() => handleProvinceClick('koshi')}
              />
              <text x="975" y="230" textAnchor="middle" fill="#fff" fontSize="20" fontWeight="bold" pointerEvents="none" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                कोशी
              </text>

            
              <circle cx="140" cy="215" r="24" fill="white" opacity="0.95" stroke="#DC143C" strokeWidth="2.5" filter="url(#provinceShadow)" />
              <text x="140" y="223" textAnchor="middle" fill="#DC143C" fontSize="20" fontWeight="900" pointerEvents="none">7</text>

              <circle cx="350" cy="195" r="24" fill="white" opacity="0.95" stroke="#DC143C" strokeWidth="2.5" filter="url(#provinceShadow)" />
              <text x="350" y="203" textAnchor="middle" fill="#DC143C" fontSize="20" fontWeight="900" pointerEvents="none">6</text>

              <circle cx="350" cy="335" r="24" fill="white" opacity="0.95" stroke="#DC143C" strokeWidth="2.5" filter="url(#provinceShadow)" />
              <text x="350" y="343" textAnchor="middle" fill="#DC143C" fontSize="20" fontWeight="900" pointerEvents="none">5</text>

              <circle cx="575" cy="185" r="24" fill="white" opacity="0.95" stroke="#DC143C" strokeWidth="2.5" filter="url(#provinceShadow)" />
              <text x="575" y="193" textAnchor="middle" fill="#DC143C" fontSize="20" fontWeight="900" pointerEvents="none">4</text>

              <circle cx="760" cy="200" r="24" fill="white" opacity="0.95" stroke="#DC143C" strokeWidth="2.5" filter="url(#provinceShadow)" />
              <text x="760" y="208" textAnchor="middle" fill="#DC143C" fontSize="20" fontWeight="900" pointerEvents="none">3</text>

              <circle cx="665" cy="355" r="24" fill="white" opacity="0.95" stroke="#DC143C" strokeWidth="2.5" filter="url(#provinceShadow)" />
              <text x="665" y="363" textAnchor="middle" fill="#DC143C" fontSize="20" fontWeight="900" pointerEvents="none">2</text>

              <circle cx="975" cy="230" r="24" fill="white" opacity="0.95" stroke="#DC143C" strokeWidth="2.5" filter="url(#provinceShadow)" />
              <text x="975" y="238" textAnchor="middle" fill="#DC143C" fontSize="20" fontWeight="900" pointerEvents="none">1</text>
            </svg>
          </Box> */}
          <SVGComponent/>

          <Typography
            variant="body2"
            sx={{
              textAlign: "center",
              mt: 3,
              color: "#666",
              fontStyle: "italic",
            }}
          >
            प्रदेशको विस्तृत जानकारीका लागि नक्सामा क्लिक गर्नुहोस्
          </Typography>
        </Paper>

        {/* Province Cards Grid */}
        <Typography
          variant="h4"
          sx={{
            textAlign: "center",
            mb: 4,
            fontWeight: 800,
            color: "#1a1a2e",
          }}
        >
          सबै प्रदेशहरू / All Provinces
        </Typography>

        <Grid container spacing={3}>
          {Object.entries(provinces).map(([key, province]) => (
            <Grid
              key={key}
              size={{
                xs: 12,
                sm: 6,
                md: 4,
                lg: 3
              }}>
              <Card
                onClick={() => handleProvinceClick(key)}
                sx={{
                  p: 3,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  border: "2px solid #f0f0f0",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
                    borderColor: province.color,
                  },
                }}
              >
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    backgroundColor: province.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2,
                    mx: "auto",
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{ color: "white", fontWeight: 700 }}
                  >
                    {province.id}
                  </Typography>
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    textAlign: "center",
                    fontWeight: 700,
                    color: "#1a1a2e",
                    mb: 1,
                  }}
                >
                  {province.name}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ textAlign: "center", color: "#666", mb: 2 }}
                >
                  {province.nameEn}
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Stack spacing={1} sx={{ mt: 2 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="body2" sx={{ color: "#666" }}>
                      राजधानी:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {province.capital}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="body2" sx={{ color: "#666" }}>
                      जिल्ला:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {province.districts.length}
                    </Typography>
                  </Box>
                </Stack>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Province Detail Dialog */}
      <Dialog
        open={Boolean(selectedProvince)}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            maxHeight: "90vh",
          },
        }}
      >
        {selectedProvince && (
          <>
            <DialogTitle
              sx={{
                background: `linear-gradient(135deg, ${selectedProvince.color} 0%, ${selectedProvince.color}dd 100%)`,
                color: "white",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                py: 3,
              }}
            >
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                  {selectedProvince.name}
                </Typography>
                <Typography variant="h6">{selectedProvince.nameEn}</Typography>
              </Box>
              <IconButton
                onClick={handleCloseDialog}
                sx={{ color: "white" }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 4 }}>
              <Grid container spacing={3}>
                <Grid
                  size={{
                    xs: 12,
                    md: 6
                  }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
                      borderRadius: 2,
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{ color: "#666", mb: 1 }}
                    >
                      राजधानी / Capital
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {selectedProvince.capital}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#666" }}>
                      {selectedProvince.capitalEn}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid
                  size={{
                    xs: 12,
                    md: 6
                  }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
                      borderRadius: 2,
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{ color: "#666", mb: 1 }}
                    >
                      क्षेत्रफल / Area
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {selectedProvince.area}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid size={12}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
                      borderRadius: 2,
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{ color: "#666", mb: 1 }}
                    >
                      जनसंख्या / Population
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {selectedProvince.population}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid size={12}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, mb: 2, color: "#1a1a2e" }}
                  >
                    विवरण / Description
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: "#666", lineHeight: 1.8, mb: 3 }}
                  >
                    {selectedProvince.description}
                  </Typography>
                </Grid>
                <Grid size={12}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, mb: 2, color: "#1a1a2e" }}
                  >
                    जिल्लाहरू / Districts ({selectedProvince.districts.length})
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {selectedProvince.districts.map((district, index) => (
                      <Chip
                        key={index}
                        label={district}
                        sx={{
                          backgroundColor: `${selectedProvince.color}33`,
                          color: "#333",
                          fontWeight: 600,
                          px: 1,
                        }}
                      />
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
          </>
        )}
      </Dialog>

      <Footer />
    </>
  );
};

export default NepalMap;
