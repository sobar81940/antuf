"use client";

import { act, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import CloseIcon from "@mui/icons-material/Close";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import loginModalStyles from "./modalStyles";
import { Divider, IconButton, TextField } from "@mui/material";
import { toast } from "react-toastify";
import ReCAPTCHA from "react-google-recaptcha";
import { useSession, signIn, signOut } from "next-auth/react";
import GoogleIcon from "@mui/icons-material/Google";
import GitHubIcon from "@mui/icons-material/GitHub";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

const CaptchaProtectionPopup = () => {
  const [hovered, setHovered] = useState(false);

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 20,
        right: 20,
        backgroundColor: "rgb(33, 179, 255)",
        color: "#fff",
        padding: "10px 20px",
        borderRadius: "5px",
        zIndex: 9999, // Ensure it's on top
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzHPIg1vi9om7i-Uo1drOVBBytptqaXrqtZWr8Q_PGyWsmTy2QSUSrOGd9S27Ma3fNroA&usqp=CAU"
        alt="reCAPTCHA logo"
        style={{ height: "60px", padding: "10px 10px" }}
      />
      protected by Google reCAPTCHA.
      {hovered && (
        <Typography variant="body2" sx={{ marginTop: 1 }}>
          <a
            href="https://policies.google.com/privacy?hl=en"
            style={{ color: "#fff" }}
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy Policy
          </a>
        </Typography>
      )}
    </Box>
  );
};

const LoginModal = ({ open, handleClose }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    organization: "",
  });

  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // This function validates the Register form to make sure all required fields are filled out and are correct
  const validateForm = () => {
    const errors: Record<string, string> = {}; // Create an empty object to store validation error messages

    // Check if 'name' field is not empty
    if (!form.name) errors.name = "Name is required";

    // Check if 'email' field is not empty and matches a valid email format using regex
    if (!form.email) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      // Regular expression to check if email format is valid
      errors.email = "Invalid email format";

    // Check if 'password' field is not empty and has at least 6 characters
    if (!form.password) errors.password = "Password is required";
    else if (form.password.length < 6)
      // Minimum password length validation
      errors.password = "Password must be at least 6 characters";

    // If we're on the 'Sign Up' tab (activeTab === 1), check if the 'organization' field is filled
    if (activeTab === 1 && !form.organization)
      errors.organization = "Organization is required";
    if (activeTab === 1 && !recaptchaToken)
      errors.recaptcha = "Please complete the reCaptcha";

    return errors; // Return the errors object, which contains any validation errors
  };

  const validateLoginForm = () => {
    const errors: Record<string, string> = {}; // Create an empty object to store validation error messages

    // Check if 'email' field is not empty and matches a valid email format using regex
    if (!form.email) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      // Regular expression to check if email format is valid
      errors.email = "Invalid email format";

    // Check if 'password' field is not empty
    if (!form.password) errors.password = "Password is required";

    return errors; // Return the errors object, which contains any validation errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const data = { ...form, recaptchaToken };
      const response = await fetch('/api/register', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (response.ok) {
        toast.success(result.msg);
        handleClose();
      } else {
        toast.error(result?.err);
      }
    } catch (e) {
      console.error('Signup error:', e);
      toast.error("Error connecting to the server");
    } finally {
      setLoading(false);
    }
  };

  // This function handles the form submission for login (Sign In)
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission to handle it manually

    // Validate the Login form before submitting
    const validationErrors = validateLoginForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors); // Update errors state if validation fails
      return; // Stop further execution if the form is invalid
    }

    setLoading(true); // Set loading state to true to indicate that the login process is ongoing

    try {
      // Extract the email and password from the form data
      const email = form.email;
      const password = form.password;

      // Check if there's a callbackUrl in the URL params
      const urlParams = new URLSearchParams(window.location.search);
      const callbackUrl = urlParams.get('callbackUrl');

      console.log('[Login] Attempting login with callbackUrl:', callbackUrl);

      // Use the 'signIn' function (likely from NextAuth) to attempt logging in
      const result = await signIn("credentials", {
        redirect: false, // Prevent automatic redirect after login
        email,
        password, // Pass the email and password for authentication
        callbackUrl: callbackUrl || '/dashboard', // Pass callbackUrl to NextAuth
      });

      // If the login is unsuccessful, display the error message from the result
      if (!result.ok) {
        console.error('[Login] Login failed:', result?.error);
        toast.error(result?.error);
      } else {
        console.log('[Login] Login successful');
        toast.success("Login successfully"); // Show a success message if login is successful
        setRecaptchaToken(null); // Reset the reCAPTCHA token after successful login
        handleClose(); // Close the login modal or form

        // Redirect based on user role
        // Fetch the session to get user role
        setTimeout(async () => {
          try {
            const sessionRes = await fetch('/api/auth/session');
            const sessionData = await sessionRes.json();

            let finalUrl;
            if (callbackUrl) {
              // If there's a callbackUrl, use it
              finalUrl = callbackUrl.startsWith('/')
                ? `${window.location.origin}${callbackUrl}`
                : callbackUrl;
            } else {
              // Otherwise, redirect based on role
              const isAdmin = sessionData?.user?.role === 'admin' || sessionData?.user?.isAdmin;
              const defaultDashboard = isAdmin ? '/dashboard/admin' : '/dashboard/user';
              finalUrl = `${window.location.origin}${defaultDashboard}`;
            }

            console.log('[Login] Redirecting to:', finalUrl, 'Role:', sessionData?.user?.role);
            window.location.href = finalUrl;
          } catch (error) {
            console.error('[Login] Error fetching session:', error);
            // Fallback to generic dashboard
            window.location.href = `${window.location.origin}/dashboard/user`;
          }
        }, 100);
      }
    } catch (error) {
      console.error('[Login] Error during login:', error);
      toast.error("Error connecting to the server!"); // If there was an error with the login request, show an error message
    } finally {
      setLoading(false); // Set loading state to false when the login process is complete
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={loginModalStyles.modalBox}>
        <Box sx={loginModalStyles.modalHeader}>
          <Typography variant="h6" sx={loginModalStyles.title}>
            Please Login To Continue
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Tabs
          value={activeTab}
          onChange={(e, value) => setActiveTab(value)}
          centered
          sx={loginModalStyles.tabs}
        >
          <Tab label="Sign In" />
          <Tab label="Sign Up" />
        </Tabs>

        <form
          onSubmit={(e) => {
            activeTab === 1 ? handleSubmit(e) : handleLogin(e);
          }}
        >
          {activeTab === 1 && (
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              margin="normal"
            />
          )}

          <TextField
            fullWidth
            label="E-Mail"
            name="email"
            value={form.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
            margin="normal"
          />
          {activeTab === 1 && (
            <TextField
              fullWidth
              label="Institution / Organization"
              name="organization"
              value={form.organization}
              onChange={handleChange}
              error={!!errors.organization}
              helperText={errors.organization}
              margin="normal"
            />
          )}

          {activeTab === 1 && (
            <ReCAPTCHA
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}
              onChange={setRecaptchaToken}
            />
          )}

          {activeTab === 1 && errors.recaptcha && (
            <p style={{ color: "red" }}>{errors.recaptcha}</p>
          )}

          <Button
            fullWidth
            variant="contained"
            type="submit"
            sx={loginModalStyles.button}
            disabled={loading}
          >
            {loading
              ? activeTab === 0
                ? "Signing In..."
                : "Signing Up..."
              : activeTab === 0
                ? "Sign In"
                : "Sign Up"}
          </Button>
        </form>
        <Divider sx={{ my: 2 }}>or</Divider>

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
          <Button
            variant="outlined"
            startIcon={<GoogleIcon />}
            sx={{ textTransform: "none", color: "#fff" }}
            fullWidth
            style={{ marginRight: "8px", backgroundColor: "red" }}
            onClick={() => signIn("google")}
          >
            Log In with Google
          </Button>
          <Button
            variant="outlined"
            startIcon={<FacebookIcon />}
            sx={{ textTransform: "none", color: "#fff" }}
            fullWidth
            style={{ marginRight: "8px", backgroundColor: "blue" }}
            onClick={() => signIn("facebook")}
          >
            Log In with Facebook
          </Button>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
          <Button
            variant="outlined"
            startIcon={<LinkedInIcon />}
            sx={{ textTransform: "none", color: "#fff" }}
            fullWidth
            style={{ marginRight: "8px", backgroundColor: "blue" }}
            onClick={() => signIn("linkedin")}
          >
            Log In with LinkedIn
          </Button>
          <Button
            variant="outlined"
            startIcon={<GitHubIcon />}
            sx={{ textTransform: "none", color: "#fff" }}
            fullWidth
            style={{ marginRight: "8px", backgroundColor: "black" }}
            onClick={() => signIn("github")}
          >
            Log In with Github
          </Button>
        </Box>

        <Typography
          variant="body2"
          align="center"
          sx={{
            mt: 1,
            color: "black",
            fontSize: "1rem",
          }}
        >
          By creating this account, you agree to our privacy policy and cookies
        </Typography>
      </Box>
    </Modal>
  );
};

export default LoginModal;
// "use client";

// import { act, useState } from "react";
// import Box from "@mui/material/Box";
// import Button from "@mui/material/Button";
// import Typography from "@mui/material/Typography";
// import Modal from "@mui/material/Modal";
// import CloseIcon from "@mui/icons-material/Close";
// import Tabs from "@mui/material/Tabs";
// import Tab from "@mui/material/Tab";
// import loginModalStyles from "./modalStyles";
// import { Divider, IconButton, TextField } from "@mui/material";
// import { toast } from "react-toastify";
// import ReCAPTCHA from "react-google-recaptcha";
// import { useSession, signIn, signOut } from "next-auth/react";
// import GoogleIcon from "@mui/icons-material/Google";
// import GitHubIcon from "@mui/icons-material/GitHub";
// import FacebookIcon from "@mui/icons-material/Facebook";
// import LinkedInIcon from "@mui/icons-material/LinkedIn";

// const CaptchaProtectionPopup = () => {
//   const [hovered, setHovered] = useState(false);

//   return (
//     <Box
//       sx={{
//         position: "fixed",
//         bottom: 20,
//         right: 20,
//         backgroundColor: "rgb(33, 179, 255)",
//         color: "#fff",
//         padding: "10px 20px",
//         borderRadius: "5px",
//         zIndex: 9999, // Ensure it's on top
//       }}
//       onMouseEnter={() => setHovered(true)}
//       onMouseLeave={() => setHovered(false)}
//     >
//       <img
//         src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzHPIg1vi9om7i-Uo1drOVBBytptqaXrqtZWr8Q_PGyWsmTy2QSUSrOGd9S27Ma3fNroA&usqp=CAU"
//         alt="reCAPTCHA logo"
//         style={{ height: "60px", padding: "10px 10px" }}
//       />
//       protected by Google reCAPTCHA.
//       {hovered && (
//         <Typography variant="body2" sx={{ marginTop: 1 }}>
//           <a
//             href="https://policies.google.com/privacy?hl=en"
//             style={{ color: "#fff" }}
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Privacy Policy
//           </a>
//         </Typography>
//       )}
//     </Box>
//   );
// };

// const LoginModal = ({ open, handleClose }) => {
//   const [activeTab, setActiveTab] = useState(0);
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     password: "",
//     organization: "",
//   });

//   const [recaptchaToken, setRecaptchaToken] = useState(null);
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setForm({
//       ...form,
//       [e.target.name]: e.target.value,
//     });
//   };

//   // This function validates the Register form to make sure all required fields are filled out and are correct
//   const validateForm = () => {
//     const errors = {}; // Create an empty object to store validation error messages

//     // Check if 'name' field is not empty
//     if (!form.name) errors.name = "Name is required";

//     // Check if 'email' field is not empty and matches a valid email format using regex
//     if (!form.email) errors.email = "Email is required";
//     else if (!/\S+@\S+\.\S+/.test(form.email))
//       // Regular expression to check if email format is valid
//       errors.email = "Invalid email format";

//     // Check if 'password' field is not empty and has at least 6 characters
//     if (!form.password) errors.password = "Password is required";
//     else if (form.password.length < 6)
//       // Minimum password length validation
//       errors.password = "Password must be at least 6 characters";

//     // If we're on the 'Sign Up' tab (activeTab === 1), check if the 'organization' field is filled
//     if (activeTab === 1 && !form.organization)
//       errors.organization = "Organization is required";
//     if (activeTab === 1 && !recaptchaToken)
//       errors.recaptcha = "Please complete the reCaptcha";

//     return errors; // Return the errors object, which contains any validation errors
//   };

//   const validateLoginForm = () => {
//     const errors = {}; // Create an empty object to store validation error messages

//     // Check if 'email' field is not empty and matches a valid email format using regex
//     if (!form.email) errors.email = "Email is required";
//     else if (!/\S+@\S+\.\S+/.test(form.email))
//       // Regular expression to check if email format is valid
//       errors.email = "Invalid email format";

//     // Check if 'password' field is not empty
//     if (!form.password) errors.password = "Password is required";

//     return errors; // Return the errors object, which contains any validation errors
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const validationErrors = validateForm();
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }

//     setLoading(true);
//     try {
//       const data = { ...form, recaptchaToken };
//       const response = await fetch(`${process.env.API}/register`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(data),
//       });

//       const result = await response.json();
//       if (response.ok) {
//         toast.success(result.msg);
//         handleClose();
//       } else {
//         toast.error(result?.err);
//       }
//     } catch (e) {
//       toast.error("Error connecting to the server");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // This function handles the form submission for login (Sign In)
//   const handleLogin = async (e) => {
//     e.preventDefault(); // Prevent default form submission to handle it manually

//     // Validate the Login form before submitting
//     const validationErrors = validateLoginForm();
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors); // Update errors state if validation fails
//       return; // Stop further execution if the form is invalid
//     }

//     setLoading(true); // Set loading state to true to indicate that the login process is ongoing

//     try {
//       // Extract the email and password from the form data
//       const email = form.email;
//       const password = form.password;

//       // Use the 'signIn' function (likely from NextAuth) to attempt logging in
//       const result = await signIn("credentials", {
//         redirect: false, // Prevent automatic redirect after login
//         email,
//         password, // Pass the email and password for authentication
//       });

//       // If the login is unsuccessful, display the error message from the result
//       if (!result.ok) {
//         toast.error(result?.error);
//       } else {
//         toast.success("Login successfully"); // Show a success message if login is successful
//         setRecaptchaToken(null); // Reset the reCAPTCHA token after successful login
//         handleClose(); // Close the login modal or form
//       }
//     } catch (error) {
//       toast.error("Error connecting to the server!"); // If there was an error with the login request, show an error message
//     } finally {
//       setLoading(false); // Set loading state to false when the login process is complete
//     }
//   };

//   return (
//     <Modal
//       open={open}
//       onClose={handleClose}
//       aria-labelledby="modal-modal-title"
//       aria-describedby="modal-modal-description"
//     >
//       <Box sx={loginModalStyles.modalBox}>
//         <Box sx={loginModalStyles.modalHeader}>
//           <Typography variant="h6" sx={loginModalStyles.title}>
//             Please Login To Continue
//           </Typography>
//           <IconButton onClick={handleClose}>
//             <CloseIcon />
//           </IconButton>
//         </Box>

//         <Tabs
//           value={activeTab}
//           onChange={(e, value) => setActiveTab(value)}
//           centered
//           sx={loginModalStyles.tabs}
//         >
//           <Tab label="Sign In" />
//           <Tab label="Sign Up" />
//         </Tabs>

//         <form
//           onSubmit={(e) => {
//             activeTab === 1 ? handleSubmit(e) : handleLogin(e);
//           }}
//         >
//           {activeTab === 1 && (
//             <TextField
//               fullWidth
//               label="Name"
//               name="name"
//               value={form.name}
//               onChange={handleChange}
//               error={!!errors.name}
//               helperText={errors.name}
//               margin="normal"
//             />
//           )}

//           <TextField
//             fullWidth
//             label="E-Mail"
//             name="email"
//             value={form.email}
//             onChange={handleChange}
//             error={!!errors.email}
//             helperText={errors.email}
//             margin="normal"
//           />

//           <TextField
//             fullWidth
//             label="Password"
//             type="password"
//             name="password"
//             value={form.password}
//             onChange={handleChange}
//             error={!!errors.password}
//             helperText={errors.password}
//             margin="normal"
//           />
//           {activeTab === 1 && (
//             <TextField
//               fullWidth
//               label="Institution / Organization"
//               name="organization"
//               value={form.organization}
//               onChange={handleChange}
//               error={!!errors.organization}
//               helperText={errors.organization}
//               margin="normal"
//             />
//           )}

//           {activeTab === 1 && (
//             <ReCAPTCHA
//               sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}
//               onChange={setRecaptchaToken}
//             />
//           )}

//           {activeTab === 1 && errors.recaptcha && (
//             <p style={{ color: "red" }}>{errors.recaptcha}</p>
//           )}

//           <Button
//             fullWidth
//             variant="contained"
//             type="submit"
//             sx={loginModalStyles.button}
//             disabled={loading}
//           >
//             {loading
//               ? activeTab === 0
//                 ? "Signing In..."
//                 : "Signing Up..."
//               : activeTab === 0
//               ? "Sign In"
//               : "Sign Up"}
//           </Button>
//         </form>
//         <Divider sx={{ my: 2 }}>or</Divider>

//         <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
//           <Button
//             variant="outlined"
//             startIcon={<GoogleIcon />}
//             sx={{ textTransform: "none", color: "#fff" }}
//             fullWidth
//             style={{ marginRight: "8px", backgroundColor: "red" }}
//             onClick={() => signIn("google")}
//           >
//             Log In with Google
//           </Button>
//           <Button
//             variant="outlined"
//             startIcon={<FacebookIcon />}
//             sx={{ textTransform: "none", color: "#fff" }}
//             fullWidth
//             style={{ marginRight: "8px", backgroundColor: "blue" }}
//             onClick={() => signIn("facebook")}
//           >
//             Log In with Facebook
//           </Button>
//         </Box>
//         <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
//           <Button
//             variant="outlined"
//             startIcon={<LinkedInIcon />}
//             sx={{ textTransform: "none", color: "#fff" }}
//             fullWidth
//             style={{ marginRight: "8px", backgroundColor: "blue" }}
//             onClick={() => signIn("linkedin")}
//           >
//             Log In with LinkedIn
//           </Button>
//           <Button
//             variant="outlined"
//             startIcon={<GitHubIcon />}
//             sx={{ textTransform: "none", color: "#fff" }}
//             fullWidth
//             style={{ marginRight: "8px", backgroundColor: "black" }}
//             onClick={() => signIn("github")}
//           >
//             Log In with Github
//           </Button>
//         </Box>

//         <Typography
//           variant="body2"
//           align="center"
//           sx={{
//             mt: 1,
//             color: "black",
//             fontSize: "1rem",
//           }}
//         >
//           By creating this account, you agree to our privacy policy and cookies
//         </Typography>
//       </Box>
//     </Modal>
//   );
// };

// export default LoginModal;
