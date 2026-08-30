export const imagePreviewStyles = {
  width: "100%",
  height: 0,
  paddingBottom: "56.25%", // 16:9 aspect ratio
  position: "relative",
  border: "2px dashed red",
  borderRadius: 1,
  overflow: "hidden",
  "& img": {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover"
  }
};

export const uploadPlaceholderStyles = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "rgba(0, 0, 0, 0.05)"
};