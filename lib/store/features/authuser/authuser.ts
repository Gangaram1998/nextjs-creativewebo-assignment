import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface AuthUserState {
    user: object
}

const initialState: AuthUserState = {
    user: {},
}

export const authUserSlice = createSlice({
    name: 'authuser',
    initialState,
    reducers: {
        addUser: (state, action) => {
            console.log("action:", action.payload)
            state.user = action.payload;
        }
    },
})

// Action creators are generated for each case reducer function
export const { addUser } = authUserSlice.actions

export default authUserSlice.reducer