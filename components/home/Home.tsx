"use client";

import { Button, Box, Typography } from "@mui/material";

import { useState, useEffect, useMemo } from "react";

import { fetchHomeActivities } from "@/slice/activitySlice";
import { fetchHomeSliders } from "@/slice/sliderSlice";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import Slider from "react-slick";
import { sliderStyles } from "./sliderStyles";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ColorfulSkeletonLoader } from "./ColorfulSkeletonLoader";

// Format a date value for display (e.g. "12 Aug, 2025"); falls back to raw text
const formatSlideDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (!isNaN(date.getTime())) {
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }
  return String(value).trim();
};

// Numeric timestamp for sorting (newest first); 0 if unparseable
const getSlideSortDate = (value) => {
  const date = new Date(value);
  return !isNaN(date.getTime()) ? date.getTime() : 0;
};

export default function ClientSaid() {
  const dispatch = useAppDispatch();

  // Read both slider and activity state so the hero can mix both sources
  const {
    sliders,
    loading: slidersLoading,
    error: slidersError,
  } = useAppSelector((state) => state.sliders);
  const {
    activities,
    loading: activitiesLoading,
    error: activitiesError,
  } = useAppSelector((state) => state.activities);

  const [error, setError] = useState(null);

  // Demo/fallback slides when there is nothing to show
  const demoSliders = [
    {
      _id: 'demo-1',
      image: 'https://via.placeholder.com/1200x600?text=Welcome+to+ANTUF',
      title: 'Welcome to ANTUF',
      category: 'Organization',
      button_link: '/pages/activities',
    },
    {
      _id: 'demo-2',
      image: 'https://via.placeholder.com/1200x600?text=Activities',
      title: 'Our Activities',
      category: 'Programs',
      button_link: '/pages/activities',
    },
    {
      _id: 'demo-3',
      image: 'https://via.placeholder.com/1200x600?text=Learn+More',
      title: 'Get Involved',
      category: 'Community',
      button_link: '/pages/activities',
    }
  ];

  // Combine admin sliders with latest activities, sorted by date (newest first) then title, up to 5 slides
  const slides = useMemo(() => {
    const sliderSlides = (sliders || [])
      .filter((slide) => slide.status !== false)
      .map((slide) => {
        const rawDate = slide.createdAt;
        return {
          _id: slide._id,
          image: slide.image,
          title: slide.title,
          // Admin sliders have no dedicated category field — use the sub-title as a label
          category: slide.sub_title || "",
          date: formatSlideDate(rawDate),
          sortDate: getSlideSortDate(rawDate),
          // Detail link configured on the slider; fall back to the activities page
          button_link: slide.button_link || "/pages/activities",
        };
      });

    const activitySlides = (activities || []).slice(0, 5).map((activity) => {
      const rawDate = activity.date || activity.createdAt;
      return {
        _id: activity._id,
        image: activity.image,
        title: activity.title,
        category: activity.category,
        date: formatSlideDate(rawDate),
        sortDate: getSlideSortDate(rawDate),
        button_link: `/pages/activities/${activity._id}`,
      };
    });

    const combined = [...sliderSlides, ...activitySlides]
      .sort((a, b) => {
        // Latest date first
        if (b.sortDate !== a.sortDate) return b.sortDate - a.sortDate;
        // Title (A-Z) as a tiebreaker
        return String(a.title || '').localeCompare(String(b.title || ''));
      });

    return combined.length > 0 ? combined.slice(0, 5) : demoSliders;
  }, [sliders, activities]);

  useEffect(() => {
    const loadSlides = async () => {
      try {
        console.log('Fetching home sliders and latest activities for the hero...');
        const [slidersResult, activitiesResult] = await Promise.all([
          dispatch(fetchHomeSliders()).unwrap(),
          dispatch(fetchHomeActivities()).unwrap(),
        ]);
        console.log('Home slides loaded:', { slidersResult, activitiesResult });
        setError(null);
      } catch (loadError) {
        console.error('Home slide fetch error:', loadError);
        setError(loadError || "Failed to load slides");
      }
    };

    loadSlides();
  }, [dispatch]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 100,
    slidesToShow: 1,
    slidesToScroll: 1,
    focusOnSelect: true,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: false,
        },
      },
    ],
  };

  // Check both local and Redux error states
  const loading = slidersLoading || activitiesLoading;
  const reduxError = slidersError || activitiesError;
  const hasData = (sliders && sliders.length > 0) || (activities && activities.length > 0);
  const displayError = error || reduxError;
  
  // Use mapped slides (admin sliders + latest activities) or demo fallback
  const slidersToDisplay = slides;
  
  // Show loading only if we don't have any real data yet
  if (loading && !hasData && !displayError) {
    return <ColorfulSkeletonLoader />;
  }

  if (displayError && !hasData) {
    console.warn('Home slides loading failed, using demo slide:', displayError);
  }
  
  // Always render - either real slides or demo
  console.log('Rendering slider:', slidersToDisplay.length > 0 ? 'Real data' : 'Demo fallback');

  return (
    <Box sx={sliderStyles.mainContainer}>
      <Slider {...settings}>
        {slidersToDisplay.map((item, index) => (
          <Box
            key={item._id || index}
            sx={{
              ...sliderStyles.slideBox,
              position: 'relative',
              overflow: 'hidden',
              mb: -1,
            }}
          >
            {/* Full-bleed background image */}
            <Box
              component="img"
              src={item.image || 'https://via.placeholder.com/1200x600?text=Image+Not+Available'}
              alt={item.title || 'Slider image'}
              onError={(e) => {
                console.log('Image load error:', e);
                const img = e.target as HTMLImageElement;
                img.onerror = null;
                img.src = 'https://via.placeholder.com/1200x600?text=Image+Not+Available';
              }}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                position: 'absolute',
                top: 0,
                left: 0,
              }}
            />
            {/* Navy readability scrim + left-aligned content */}
            <Box sx={sliderStyles.overlay}>
              <Box sx={sliderStyles.contentBox}>
                <Box sx={sliderStyles.metaRow}>
                  {item.date && (
                    <Box component="span" sx={sliderStyles.badge}>
                      📅 {item.date}
                    </Box>
                  )}
                  {item.category && (
                    <Box component="span" sx={sliderStyles.categoryBadge}>
                      {item.category}
                    </Box>
                  )}
                </Box>
                <Box sx={sliderStyles.accentBar} />
                <Typography
                  variant="h2"
                  sx={sliderStyles.titleText}
                >
                  {item.title}
                </Typography>
                {item.button_link && (
                  <Button
                    href={item.button_link}
                    variant="contained"
                    disableElevation
                    sx={sliderStyles.detailButton}
                  >
                    विवरण / Details
                  </Button>
                )}
              </Box>
            </Box>
          </Box>
        ))}
      </Slider>
    </Box>
  );
}