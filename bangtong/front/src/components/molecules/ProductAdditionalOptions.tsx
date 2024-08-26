import React from "react";

interface Props {
  additionalOptions: Array<any>;
}

const ProductAdditionalOptions: React.FC<Props> = ({ additionalOptions }) => {
  return (
    <React.Fragment>
      <h1 className="text-2xl font-black">추가옵션 (구매가능)</h1>
      <div className="flex flex-wrap text-center mt-5">
        {additionalOptions.length > 0 ? (
          additionalOptions.map((item: any) => (
            <div className="m-2" key={item}>
              <p>{item}</p>
            </div>
          ))
        ) : (
          <p>추가 옵션이 없습니다.</p>
        )}
      </div>
    </React.Fragment>
  );
};

export default ProductAdditionalOptions;
