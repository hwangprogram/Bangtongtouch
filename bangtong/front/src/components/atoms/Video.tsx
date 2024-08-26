// Video.tsx
import React, { forwardRef } from "react";

interface VideoProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  isMuted?: boolean;
}

const Video = forwardRef<HTMLVideoElement, VideoProps>(
  ({ isMuted = false, ...props }, ref) => {
    return <Video ref={ref} muted={isMuted} playsInline {...props} />;
  },
);

Video.displayName = "Video";

export default Video;
