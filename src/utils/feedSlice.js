import { createSlice } from "@reduxjs/toolkit";

const feedSlice=createSlice({
    name:'feed',
    initialState:null,
    reducers:{
        addFeed:(state,action)=>{
            return action.payload;
        },
        removeFeed:(state,action)=>{
            const newArr=state.filter(feed=>feed._id!==action.payload);
            return newArr;
        },
        clearFeed:(state,action)=>{
            return null;
        }
    }
});


export const{addFeed,removeFeed,clearFeed}=feedSlice.actions;
export default feedSlice.reducer;