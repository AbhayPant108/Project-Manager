import { configureStore } from "@reduxjs/toolkit";
import { useState } from "react";
import { useDispatch, type TypedUseSelectorHook} from "react-redux";

const store = configureStore({
    reducer:{

    }
})

export default store
export const useAppState:TypedUseSelectorHook<ReturnType<typeof store.getState>> = useState
export const useAppDispatch = ()=> useDispatch<typeof store.dispatch>()

