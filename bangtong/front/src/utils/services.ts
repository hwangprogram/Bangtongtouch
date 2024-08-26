import jsonp from "jsonp";

export const getUserAddressNum = (addr: string): Promise<Array<number>> => {
  return new Promise((resolve, reject) => {
    jsonp(
      `https://api.vworld.kr/req/address?service=address&request=getcoord&version=2.0&address=${addr}&refine=false&simple=false&type=road&key=${process.env.REACT_APP_SEARCH_API}`,
      { param: "callback" },
      (err: any, data: any) => {
        if (err) {
          console.error("Error:", err);
          reject(err);
        } else {
          const address: Array<number> = [];
          address.push(data.response.result.point.x);
          address.push(data.response.result.point.y);
          resolve(address);
        }
      }
    );
  });
};

export const getUserAddressNum2 = (addr: string): Promise<Array<number>> => {
  return new Promise((resolve, reject) => {
    jsonp(
      `https://api.vworld.kr/req/address?service=address&request=getcoord&version=2.0&address=${addr}&simple=false&type=parcel&key=${process.env.REACT_APP_SEARCH_API}`,
      { param: "callback" },
      (err: any, data: any) => {
        if (err) {
          console.error("Error:", err);
          reject(err);
        } else {
          const address: Array<number> = [];
          address.push(data.response.result.point.x);
          address.push(data.response.result.point.y);
          resolve(address);
        }
      }
    );
  });
};

export const getUserAddressKr = (): Promise<Array<string>> => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        jsonp(
          `https://api.vworld.kr/req/address?service=address&request=getAddress&version=2.0&point=${position.coords.longitude},${position.coords.latitude}&simple=false&type=BOTH&key=${process.env.REACT_APP_SEARCH_API}`,
          { param: "callback" },
          (err: any, data: any) => {
            if (err) {
              console.error("Error:", err);
              reject(err);
            } else {
              const str: string = data.response.result[0].text;
              const strArray: Array<string> = str.split(" ");
              const returnArray: Array<string> = [];
              returnArray.push(strArray[0]);
              returnArray.push(strArray[1]);
              returnArray.push(strArray[2]);
              returnArray.push(data.response.result[0].structure.level4LC);
              resolve(returnArray);
            }
          }
        );
      },
      (error) => {
        reject(error);
      }
    );
  });
};

export const getUserAddressKr2 = (
  lat: number,
  lng: number
): Promise<string> => {
  return new Promise((resolve, reject) => {
    jsonp(
      `https://api.vworld.kr/req/address?service=address&request=getAddress&version=2.0&point=${lat},${lng}&simple=false&type=BOTH&key=${process.env.REACT_APP_SEARCH_API}`,
      { param: "callback" },
      (err: any, data: any) => {
        if (err) {
          console.error("Error:", err);
          reject(err);
        } else {
          resolve(data.response.result[0].structure.level4LC);
        }
      }
    );
  });
};
