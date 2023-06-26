import React, { useRef, useEffect } from "react";
import Webcam from "react-webcam";

function App() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const enableCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
      }
    };

    enableCamera();

    return () => {
      // Clean up the video stream when the component is unmounted
      if (videoRef.current) {
        const stream = videoRef.current.srcObject as MediaStream;
        const tracks = stream?.getTracks();

        tracks?.forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    };
  }, []);

  return (
    <div className="mx-auto py-12 max-w-screen-2xl flex flex-col justify-between items-center">
      <div className="w-1/2 mb-12">
        <h1 className="mb-6 font-bold text-4xl text-center">
          React Webcam Example
        </h1>
        <Webcam />
      </div>
      <div className="w-1/2">
        <h1 className="mb-6 font-bold text-4xl text-center">
          Media Devices & Get User Media Example
        </h1>
        <video ref={videoRef} autoPlay />
      </div>
    </div>
  );
}

export default App;
