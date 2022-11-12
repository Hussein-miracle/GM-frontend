import { createSlice } from "@reduxjs/toolkit";
import joiners from '../../../utils/meeters';

const INITIAL_STATE = {
  currentUser:{...joiners[0]},
  meetJoiners:{},
  mainStream:null,
  userName:'',
}

// INITIAL_STATE.meetJoiners


const rest = joiners.slice(1);

rest.forEach((item,index) => {
  // console.log(item,index);
  (INITIAL_STATE.meetJoiners as any)[item.id] = item;
})


const userReducerSlice = createSlice({
  name:"userSlice",
  initialState:INITIAL_STATE,
  reducers:{
    setMainStream:(state,action)=>{
      // console.log(action,'setStream action')
      state.mainStream = action.payload;
    },
    setCurrentUser:(state,action)=>{
      const payload = action.payload;
      const user = {...state.currentUser,...payload};
      console.log(user,'user');
      state.currentUser = user;
    },
    setUserName:(state,action)=>{
      state.currentUser.name = action.payload;
    }
  }
})

export const {setMainStream,setUserName,setCurrentUser} = userReducerSlice.actions;

// export {setMainStream};

export default userReducerSlice.reducer;