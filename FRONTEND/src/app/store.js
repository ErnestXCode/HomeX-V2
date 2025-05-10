import { configureStore } from '@reduxjs/toolkit'
import userSlice from '../features/users/userSlice'
import styleSlice from '../features/stylings/styleSlice'

const store = configureStore({
    reducer: {
        'user': userSlice,
        'customStyles': styleSlice
    }
})

export default store