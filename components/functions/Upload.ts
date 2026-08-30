// Importing the Resizer component to resize images before uploading
import Resizer from "react-image-file-resizer";
// Importing toast from react-toastify for showing success/error messages
import { toast } from "react-toastify";

// This function handles image upload after resizing the image
export const imageUpload = async (file) => {
  // Return a promise that resolves or rejects based on the success of the upload process
  return new Promise((resolve, reject) => {
    // Using the Resizer component to resize the uploaded image
    Resizer.imageFileResizer(
      file, // The image file to be resized
      1280, // The target width of the resized image (1280px)
      720, // The target height of the resized image (720px)
      "JPEG", // Desired format for the image (JPEG)
      100, // Quality of the resized image (100% quality)
      0, // Rotation angle (0 means no rotation)
      async (uri) => {
        // Callback function to execute when resizing is done
        try {
          // Make a POST request to upload the resized image (base64 format)
          const response = await fetch(`${process.env.API}/upload`, {
            method: "POST", // Use POST method
            headers: {
              "Content-Type": "application/json", // Content type is JSON
            },
            body: JSON.stringify({ image: uri }), // Send the resized image as base64 encoded string in the body
          });

          if (response.ok) {
            // Check if the server response is successful (HTTP status 200-299)
            const data = await response.json(); // Parse the response as JSON
            console.log("image upload failed", data); // Debugging message in case of unexpected behavior
            resolve(data?.url); // Resolve the promise with the URL of the uploaded image (from the server's response)
          } else {
            // Reject the promise if the response is not ok (image upload failed)
            reject(new Error("Image upload failed"));
            toast.error("Image upload failed"); // Show an error toast notification
          }
        } catch (error) {
          // Catch any errors during the request and reject the promise
          reject(error);
          toast.error("An unexpected error occurred"); // Show a generic error toast notification
        }
      },
      "base64" // The output type of the resized image is a base64 string
    );
  });
};
