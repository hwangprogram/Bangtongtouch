import React, { ImgHTMLAttributes } from "react";

/** 예시
 * <PfpBox
      size={100}
      src={
        "https://res.klook.com/images/fl_lossy.progressive,q_65/c_fill,w_1295,h_863/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/v6bwf3e8qhdfhrgq7lv3/%EB%91%90%EB%B0%94%EC%9D%B4IMG%EC%9B%94%EB%93%9C%EC%98%A4%EB%B8%8C%EC%96%B4%EB%93%9C%EB%B2%A4%EC%B2%98%ED%8B%B0%EC%BC%93.jpg"
      }
    />
    size height && width 크기 픽셀 단위
    src => 이미지 링크
 */

interface ImgProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "size"> {
  size: number;
  src: string;
  alt?: string;
}

const PfpBox: React.FC<ImgProps> = ({ size, src, alt, ...props }) => {
  const imgSize: React.CSSProperties = {};
  imgSize.width = size;
  imgSize.height = size;
  return (
    <React.Fragment>
      <img
        style={imgSize}
        src={src}
        alt={alt}
        className="rounded-full border"
      />
    </React.Fragment>
  );
};

export default PfpBox;
