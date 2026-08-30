import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { toast } from "react-toastify";
import EditIcon from "@mui/icons-material/Edit";
import VideoUpLoader from "./UploadVideo";
import { TableRowsTwoTone } from "@mui/icons-material";

const CourseEdit = ({ content, loading }) => {
  const [formData, setFormData] = useState({
    title: "",
    about: "",
    description: "",
    image: null,
    imageUrl: "",
    level: "",
    videoUrl: "",
    price: "",
  });

  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (content) {
      setFormData((prev) => ({
        ...prev,
        title: content.title || "",
        about: content.about || "",
        description: content.description || "",
        imageUrl: content.imageUrl || "",
        level: content.level || "",
        videoUrl: content.videoUrl || "",
        price: content.price || "",
      }));

      if (content.imageUrl) {
        setPreview(content.imageUrl);
      }
    }
  }, [content]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));

      setPreview(URL.createObjectURL(file));
      setIsUploading(true);
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);
      uploadFormData.append("upload_preset", "ml_default");
      try {
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: uploadFormData,
          }
        );
        const data = await res.json();
        setFormData((prev) => ({ ...prev, imageUrl: data.secure_url }));
        setIsUploading(false);
      } catch (error) {
        setIsUploading(false);
        console.log("Error from handle image change---", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.API}/admin/curriculumCourse/${content?._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      if (!response.ok) {
        toast.error(`Error ${response.status} - ${response.statusText}`);
      }
      const result = await response.json();
      toast.success("Data successfully submitted");

      setFormData({
        title: "",
        about: "",
        description: "",
        image: null,
        imageUrl: "",
        level: "",
        videoUrl: null,
        price: "",
      });

      setPreview(null);
    } catch (error) {
      console.log("Failed to submit form");
      toast.error("There was an error from handleSubmit");
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress
          size={80}
          sx={{
            color: "purple",
            animation: "spin 2s linear infinite",
          }}
        />
        <style>
          {`
@keyframes spin {
  0% {
    transform: rotate(0deg)
  }
  50% {
    transform: rotate(180deg)
  }
  100% {
    transform: rotate(360deg)
    }
  }
`}
        </style>
      </Box>
    );
  }

  return (
    <>
      <Box
        sx={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "20px",
          color: "#FFF",
        }}
      >
        <Typography variant="h5" textAlign="center" gutterBottom>
          <EditIcon
            sx={{
              marginTop: 5,
              backgroundColor: "#8A12FC",
              color: "#FFF",
            }}
          />
          {formData.title}
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            variant="outlined"
            margin="normal"
            InputLabelProps={{
              style: { color: "#8A12FC" },
            }}
            sx={{
              "& .MuiInputBase-input": {
                color: "wheat",
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#8A12FC" },
                "&:hover fieldset": { borderColor: "#8A12FC" },
                "&.Mui-focused fieldset": { borderColor: "#8A12FC" },
              },
            }}
          />

          <TextField
            fullWidth
            label="About"
            name="about"
            value={formData.about}
            onChange={handleChange}
            variant="outlined"
            margin="normal"
            InputLabelProps={{
              style: { color: "#8A12FC" },
            }}
            sx={{
              "& .MuiInputBase-input": {
                color: "wheat",
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#8A12FC" },
                "&:hover fieldset": { borderColor: "#8A12FC" },
                "&.Mui-focused fieldset": { borderColor: "#8A12FC" },
              },
            }}
          />

          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            variant="outlined"
            margin="normal"
            InputLabelProps={{
              style: { color: "#8A12FC" },
            }}
            sx={{
              "& .MuiInputBase-input": {
                color: "wheat",
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#8A12FC" },
                "&:hover fieldset": { borderColor: "#8A12FC" },
                "&.Mui-focused fieldset": { borderColor: "#8A12FC" },
              },
            }}
          />

          <FormControl
            fullWidth
            margin="normal"
            sx={{
              "& .MuiInputLabel-root": {
                color: "#8A12FC", // Label color, dimmed if disabled
              },
              "&:hover .MuiInputLabel-root": {
                color: "#8A12FC", // Hover label color
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#8A12FC", // Focused label color
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#8A12FC", // Default border color
                },
                "&:hover fieldset": {
                  borderColor: "#8A12FC", // Hover border color
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#8A12FC", // Focused border color
                },
              },
              "& .MuiSvgIcon-root": {
                color: "#8A12FC", // Icon color
              },
              "&:hover .MuiSvgIcon-root": {
                color: "#8A12FC", // Icon hover color
              },
              "&.Mui-focused .MuiSvgIcon-root": {
                color: "#8A12FC", // Icon focus color
              },
            }}
          >
            <InputLabel id="level-label">Level</InputLabel>
            <Select
              labelId="level-label"
              id="level-select"
              name="level"
              value={formData.level}
              onChange={handleChange}
              sx={{
                color: "#fff",
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    bgcolor: "#F4F4F4",
                    "& .MuiMenuItem-root": {
                      "&:hover": {
                        color: "white",
                        bgColor: "#8A12FC",
                      },
                    },
                  },
                },
              }}
            >
              <MenuItem value="Beginner Level">Beginner Level</MenuItem>
              <MenuItem value="Advanced Level">Advanced Level</MenuItem>
              <MenuItem value="All Level">All Level</MenuItem>
            </Select>
          </FormControl>

          <FormControl
            fullWidth
            margin="normal"
            sx={{
              "& .MuiInputLabel-root": {
                color: "#8A12FC", // Label color, dimmed if disabled
              },
              "&:hover .MuiInputLabel-root": {
                color: "#8A12FC", // Hover label color
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#8A12FC", // Focused label color
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#8A12FC", // Default border color
                },
                "&:hover fieldset": {
                  borderColor: "#8A12FC", // Hover border color
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#8A12FC", // Focused border color
                },
              },
              "& .MuiSvgIcon-root": {
                color: "#8A12FC", // Icon color
              },
              "&:hover .MuiSvgIcon-root": {
                color: "#8A12FC", // Icon hover color
              },
              "&.Mui-focused .MuiSvgIcon-root": {
                color: "#8A12FC", // Icon focus color
              },
            }}
          >
            <InputLabel id="level-label">Price</InputLabel>
            <Select
              labelId="level-label"
              id="level-select"
              name="price"
              value={formData.price}
              onChange={handleChange}
              sx={{
                color: "#fff",
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    bgcolor: "#F4F4F4",
                    "& .MuiMenuItem-root": {
                      "&:hover": {
                        color: "white",
                        bgColor: "#8A12FC",
                      },
                    },
                  },
                },
              }}
            >
              <MenuItem value="9">9.99</MenuItem>
              <MenuItem value="99">99.99</MenuItem>
              <MenuItem value="999">999.99</MenuItem>
              <MenuItem value="9999">9999.99</MenuItem>
            </Select>
          </FormControl>

          <Box mt={2}>
            <Button
              variant="contained"
              component="label"
              sx={{
                backgroundColor: "#8A12FC",
                color: "white",
              }}
            >
              Upload Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
            </Button>
          </Box>

          {preview && (
            <Box mt={2} textAlign="center">
              <Typography variant="subtitle1">Image Preview: </Typography>
              <img
                src={preview}
                alt="preview"
                style={{
                  maxWidth: "100%",
                  borderRadius: "8px",
                  marginTop: "10px",
                }}
              />
            </Box>
          )}

          {isUploading && (
            <Typography
              variant="body2"
              textAlign="center"
              sx={{
                color: "white",
              }}
            >
              Uploading image to Cloudinary...
            </Typography>
          )}

          <VideoUpLoader formData={formData} setFormData={setFormData} />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              marginTop: 2,
              backgroundColor: "#8A12FC",
              color: "white",
            }}
          >
            Submit
          </Button>
        </form>
      </Box>
    </>
  );
};

export default CourseEdit;
