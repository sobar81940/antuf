export const sliderStyles = {
  mainContainer: {
    position: "relative",
   
    backgroundImage: 'url("/images/bg_1.jpeg")',
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",    
  },
  slideBox: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "80vh",
    backgroundSize: "cover",
    backgroundPosition: "center",
    "@media (max-width: 768px)": {
      height: "50vh",
    },
    "@media (max-width: 480px)": {
      height: "50vh",
    },
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    
   
    // background: "linear-gradient(to top, rgba(173, 10, 10, 0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0) 100%)",
    padding: "40px 20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end",
    textAlign: "center",
    color: "#fff",
    p: 2,
  },
  offerText: {
    fontFamily: "Roboto, sans-serif",
    fontWeight: 700,
    color: "#ffffff",
    zIndex: 11111,
    textShadow: "2px 2px 4px rgba(0,0,0,0.6)",
    transition: "transform 0.3s ease-in-out",
    "&:hover": {
      transform: "scale(1.1)",
    },
    "@media (max-width: 768px)": {
      fontSize: "2rem",
    },
    "@media (max-width: 480px)": {
      fontSize: "1.5rem",
    },
  },
  titleText: {
    fontFamily: "Roboto, sans-serif",
    fontWeight: 700,
    color: "#ffffff",
    zIndex: 11111,
    textShadow: "2px 2px 4px rgba(0,0,0,0.6)",
    transition: "transform 0.3s ease-in-out",
    "&:hover": {
      transform: "scale(1.1)",
    },
    "@media (max-width: 768px)": {
      fontSize: "2rem",
    },
    "@media (max-width: 480px)": {
      fontSize: "1.5rem",
    },
  },
  subtitleText: {
    fontFamily: "Roboto, sans-serif",
    fontWeight: 500,
    color: "#dddddd",
    zIndex: 11111,
    textShadow: "2px 2px 4px rgba(0,0,0,0.6)",
    "&:hover": {
      transform: "scale(1.3)",
    },
    "@media (max-width: 768px)": {
      fontSize: "1.25rem",
    },
    "@media (max-width: 480px)": {
      fontSize: "1rem",
    },
  },
  descriptionText: {
    fontFamily: "Roboto, sans-serif",
    fontWeight: 400,
    color: "#cccccc",
    textShadow: "1px 1px 3px rgba(0,0,0,0.6)",
    maxWidth: "600px",
    zIndex: 11111,
    "&:hover": {
      transform: "scale(1.5)",
    },
    "@media (max-width: 768px)": {
      fontSize: "0.9rem",
      maxWidth: "80%",
    },
    "@media (max-width: 480px)": {
      fontSize: "0.8rem",
      maxWidth: "90%",
    },
  },
  shopButton: {
    backgroundColor: "red",
    color: "#fff",
    fontWeight: 600,
    px: 4,
    py: 1,
    zIndex: 11111,
    "&:hover": {
      backgroundColor: "darkred",
      transform: "scale(1.1)",
    },
    "@media (max-width: 480px)": {
      px: 3,
      py: 0.5,
      fontSize: "0.8rem",
    },
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    py: 10,
  },
  errorContainer: {
    textAlign: "center",
    py: 4,
  },
};