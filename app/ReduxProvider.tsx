'use client';

import { AppStore, makeStore } from "@/lib/store/store";
import { ReactNode, useRef } from "react";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";

const ReduxProvider = ({ children }: { children: ReactNode }) => {
    const storeRef = useRef<AppStore>()
    if (!storeRef.current) {
        // Create the store instance the first time this renders
        storeRef.current = makeStore()
    }

    persistStore(storeRef.current)

    return <Provider store={storeRef.current}>
        {children}
    </Provider>
}

export default ReduxProvider;