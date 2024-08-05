import { combineReducers, configureStore } from '@reduxjs/toolkit';
import AuthReducer from "./features/authuser/authuser";
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage';
import authUserReducer from "../store/features/authuser/authuser";

const PersistConfig = {
    key: "authuser",
    storage: storage,
    whitelist: ['user']
}


const rootReducer = combineReducers({
    Auth: persistReducer(PersistConfig, authUserReducer)
})

export const makeStore = () => {
    return configureStore({

        reducer: rootReducer,
        middleware: (getdefalultMiddleware) => {
            return getdefalultMiddleware({ serializableCheck: false });
        }
    })
}

export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']