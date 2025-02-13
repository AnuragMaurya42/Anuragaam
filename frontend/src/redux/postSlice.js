import { createSlice } from '@reduxjs/toolkit';
import React from 'react'

const postSlice = createSlice({

    name:'post',
    initialState:{
        posts: [],
    },

    reducers:{
        setPosts:(state , action)=>{
            state.posts = action.payload;
        }

    }

});
export const {setPosts}  = postSlice.actions;
export default postSlice.reducer;
