import { useLocation } from "react-router-dom";
import VideoPlayer from "../components/VideoPlayer";
import { useRef } from "react";

function Video() {
  //   const query = useQuery();
  const playerRef = useRef(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const key = queryParams.get("key");
  //   const key = query.get("key");
  console.log("key:", key);
  var videoSrc = `https://process-videos-edtechai-247.s3.ap-south-1.amazonaws.com/processed/${key}/index.m3u8`;

  const videoJsOptions = {
    autoplay: false,
    controls: true,
    responsive: true,
    fluid: true,
    sources: [
      {
        src: videoSrc,
        type: "application/x-mpegURL",
      },
    ],
  };

  const handlePlayerReady = (player) => {
    playerRef.current = player;

    // You can handle player events here, for example:
    player.on("waiting", () => {
      console.log("player is waiting");
    });

    player.on("dispose", () => {
      console.log("player will dispose");
    });
  };

  return (
    <>
      <div>
        <VideoPlayer options={videoJsOptions} onReady={handlePlayerReady} />
      </div>
    </>
  );
}

export default Video;
