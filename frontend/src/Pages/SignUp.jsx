import React, { useState } from "react";
import { Card, Input, Button, Typography } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { userSignUp } from "../APIs/UserAPIs";
import { setUserDetails } from "../Store/Slices/UserSlice";
import { useDispatch } from "react-redux";

function SignUp() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nameAlert, setNameAlert] = useState("");
  const [emailAlert, setEmailAlert] = useState("");
  const [passAlert, setPassAlert] = useState("");
  const [success, setSuccess] = useState("");

  const signUpHandle = async (e) => {
    e.preventDefault();
    try {
      if (name.trim() === "" || nameAlert) {
        setNameAlert("Must fillout the field.");
      } else if (email.trim() === "" || emailAlert) {
        setEmailAlert("Must fillout the field.");
      } else if (password.trim() === "" || passAlert) {
        setPassAlert("Must fillout the field.");
      } else {
        const signUpResponse = await userSignUp({ name, email, password });
        if (signUpResponse.data.status) {
          localStorage.setItem("token", signUpResponse.data.token);
          dispatch(
            setUserDetails({
              id: signUpResponse.data.userData._id,
              userName: signUpResponse.data.userData.name,
              email: signUpResponse.data.userData.email,
            })
          );
          setSuccess("Registration Success !!");
          setTimeout(() => {
            navigate("/");
          }, 2000);
        } else {
          setPassAlert(signUpResponse.data.alert);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="w-full flex justify-center items-center h-screen">
      <Card color="transparent" shadow={false}>
        <Typography variant="h4" color="blue-gray">
          Register your Account
        </Typography>
        <Typography color="gray" className="mt-1 font-normal">
          Nice to meet you! Enter your details to register.
        </Typography>
        <form
          className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96"
          onSubmit={signUpHandle}
        >
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Your Name
            </Typography>
            <Input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (e.target.value.length < 4) {
                  setNameAlert("Username must be 4 letters or above.");
                } else {
                  setNameAlert("");
                }
              }}
              size="lg"
              placeholder="name@mail.com"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            {nameAlert && (
              <p style={{ color: "red" }}>
                <i className="fa-solid fa-triangle-exclamation" />
                &nbsp;&nbsp;&nbsp;{nameAlert}
              </p>
            )}
            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Your Email
            </Typography>
            <Input
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.target.value)) {
                  setEmailAlert("Please enter a valid email address.");
                } else {
                  setEmailAlert("");
                }
              }}
              size="lg"
              placeholder="name@mail.com"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            {emailAlert && (
              <p style={{ color: "red" }}>
                <i className="fa-solid fa-triangle-exclamation" />
                &nbsp;&nbsp;&nbsp;{emailAlert}
              </p>
            )}
            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Password
            </Typography>
            <Input
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (e.target.value.length < 6) {
                  setPassAlert("Password must be 6 characters or longer.");
                } else {
                  setPassAlert("");
                }
              }}
              type="password"
              size="lg"
              placeholder="********"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            {passAlert && (
              <p style={{ color: "red" }}>
                <i className="fa-solid fa-triangle-exclamation" />
                &nbsp;&nbsp;&nbsp;{passAlert}
              </p>
            )}
            {success && (
              <p style={{ color: "green" }}>
                <i class="fa-regular fa-circle-check" />
                &nbsp;&nbsp;&nbsp;{success}
              </p>
            )}
          </div>

          <Button type="submit" className="mt-6" fullWidth>
            Register
          </Button>
          <Typography color="gray" className="mt-4 text-center font-normal">
            Already have an account?{" "}
            <a
              onClick={() => {
                navigate("/login");
              }}
              className="font-medium text-gray-900"
            >
              Log In
            </a>
          </Typography>
        </form>
      </Card>
    </div>
  );
}

export default SignUp;
