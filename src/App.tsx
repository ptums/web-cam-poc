/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useRef, useEffect, useState, useCallback } from "react";
import Webcam from "react-webcam";

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user",
};

function App() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const webcamRef = useRef<null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [imageSrcWebcam, setImageSrcWebcam] = useState<string>("");
  const [imageSrcBrowserCam, setImageSrcBrowserCam] = useState<string>("");

  const webCamCapture = useCallback(() => {
    if (webcamRef.current) {
      //@ts-ignore
      const imageSrc = webcamRef.current.getScreenshot();
      setImageSrcWebcam(imageSrc);
    }
  }, [webcamRef]);

  const browserCamCapture = useCallback(() => {
    const canvas = canvasRef.current as HTMLCanvasElement;
    const video = videoRef.current as HTMLVideoElement;

    canvas
      ?.getContext("2d")
      ?.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageUrl = canvas.toDataURL("image/png");
    setImageSrcBrowserCam(imageUrl);
  }, [canvasRef, videoRef]);

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
        <Webcam
          audio={false}
          height={720}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width={1280}
          videoConstraints={videoConstraints}
        />
        <button
          onClick={webCamCapture}
          className="bg-orange-400 hover:bg-orange-500 text-center text-white p-2 rounded my-8"
        >
          Capture
        </button>
        {imageSrcWebcam && (
          <div className="rounded bg-gray-300 p-6 w-full my-8">
            <p
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {imageSrcWebcam}
            </p>
          </div>
        )}
      </div>
      <div className="w-1/2">
        <h1 className="mb-6 font-bold text-4xl text-center">
          Media Devices & Get User Media Example
        </h1>
        <video ref={videoRef} autoPlay />
        <button
          onClick={browserCamCapture}
          className="bg-orange-400 hover:bg-orange-500 text-center text-white p-2 rounded my-8"
        >
          Capture
        </button>
        {imageSrcBrowserCam && (
          <div className="rounded bg-gray-300 p-6 w-full my-8">
            <p
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {imageSrcBrowserCam}
            </p>
          </div>
        )}
        <canvas className="hidden" ref={canvasRef}></canvas>
      </div>
    </div>
  );
}

export default App;
