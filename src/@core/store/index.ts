import {configureStore} from "@reduxjs/toolkit";
import postsReducer from "./posts/posts.reducer";
import {useDispatch} from "react-redux";

export const store = configureStore({
    reducer: {
        posts: postsReducer,
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<typeof store.dispatch>()
