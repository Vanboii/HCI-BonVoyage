// import { getDoc, collection } from "firebase/firestore";
import { auth, provider} from '../firebase';
import { signInWithEmailAndPassword } from "firebase/auth";


export const userLogin = async (email,pw) => {
    const results = await signInWithEmailAndPassword(auth,email,pw);

};