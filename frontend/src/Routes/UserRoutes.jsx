import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../Pages/Home";
import Login from "../Pages/Login";
import SignUp from "../Pages/SignUp";
import UserAuthorize from "./UserAuthorize";
import UserPublic from "./UserPublic";

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
        <Route
          path="/login"
          element={
            <UserPublic>
              <Login />
            </UserPublic>
          }
        />
        <Route
          path="/signup"
          element={
            <UserPublic>
              <SignUp />
            </UserPublic>
          }
        />
      </Routes>
    </div>
  );
}
