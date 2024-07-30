import { auth } from "../firebase";

export const useGetUserInfo = () => {
  const user = auth.currentUser
  var id = user.uid
  let email = null
  let displayName = null
  if (user.email) email = user.email
  if (user.displayName) displayName = user.displayName
  return { userID: id, 
           email: email,
           displayName: displayName,
         }
};
