import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: "",
  userName: "",
  email: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserDetails: (state, action) => {
      state.id = action.payload.id;
      state.userName = action.payload.name;
      state.email = action.payload.email;
    },
    logoutDetails: (state, action) => {
      state.id = "";
      state.userName = "";
      state.email = "";
    },
  },
});

export const { setUserDetails, logoutDetails } = userSlice.actions;
export default userSlice.reducer;
