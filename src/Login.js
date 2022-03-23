import { Button } from "@material-ui/core";
import React from "react";
import "./Login.css";
import logo from "./whatsapp-logo.png";
import { auth, provider, signInWithPopup } from "./firebaseConnect";
import { GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import { useStateValue } from "./StateProvider";
import { actionTypes } from "./reducer";
function Login() {
  const [{}, dispatch] = useStateValue();

  const checkLogin = () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        // console.log(user);
        dispatch({
          type: actionTypes.SET_USER,
          user: user,
        });
        // ...
      } else {
        // User is signed out
        // ...
      }
    });
  };
  checkLogin();

  const signIn = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        dispatch({
          type: actionTypes.SET_USER,
          user: user,
        });
        // console.log(credential, token, user);
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.log(errorCode, errorMessage, email, credential);
        // ...
      });
  };

  return (
    <div className="login">
      <div className="login__container">
        <img src={logo} />
        <div className="login__text">
          <h1>Sign in to WhatsApp</h1>
        </div>

        <Button onClick={signIn}>Sign In With Google</Button>
      </div>
    </div>
  );
}

export default Login;
