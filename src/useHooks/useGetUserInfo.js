import { auth } from "../firebase";
import Cookies from "js-cookie";

export const useGetUserInfo = () => {
  const user = auth.currentUser
  if (user) {
    return {userID: user.uid,
            email: user.email,
            name: user.displayName,
            }
  } else {
    return {userID:null,
            email:null,
            name:null,
            }
  }
};

export const useGetUserInfo2 = () => {
  const userInfo = Cookies.get("BonVoyageAuth");
  if (userInfo) {
    const { userID, email, name } = JSON.parse(userInfo);
    return { userID, email, name }
  } else {
    const nil = null
    return { userID:nil, email:nil, name:nil}
  }
};