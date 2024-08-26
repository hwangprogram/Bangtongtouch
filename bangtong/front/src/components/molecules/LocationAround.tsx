import React, { useEffect, useState } from "react";

// 컴포넌트

// 데이터

// 이미지 소스
import SearchMap from "./SearchMap";

interface Pos {
  lat: number;
  lng: number;
}

const LocationAround: React.FC<Pos> = ({ lat, lng }) => {
  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);

  const [basePosition, setBasePosition] = useState<Pos>({ lat: 0, lng: 0 });
  useEffect(() => {
    setBasePosition({ lat: 37.5, lng: 127 });
    setBasePosition({ lat: lng, lng: lat });
    setIsDataLoaded(true);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-black">주변 편의시설</h1>
      <div className="mt-5">
        {isDataLoaded ? (
          <SearchMap
            flag={true}
            basePos={basePosition}
            cssClasses="rounded-xl"
          />
        ) : null}
      </div>
    </div>
  );
};

export default LocationAround;
