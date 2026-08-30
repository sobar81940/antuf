"use client";

import { Button, Box, Typography } from "@mui/material";

import { useState, useEffect } from "react";

import { fetchHomeSliders } from "@/slice/sliderSlice";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import Slider from "react-slick";
import { sliderStyles } from "./sliderStyles";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ColorfulSkeletonLoader } from "./ColorfulSkeletonLoader";

export default function ClientSaid() {
  const dispatch = useAppDispatch();

  const { sliders, loading, error: reduxError } = useAppSelector((state) => {
    console.log('Redux sliders state:', state.sliders);
    return state.sliders;
  });

  const [error, setError] = useState(null);

  // Demo/fallback sliders for when API fails
  const demoSliders = [
    {
      _id: 'demo-1',
      image: 'https://via.placeholder.com/1200x600?text=Welcome+to+ANTUF',
      title: 'Welcome to ANTUF',
      sub_title: 'Learn and Grow Together',
      short_description: 'Explore our courses and resources to enhance your knowledge.',
      button_link: '/course-details'
    }
  ];

  useEffect(() => {
    const getSliders = async () => {
      try {
        console.log('Starting to fetch home sliders from /api/sliders...');
        const result = await dispatch(fetchHomeSliders()).unwrap();
        console.log('Fetched sliders successfully:', result);
        setError(null);
      } catch (error) {
        console.error('Slider fetch error:', error);
        setError(error || "Failed to load sliders");
      }
    };

    getSliders();
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
  const displayError = error || reduxError;
  
  // Use demo sliders if no data is available or error occurs
  const slidersToDisplay = (sliders && sliders.length > 0) ? sliders : demoSliders;
  
  // Show loading only if we don't have fallback sliders
  if (loading && sliders.length === 0 && !displayError) {
    return <ColorfulSkeletonLoader />;
  }

  if (displayError && sliders.length === 0) {
    console.warn('Slider loading failed, using demo slider:', displayError);
  }
  
  // Always render - either real sliders or demo
  console.log('Rendering sliders:', slidersToDisplay.length > 0 ? 'Real data' : 'Demo fallback');

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
              height: '800px',
              mb:-1
            }}
          >
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
            <Box sx={sliderStyles.overlay}>
              <Box sx={{ 
                maxWidth: '800px',
                margin: '0 auto',
                textAlign: 'center'
              }}>
                <Typography 
                  variant="h3" 
                  sx={{
                    ...sliderStyles.titleText,
                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                    mb: 2
                  }}
                >
                  {item.title}
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    ...sliderStyles.subtitleText,
                    textShadow: '1px 1px 3px rgba(0,0,0,0.5)',
                    mb: 2
                  }}
                >
                  {item.sub_title}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    ...sliderStyles.descriptionText,
                    textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                    mb: 3
                  }}
                >
                  {item.short_description}
                </Typography>
                <Button
                  href={item.button_link}
                  variant="contained"
                  sx={{
                    ...sliderStyles.shopButton,
                    backdropFilter: 'blur(4px)',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  }}
                >
                  More Info
                </Button>
              </Box>
            </Box>
          </Box>
        ))}
      </Slider>
    </Box>
  );
}