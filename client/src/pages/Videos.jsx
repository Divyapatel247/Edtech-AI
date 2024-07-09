import { useRef } from "react";
import VideoPlayer from "../components/VideoPlayer";

function Videos() {
  var videoSrc =
    "https://process-videos-edtechai-247.s3.ap-south-1.amazonaws.com/processed/1720104453739/index.m3u8";

  const playerRef = useRef(null);

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

export default Videos;
