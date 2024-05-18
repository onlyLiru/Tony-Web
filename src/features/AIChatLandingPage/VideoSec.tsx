function VideoSec() {
  return (
    <div className=" overflow-hidden bg-[url(/images/aiLandingPage/bg.png)] bg-cover">
      <div className="w-[1440px] mx-auto">
        <div className="flex justify-center items-center w-full p-4">
          <video
            className="shadow-2xl"
            controls
            autoPlay
            muted
            loop
            style={{ boxShadow: '0 0 60px rgba(0,0,0,1)' }}
          >
            <source
              src="/images/aiLandingPage/20240129-093432.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  );
}

export default VideoSec;
