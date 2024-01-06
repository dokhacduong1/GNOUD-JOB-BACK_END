
import crypto from "crypto"
export const generateRandomString = (length : number) : string => {
  const seed : number = new Date().getTime();
  const conver : number = Math.random()+seed;
  const token : string = crypto.randomBytes(length).toString('hex')+conver;
  return token;
};

export const generateRandomNumber = (length : number) : string => {
  let result : string = "";
  for (let i = 0; i < length; i++) {
    result += Math.floor(Math.random() * 10); // Số ngẫu nhiên từ 0 đến 9
  }
  return result;
};