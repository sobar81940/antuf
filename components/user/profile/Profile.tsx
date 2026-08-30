"use client";

import { useState, useEffect } from "react";
import { TextField, Button, Box, Typography, Alert } from "@mui/material";
import Avatar from '@mui/material/Avatar';

const Profile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverMessage, setServerMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Identity Information Fields
  const [motherName, setMotherName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [citizenshipNumber, setCitizenshipNumber] = useState("");
  const [district, setDistrict] = useState("");
  const [citizenshipFront, setCitizenshipFront] = useState(null);
  const [citizenshipFrontPreview, setCitizenshipFrontPreview] = useState("");
  const [citizenshipBack, setCitizenshipBack] = useState(null);
  const [citizenshipBackPreview, setCitizenshipBackPreview] = useState("");
  
  // Permanent Address State
  const [permanentAddresses, setPermanentAddresses] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [currentAddressIndex, setCurrentAddressIndex] = useState(null);
  const [addressForm, setAddressForm] = useState({
    addressType: "permanent",
    province: "",
    district: "",
    municipality: "",
    ward: "",
    streetAddress: "",
    city: "",
    zipCode: "",
    isDefault: false,
  });

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!name) errors.name = "Name is required!";
    if (!email) {
      errors.email = "Email is required!";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email is Invalid!";
    }
    if (!password) errors.password = "Password is required!";
    if (password !== confirmPassword)
      errors.confirmPassword = "Passwords do not match!";
    setErrors(errors);

    return Object.keys(errors).length === 0;
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user/profile');
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      setEmail(data?.email);
      setName(data?.name);
      setProfileImagePreview(data?.image);
      setPhone(data?.phone || "");
      setAddress(data?.address || "");
      setCity(data?.city || "");
      setState(data?.state || "");
      setCountry(data?.country || "");
      setZipCode(data?.zipCode || "");
      setBio(data?.bio || "");
      setPermanentAddresses(data?.permanentAddresses || []);
      setMotherName(data?.motherName || "");
      setFatherName(data?.fatherName || "");
      setCitizenshipNumber(data?.citizenshipNumber || "");
      setDistrict(data?.district || "");
      setCitizenshipFrontPreview(data?.citizenshipFront || "");
      setCitizenshipBackPreview(data?.citizenshipBack || "");
    } catch (error) {
      console.log("Error fetching data", error);
    }
  };

  // Permanent Address Handlers
  const handleAddAddressClick = () => {
    setAddressForm({
      addressType: "permanent",
      province: "",
      district: "",
      municipality: "",
      ward: "",
      streetAddress: "",
      city: "",
      zipCode: "",
      isDefault: false,
    });
    setCurrentAddressIndex(null);
    setShowAddressForm(true);
  };

  const handleEditAddress = (index) => {
    setAddressForm(permanentAddresses[index]);
    setCurrentAddressIndex(index);
    setShowAddressForm(true);
  };

  const handleDeleteAddress = (index) => {
    const updatedAddresses = permanentAddresses.filter((_, i) => i !== index);
    setPermanentAddresses(updatedAddresses);
  };

  const handleAddressFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSaveAddress = () => {
    if (currentAddressIndex !== null) {
      const updatedAddresses = [...permanentAddresses];
      updatedAddresses[currentAddressIndex] = addressForm;
      setPermanentAddresses(updatedAddresses);
    } else {
      setPermanentAddresses([...permanentAddresses, addressForm]);
    }
    setShowAddressForm(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setProfileImage(file); // Store the selected file in state.

      const reader = new FileReader(); // Create a FileReader to read the file.
      reader.onloadend = () => {
        setProfileImagePreview(reader.result as string); // Update the preview with the base64 URL of the image.
      };
      reader.readAsDataURL(file); // Convert the image file to a Data URL.
    }
  };

  // Handle Citizenship Front Document Upload
  const handleCitizenshipFrontChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCitizenshipFront(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCitizenshipFrontPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Citizenship Back Document Upload
  const handleCitizenshipBackChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCitizenshipBack(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCitizenshipBackPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Function to upload an image to Cloudinary and return the uploaded image URL.
  const uploadImageToCloudinary = async (image) => {
    const formData = new FormData(); // Create FormData object to send the image file.
    formData.append("file", image); // Attach the image file.
    formData.append("upload_preset", "ml_default"); // Attach the Cloudinary upload preset.
    console.log(formData);
    // Make a POST request to Cloudinary's API to upload the image.
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST", // HTTP method is POST since we are uploading data.
        body: formData, // Attach the form data containing the image.
      }
    );

    const data = await response.json(); // Convert response into JSON format.
    console.log("data--------", data);
    return data.secure_url; // Return the URL of the uploaded image.
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    let imageUrl = ""; // Variable to store the uploaded image URL.
    let citizenshipFrontUrl = "";
    let citizenshipBackUrl = "";

    // If a profile image was selected, upload it to Cloudinary.
    if (profileImage) {
      imageUrl = await uploadImageToCloudinary(profileImage); // Upload image and store the URL.
      setIsSuccess(true); // Mark success as true.
      setServerMessage("Image uploaded successfully"); // Update message.
    }

    // Upload citizenship front document if selected
    if (citizenshipFront) {
      citizenshipFrontUrl = await uploadImageToCloudinary(citizenshipFront);
    }

    // Upload citizenship back document if selected
    if (citizenshipBack) {
      citizenshipBackUrl = await uploadImageToCloudinary(citizenshipBack);
    }

    const requestBody = {
      name,
      email,
      password,
      phone,
      address,
      city,
      state,
      country,
      zipCode,
      bio,
      permanentAddresses,
      profileImage: imageUrl,
      motherName,
      fatherName,
      citizenshipNumber,
      district,
      citizenshipFront: citizenshipFrontUrl || citizenshipFrontPreview,
      citizenshipBack: citizenshipBackUrl || citizenshipBackPreview,
    };

    const response = await fetch('/api/user/profile', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();
    if (!response.ok) {
      setIsSuccess(false);
      setServerMessage(data?.err);
    } else {
      setIsSuccess(true);
      setServerMessage(data?.msg);
      setPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <>
      <Box
        sx={{
          backgroundImage: "url(/images/pic2.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          width: "100%",
          height: "100vh",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 4,
            maxWidth: 1200,
            margin: "0 auto",
            overflow: "hidden",
            backgroundColor: "rgba(31,15,15,0.6)",
            marginTop: "29px",
            padding: "40px",
            color: "white",
          }}
        >
          {/* Left Side - Profile Image */}
          <Box
            sx={{
              order: { xs: 2, sm: 1 },
              flex: { xs: "none", sm: 0.5 },
              textAlign: "center",
            }}
          >
            {profileImagePreview && (
              <Box mt={2} textAlign="center">
                <div className="image-container">
                  <Avatar alt="admin" 
                   src={profileImagePreview} 
                   sx={{ width: 250, height: 250, margin: "0 auto", mb: 3 }}
                   />
                </div>
              </Box>
            )}
            <Button
              variant="contained"
              component="label"
              fullWidth
              sx={{
                backgroundColor: "#8A12FC",
                mb: 2,
                "&:hover": {
                  backgroundColor: "#7a0ddb",
                }
              }}
            >
              📷 Upload Photo
              <input type="file" hidden onChange={handleImageChange} />
            </Button>
          </Box>

          {/* Right Side - Form Fields */}
          <Box
            sx={{
              order: { xs: 1, sm: 2 },
              flex: { xs: 1, sm: 1.5 },
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
              Update Profile
            </Typography>

            {serverMessage && (
              <Alert severity={isSuccess ? "success" : "error"}>
                {serverMessage}
              </Alert>
            )}

            {/* Section 0: Identity Information */}
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, borderBottom: "2px solid #8A12FC", pb: 1 }}>
                पहिचान जानकारी
              </Typography>
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
                <TextField
                  label="आमाको नाम (Mother's Name)"
                  variant="outlined"
                  value={motherName}
                  onChange={(e) => setMotherName(e.target.value)}
                  fullWidth
                  InputLabelProps={{ style: { color: "#8A12FC" } }}
                  sx={{
                    input: { color: "white" },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#8A12FC" },
                      "&:hover fieldset": { borderColor: "#8A12FC" },
                      "&.Mui-focused fieldset": { borderColor: "#8A12FC" },
                    },
                  }}
                />
                <TextField
                  label="बुबाको नाम (Father's Name)"
                  variant="outlined"
                  value={fatherName}
                  onChange={(e) => setFatherName(e.target.value)}
                  fullWidth
                  InputLabelProps={{ style: { color: "#8A12FC" } }}
                  sx={{
                    input: { color: "white" },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#8A12FC" },
                      "&:hover fieldset": { borderColor: "#8A12FC" },
                      "&.Mui-focused fieldset": { borderColor: "#8A12FC" },
                    },
                  }}
                />
                <TextField
                  label="ना. प्र. न. (Citizenship Number)"
                  variant="outlined"
                  value={citizenshipNumber}
                  onChange={(e) => setCitizenshipNumber(e.target.value)}
                  fullWidth
                  InputLabelProps={{ style: { color: "#8A12FC" } }}
                  sx={{
                    input: { color: "white" },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#8A12FC" },
                      "&:hover fieldset": { borderColor: "#8A12FC" },
                      "&.Mui-focused fieldset": { borderColor: "#8A12FC" },
                    },
                  }}
                />
                <TextField
                  label="जिल्ला (District)"
                  variant="outlined"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  fullWidth
                  InputLabelProps={{ style: { color: "#8A12FC" } }}
                  sx={{
                    input: { color: "white" },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#8A12FC" },
                      "&:hover fieldset": { borderColor: "#8A12FC" },
                      "&.Mui-focused fieldset": { borderColor: "#8A12FC" },
                    },
                  }}
                />
              </Box>

              {/* Citizenship Documents */}
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2, mt: 2 }}>
                <Box>
                  <Typography variant="body2" sx={{ color: "#8A12FC", fontWeight: 600, mb: 1 }}>
                    📎 नागरिकताको प्रतिलिपि (अगाडि) - Citizenship Front
                  </Typography>
                  {citizenshipFrontPreview && (
                    <Box sx={{ mb: 2, border: "1px solid #8A12FC", borderRadius: "4px", p: 1 }}>
                      <img src={citizenshipFrontPreview} alt="Citizenship Front" style={{ width: "100%", borderRadius: "4px" }} />
                    </Box>
                  )}
                  <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                    sx={{
                      borderColor: "#8A12FC",
                      color: "#8A12FC",
                      "&:hover": {
                        borderColor: "#7a0ddb",
                        color: "#7a0ddb",
                      }
                    }}
                  >
                    Upload Front
                    <input type="file" hidden onChange={handleCitizenshipFrontChange} />
                  </Button>
                </Box>

                <Box>
                  <Typography variant="body2" sx={{ color: "#8A12FC", fontWeight: 600, mb: 1 }}>
                    📎 नागरिकताको प्रतिलिपि (पछाडि) - Citizenship Back
                  </Typography>
                  {citizenshipBackPreview && (
                    <Box sx={{ mb: 2, border: "1px solid #8A12FC", borderRadius: "4px", p: 1 }}>
                      <img src={citizenshipBackPreview} alt="Citizenship Back" style={{ width: "100%", borderRadius: "4px" }} />
                    </Box>
                  )}
                  <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                    sx={{
                      borderColor: "#8A12FC",
                      color: "#8A12FC",
                      "&:hover": {
                        borderColor: "#7a0ddb",
                        color: "#7a0ddb",
                      }
                    }}
                  >
                    Upload Back
                    <input type="file" hidden onChange={handleCitizenshipBackChange} />
                  </Button>
                </Box>
              </Box>
            </Box>

            {/* Section 1: Basic Information */}
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, borderBottom: "2px solid #8A12FC", pb: 1 }}>
                व्यक्तिगत जानकारी
              </Typography>
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
                <TextField
                  label="Name"
                  variant="outlined"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  error={!!errors.name}
                  helperText={errors.name}
                  fullWidth
                  InputLabelProps={{ style: { color: "#8A12FC" } }}
                  sx={{
                    input: { color: "white" },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#8A12FC" },
                      "&:hover fieldset": { borderColor: "#8A12FC" },
                      "&.Mui-focused fieldset": { borderColor: "#8A12FC" },
                    },
                  }}
                />
                <TextField
                  label="Email"
                  variant="outlined"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={!!errors.email}
                  helperText={errors.email}
                  fullWidth
                  InputLabelProps={{ style: { color: "#8A12FC" } }}
                  sx={{
                    input: { color: "white" },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#8A12FC" },
                      "&:hover fieldset": { borderColor: "#8A12FC" },
                      "&.Mui-focused fieldset": { borderColor: "#8A12FC" },
                    },
                  }}
                />
                <TextField
                  label="Phone"
                  variant="outlined"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  fullWidth
                  InputLabelProps={{ style: { color: "#8A12FC" } }}
                  sx={{
                    input: { color: "white" },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#8A12FC" },
                      "&:hover fieldset": { borderColor: "#8A12FC" },
                      "&.Mui-focused fieldset": { borderColor: "#8A12FC" },
                    },
                  }}
                />
              </Box>
            </Box>

            {/* Section 2: Address Information */}
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, borderBottom: "2px solid #8A12FC", pb: 1 }}>
                ठेगाना जानकारी
              </Typography>
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
                <TextField
                  label="Address"
                  variant="outlined"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  fullWidth
                  multiline
                  rows={2}
                  InputLabelProps={{ style: { color: "#8A12FC" } }}
                  sx={{
                    input: { color: "white" },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#8A12FC" },
                      "&:hover fieldset": { borderColor: "#8A12FC" },
                      "&.Mui-focused fieldset": { borderColor: "#8A12FC" },
                    },
                  }}
                />
                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                  <TextField
                    label="City"
                    variant="outlined"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    fullWidth
                    InputLabelProps={{ style: { color: "#8A12FC" } }}
                    sx={{
                      input: { color: "white" },
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "#8A12FC" },
                        "&:hover fieldset": { borderColor: "#8A12FC" },
                        "&.Mui-focused fieldset": { borderColor: "#8A12FC" },
                      },
                    }}
                  />
                  <TextField
                    label="State"
                    variant="outlined"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    fullWidth
                    InputLabelProps={{ style: { color: "#8A12FC" } }}
                    sx={{
                      input: { color: "white" },
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "#8A12FC" },
                        "&:hover fieldset": { borderColor: "#8A12FC" },
                        "&.Mui-focused fieldset": { borderColor: "#8A12FC" },
                      },
                    }}
                  />
                </Box>
              </Box>
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2, mt: 2 }}>
                <TextField
                  label="Country"
                  variant="outlined"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  fullWidth
                  InputLabelProps={{ style: { color: "#8A12FC" } }}
                  sx={{
                    input: { color: "white" },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#8A12FC" },
                      "&:hover fieldset": { borderColor: "#8A12FC" },
                      "&.Mui-focused fieldset": { borderColor: "#8A12FC" },
                    },
                  }}
                />
                <TextField
                  label="Zip Code"
                  variant="outlined"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  fullWidth
                  InputLabelProps={{ style: { color: "#8A12FC" } }}
                  sx={{
                    input: { color: "white" },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#8A12FC" },
                      "&:hover fieldset": { borderColor: "#8A12FC" },
                      "&.Mui-focused fieldset": { borderColor: "#8A12FC" },
                    },
                  }}
                />
              </Box>
            </Box>

            {/* Section 3: Bio */}
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, borderBottom: "2px solid #8A12FC", pb: 1 }}>
                अतिरिक्त जानकारी
              </Typography>
              <TextField
                label="Bio"
                variant="outlined"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                fullWidth
                multiline
                rows={3}
                placeholder="Tell us about yourself@."
                InputLabelProps={{ style: { color: "#8A12FC" } }}
                sx={{
                  input: { color: "white" },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#8A12FC" },
                    "&:hover fieldset": { borderColor: "#8A12FC" },
                    "&.Mui-focused fieldset": { borderColor: "#8A12FC" },
                  },
                }}
              />
            </Box>

            {/* Section 4: Security */}
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, borderBottom: "2px solid #8A12FC", pb: 1 }}>
                सुरक्षा
              </Typography>
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
                <TextField
                  label="Password"
                  variant="outlined"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={!!errors.password}
                  helperText={errors.password}
                  fullWidth
                  InputLabelProps={{ style: { color: "#8A12FC" } }}
                  sx={{
                    input: { color: "white" },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#8A12FC" },
                      "&:hover fieldset": { borderColor: "#8A12FC" },
                      "&.Mui-focused fieldset": { borderColor: "#8A12FC" },
                    },
                  }}
                />
                <TextField
                  label="Confirm Password"
                  type="password"
                  variant="outlined"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                  fullWidth
                  InputLabelProps={{ style: { color: "#8A12FC" } }}
                  sx={{
                    input: { color: "white" },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#8A12FC" },
                      "&:hover fieldset": { borderColor: "#8A12FC" },
                      "&.Mui-focused fieldset": { borderColor: "#8A12FC" },
                    },
                  }}
                />
              </Box>
            </Box>

            {/* Section 5: Permanent Address */}
            <Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, borderBottom: "2px solid #8A12FC", pb: 1 }}>
                  स्थायी ठेगाना
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleAddAddressClick}
                  sx={{ backgroundColor: "#8A12FC", textTransform: "none" }}
                >
                  + Add Address
                </Button>
              </Box>

              {/* Address List */}
              {permanentAddresses.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  {permanentAddresses.map((addr, index) => (
                    <Box
                      key={index}
                      sx={{
                        background: "rgba(138, 18, 252, 0.1)",
                        border: "1px solid #8A12FC",
                        borderRadius: "8px",
                        p: 2,
                        mb: 1,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Box>
                        <Typography sx={{ color: "white", fontWeight: 600 }}>
                          {addr.municipality}, {addr.district}
                        </Typography>
                        <Typography sx={{ color: "#ccc", fontSize: "0.9rem" }}>
                          Ward {addr.ward} • {addr.addressType}
                          {addr.isDefault && " • Default"}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Button
                          size="small"
                          onClick={() => handleEditAddress(index)}
                          sx={{ color: "#8A12FC" }}
                        >
                          Edit
                        </Button>
                        <Button
                          size="small"
                          onClick={() => handleDeleteAddress(index)}
                          sx={{ color: "#c4243e" }}
                        >
                          Delete
                        </Button>
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}

              {/* Address Form Modal */}
              {showAddressForm && (
                <Box sx={{ background: "rgba(138, 18, 252, 0.1)", border: "2px solid #8A12FC", borderRadius: "8px", p: 2, mb: 2 }}>
                  <Typography sx={{ color: "white", fontWeight: 600, mb: 2 }}>
                    {currentAddressIndex !== null ? "Edit Address" : "Add New Address"}
                  </Typography>
                  <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
                    <TextField
                      label="Province"
                      name="province"
                      value={addressForm.province}
                      onChange={handleAddressFormChange}
                      fullWidth
                      InputLabelProps={{ style: { color: "#8A12FC" } }}
                      sx={{
                        input: { color: "white" },
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": { borderColor: "#8A12FC" },
                          "&:hover fieldset": { borderColor: "#8A12FC" },
                          "&.Mui-focused fieldset": { borderColor: "#8A12FC" },
                        },
                      }}
                    />
                    <TextField
                      label="District"
                      name="district"
                      value={addressForm.district}
                      onChange={handleAddressFormChange}
                      fullWidth
                      InputLabelProps={{ style: { color: "#8A12FC" } }}
                      sx={{
                        input: { color: "white" },
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": { borderColor: "#8A12FC" },
                          "&:hover fieldset": { borderColor: "#8A12FC" },
                          "&.Mui-focused fieldset": { borderColor: "#8A12FC" },
                        },
                      }}
                    />
                    <TextField
                      label="Municipality"
                      name="municipality"
                      value={addressForm.municipality}
                      onChange={handleAddressFormChange}
                      fullWidth
                      InputLabelProps={{ style: { color: "#8A12FC" } }}
                      sx={{
                        input: { color: "white" },
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": { borderColor: "#8A12FC" },
                          "&:hover fieldset": { borderColor: "#8A12FC" },
                          "&.Mui-focused fieldset": { borderColor: "#8A12FC" },
                        },
                      }}
                    />
                    <TextField
                      label="Ward"
                      name="ward"
                      value={addressForm.ward}
                      onChange={handleAddressFormChange}
                      fullWidth
                      InputLabelProps={{ style: { color: "#8A12FC" } }}
                      sx={{
                        input: { color: "white" },
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": { borderColor: "#8A12FC" },
                          "&:hover fieldset": { borderColor: "#8A12FC" },
                          "&.Mui-focused fieldset": { borderColor: "#8A12FC" },
                        },
                      }}
                    />
                    <TextField
                      label="Street Address"
                      name="streetAddress"
                      value={addressForm.streetAddress}
                      onChange={handleAddressFormChange}
                      fullWidth
                      multiline
                      rows={2}
                      InputLabelProps={{ style: { color: "#8A12FC" } }}
                      sx={{
                        input: { color: "white" },
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": { borderColor: "#8A12FC" },
                          "&:hover fieldset": { borderColor: "#8A12FC" },
                          "&.Mui-focused fieldset": { borderColor: "#8A12FC" },
                        },
                      }}
                    />
                    <TextField
                      label="City"
                      name="city"
                      value={addressForm.city}
                      onChange={handleAddressFormChange}
                      fullWidth
                      InputLabelProps={{ style: { color: "#8A12FC" } }}
                      sx={{
                        input: { color: "white" },
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": { borderColor: "#8A12FC" },
                          "&:hover fieldset": { borderColor: "#8A12FC" },
                          "&.Mui-focused fieldset": { borderColor: "#8A12FC" },
                        },
                      }}
                    />
                    <TextField
                      label="Zip Code"
                      name="zipCode"
                      value={addressForm.zipCode}
                      onChange={handleAddressFormChange}
                      fullWidth
                      InputLabelProps={{ style: { color: "#8A12FC" } }}
                      sx={{
                        input: { color: "white" },
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": { borderColor: "#8A12FC" },
                          "&:hover fieldset": { borderColor: "#8A12FC" },
                          "&.Mui-focused fieldset": { borderColor: "#8A12FC" },
                        },
                      }}
                    />
                  </Box>
                  <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                    <Button
                      onClick={handleSaveAddress}
                      variant="contained"
                      sx={{ backgroundColor: "#8A12FC", flex: 1 }}
                    >
                      Save Address
                    </Button>
                    <Button
                      onClick={() => setShowAddressForm(false)}
                      variant="outlined"
                      sx={{ borderColor: "#8A12FC", color: "#8A12FC", flex: 1 }}
                    >
                      Cancel
                    </Button>
                  </Box>
                </Box>
              )}
            </Box>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                color: "white",
                backgroundColor: "#c4243e",
                padding: "12px",
                fontSize: "1.1rem",
                fontWeight: 600,
                "&:hover": {
                  backgroundColor: "#a21c34",
                }
              }}
            >
              ✓ प्रोफाइल अपडेट गर्नुहोस्
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Profile;
