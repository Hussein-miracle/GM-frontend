import { createSlice } from "@reduxjs/toolkit";

const INITIAL_STATE = {
  currentUser:null,
  meetJoiners:{},
  mainStream:null
}

const userReducerSlice = createSlice({
  name:"userSlice",
  initialState:INITIAL_STATE,
  reducers:{

  }
})


export default userReducerSlice.reducer;