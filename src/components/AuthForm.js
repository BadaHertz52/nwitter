import React, { useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import authSerVice from "../Fbase";
import { RiErrorWarningLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

const AuthForm = ({ newAccount, setPopup, setOpenSuspension }) => {
  const [email, setEmail] = useState({ data: "", error: "required" });
  const [password, setPassword] = useState({ data: "", error: "required" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const onChange = (event) => {
    const {
      target: { name, value },
    } = event;
    const data = value.replaceAll("<", "&lt;").replaceAll(">", "&gt;");
    const regExp = new RegExp(
      "^[0-9a-zA-Z]([-_\\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\\.]?[0-9a-zA-Z])*\\.[a-zA-Z]{2,3}$"
    );
    name === "email"
      ? setEmail({
          data: data,
          error:
            data === "" ? "required" : regExp.test(data) ? "pass" : "error",
        })
      : setPassword({ data: data, error: data === "" ? "required" : "pass" });
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      if (newAccount) {
        //create
        setOpenSuspension(true);
        // await authSerVice.createUserWithEmailAndPassword(
        //   email.data,
        //   password.data
        // );
        //navigate(`/twitter/home`)
      } else {
        //log in
        await authSerVice.signInWithEmailAndPassword(email.data, password.data);
        navigate(`/twitter/home`);
      }
      setPopup(false);
    } catch (e) {
      const start = e.message.indexOf("Firebase:");
      const end = e.message.indexOf("(");

      console.log("e", e);
      setError(e.message.substring(start + 10, end));
    }
  };

  return (
    <section id="authForm">
      <button
        id="authForm_backBtn"
        onClick={() => {
          setPopup(false);
        }}
      >
        <BiArrowBack />
      </button>
      <form onSubmit={onSubmit}>
        <div className="form-email">
          <label htmlFor="email">Email </label>
          <input
            id="email"
            name="email"
            type="text"
            placeholder="Email@***.***"
            onChange={onChange}
          />
          <div className="msg">
            {email.error === "required" && "Please entere-mail"}
            {email.error === "error" &&
              "Please enter an email in the correct format"}
          </div>
        </div>
        <div className="form-pw">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            onChange={onChange}
          />
          <div className="msg">
            {password.error === "required" && "Please enter password"}
          </div>
        </div>
        <input
          id="authForm_logIn"
          type="submit"
          disabled={!(email.error === "pass" && password.error === "pass")}
          value={newAccount ? "Sign up " : "Log In"}
          className="btn"
        />
        {error !== "" && (
          <div id="authError">
            <div>
              <RiErrorWarningLine />
            </div>
            <div className="authError__msg">{error}</div>
          </div>
        )}
      </form>
    </section>
  );
};

export default React.memo(AuthForm);
