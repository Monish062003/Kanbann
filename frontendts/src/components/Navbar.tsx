import React, { useEffect, useState } from "react";
import "../Css/navbar.scss";
import { auth, provider } from "../googleauth/login";
import { signInWithPopup } from "firebase/auth";
import { useAppDispatch } from "../Slicers/hooks";
import { createuser, readuser } from "../Slicers/slice";
import cookie from "cookie";

function Navbar(): JSX.Element {
  const [btnname, setbtnname] = useState("Login with Google");
  const Object_id: string = cookie.parse(document.cookie).id;

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (cookie.parse(document.cookie).id != undefined) {
      dispatch(readuser({ id: Object_id }));
      setbtnname("Signout");
    }
  }, [cookie.parse(document.cookie).id]);

  const Login = () => {
    signInWithPopup(auth, provider).then(async (data) => {
      dispatch(
        createuser({ username: data.user.displayName, email: data.user.email })
      );
    });
  };

  const SignOut = () => {
    document.cookie = cookie.serialize("id", Object_id, {
      path: "/",
      expires: new Date(0),
    });
  };

  const Check = () => {
    if (btnname === "Login with Google") {
      Login();
      setbtnname("Signout");
    } else {
      SignOut();
      setbtnname("Login with Google");
    }
    const widow: any = window;
    widow.location.reload(true);
  };
  return (
    <div className="nav">
      <div className="title">Kanban</div>
      <button className="login" name="btn" onClick={Check}>
        {btnname}
      </button>
    </div>
  );
}
export default Navbar;
