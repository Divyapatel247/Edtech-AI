import axios from "axios";
import { useRef, useState } from "react";
// import { useState } from "react";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const NewCourse = () => {
  const toastId = useRef(null);

  const success = () => {
    toast.success("success!", {
      position: "top-center",
      autoClose: 4000,
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      transition: Bounce,
    });
  };
  const loading = () => {
    toastId.current = toast.info("🦄 Uploading!", {
      position: "top-center",
      autoClose: false,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      transition: Bounce,
    });
  };
  const [uploading, setUploading] = useState();

  const handleUpload = async (file) => {
    setUploading(loading);
    // setUploading(true);
    if (!file) {
      // Display error message or handle case where no file is selected
      console.error("No file selected.");
      return;
    }

    // await new Promise((resolve) => setTimeout(resolve, 5000));

    const key = `${Date.now()}.mp4`;
    // setCourseThumbnail(key);
    const formData = new FormData();
    formData.append("video", file);
    console.log(formData);

    // const validFileTypes =
    //   "image/jpg" || "image/jpeg" || "image/png" || "video/mp4";
    const validFileTypes = "video/mp4";

    const data = {
      Type: validFileTypes,
      key: key,
    };
    console.log(data);
    const url = await axios.post(
      "http://localhost:3000/api/upload/image",
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(url.data.url);
    const presignedUrl = url.data.url;
    axios
      .put(presignedUrl, file, {
        headers: {
          "Content-Type": "video/*", // Set appropriate content type
          "Content-Length": formData.size, // Important for S3 PUT requests
        },
      })
      .then((response) => {
        console.log("Upload successful:", response);
        toast.dismiss(toastId.current);
        setUploading(success);
        // setUploading(false);
      })
      .catch((error) => {
        console.error("Upload failed:", error);
      });
  };
  // if (uploading) {

  // }

  return (
    <div className="flex justify-center">
      <ToastContainer />
      {uploading}
      <div className="flex items-center justify-center w-3/4 m-5">
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Click to upload</span>
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              SVG, PNG, JPG or GIF (MAX. 800x400px)
            </p>
          </div>
          <input
            id="dropzone-file"
            type="file"
            className="hidden"
            onChange={(e) => {
              handleUpload(e.target.files[0]);
            }}
          />
        </label>
      </div>
    </div>
  );
};
