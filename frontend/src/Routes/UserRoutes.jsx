import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../Pages/Home";
import Login from "../Pages/Login";
import SignUp from "../Pages/SignUp";
import UserAuthorize from "./UserAuthorize";
import UserPublic from "./UserPublic";
import Dashboard from "../Components/Dashboard";

export default function UserRoutes() {
  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={
              <Home />
          }
        />
        {/* <Route
          path="/"
          element={
            // <UserPublic>
              <Login />
            // </UserPublic>
          }
        /> */}
        <Route
          path="/signup"
          element={
            // <UserPublic>
              <SignUp />
            // </UserPublic>
          }
        />
        <Route
          path="/records"
          element={
            // <UserPublic>
              <Dashboard />
            // </UserPublic>
          }
        />
      </Routes>
    </div>
  );
}
