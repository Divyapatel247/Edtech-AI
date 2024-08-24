import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
// http://localhost:3000/api/upload/getvideos

const VideoLink = () => {
  const [videoLink, SetVideoLink] = useState([]);
  const [copied, setCopied] = useState(false);
  const [currentKey, setCurrentKey] = useState("");
  const inputRef = useRef(null);
  const getLinks = async () => {
    const url = await axios.get("http://localhost:3000/api/db/videos", {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    // SetVideoLink(url.data);
    const DbVideos = url.data;
    console.log("DB videos:", DbVideos);
    // SetVideoLink(DbVideos.key);
    // SetVideoLink(url.data.subfolderKeys);
    // console.log(url.data.subfolderKeys);
    const data = await axios.get("http://localhost:3000/api/upload/getvideos", {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    const ProcessedVideo = data.data.subfolderKeys;
    console.log("processed video:", ProcessedVideo);

    const updatedVideoLinks = DbVideos.map((key) => {
      return {
        key: key,
        flag: ProcessedVideo.includes(key),
      };
    });
    SetVideoLink(updatedVideoLinks);

    // SetVideoLink(data.data.subfolderKeys);
  };
  useEffect(() => {
    getLinks();
    // console.log("videoLink:", videoLink);
  }, []);
  useEffect(() => {
    console.log("Updated videoLink:", videoLink);
  }, [videoLink]);

  const copyToClipboard = async (key) => {
    try {
      await navigator.clipboard.writeText(key);
      setCopied(true);
      setCurrentKey(key);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };
  //   const style1 = "inline-flex items-center m-2 justify-center flex-shrink-0 w-10 h-10 text-blue-500 bg-blue-100 rounded-3xl dark:bg-blue-800 dark:text-blue-200"
  //  const style2 = "inline-flex items-center m-2 justify-center flex-shrink-0 w-10 h-10 text-blue-500 bg-blue-100 rounded-3xl dark:bg-blue-800 dark:text-blue-200 "
  return (
    <div className="">
      {videoLink.map((link) => (
        <div
          key={link.key}
          id="toast-default"
          className="flex justify-between items-center w-full h-16 m-2 px-3 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400  dark:bg-gray-900 border border-gray-300 "
          role="alert"
        >
          {link.flag ? (
            <span className="w-2 h-2 me-2 p-2 bg-green-500 rounded-full"></span>
          ) : (
            <span className="w-2 h-2 me-2 p-2 bg-orange-500 rounded-full"></span>
          )}

          <Link
            className={link.flag ? "" : "pointer-events-none opacity-30"}
            to={`/video/?key=${link.key}`}
          >
            <div className="inline-flex items-center m-2 justify-center flex-shrink-0 w-10 h-10 text-blue-500 bg-blue-100 rounded-3xl dark:bg-blue-800 dark:text-blue-200 hover:hover:dark:bg-blue-600">
              <svg
                version="1.1"
                id="Capa_1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 60 60"
                xmlSpace="preserve"
              >
                <g>
                  <path
                    d="M45.563,29.174l-22-15c-0.307-0.208-0.703-0.231-1.031-0.058C22.205,14.289,22,14.629,22,15v30
		c0,0.371,0.205,0.711,0.533,0.884C22.679,45.962,22.84,46,23,46c0.197,0,0.394-0.059,0.563-0.174l22-15
		C45.836,30.64,46,30.331,46,30S45.836,29.36,45.563,29.174z M24,43.107V16.893L43.225,30L24,43.107z"
                  />
                  <path
                    d="M30,0C13.458,0,0,13.458,0,30s13.458,30,30,30s30-13.458,30-30S46.542,0,30,0z M30,58C14.561,58,2,45.439,2,30
		S14.561,2,30,2s28,12.561,28,28S45.439,58,30,58z"
                  />
                </g>
              </svg>
            </div>
          </Link>
          {/* <div className="ms-3 text-sm font-normal "> */}

          <div className="relative w-full mx-2">
            <input
              id="npm-install-copy-button"
              type="text"
              className="col-span-6  bg-gray-50 border border-gray-300 text-gray-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={link.key}
              disabled
              readOnly
              ref={inputRef}
            />
            <button
              onClick={() => copyToClipboard(link.key)}
              className="absolute end-2 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg p-2 inline-flex items-center justify-center"
            >
              {copied && currentKey === link.key ? (
                <span id="success-icon" className="inline-flex items-center">
                  <svg
                    className="w-4 h-4 text-blue-700 dark:text-blue-500"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 16 12"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M1 5.917 5.724 10.5 15 1.5"
                    />
                  </svg>
                </span>
              ) : (
                <span id="default-icon">
                  <svg
                    className="w-5 h-5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 18 20"
                  >
                    <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z" />
                  </svg>
                </span>
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
export default VideoLink;
