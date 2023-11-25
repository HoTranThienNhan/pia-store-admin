import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  id: '',
  name: '',
  email: '',
  phone: '',
  address: '',
  avatar: '',
  isAdmin: false,
  accessToken: '',
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUser: (state, action) => {
      const { 
        _id = '',
        fullname = '', 
        email = '', 
        phone = '', 
        address = '', 
        avatar = '', 
        isAdmin,
        accessToken = '' 
      } = action.payload;

      state.id = _id;
      state.name = fullname;
      state.email = email;
      state.phone = phone;
      state.address = address;
      state.avatar = avatar;
      state.isAdmin = isAdmin;
      state.accessToken = accessToken;
    },
    resetUser: (state) => {
      state.id = '';
      state.name = '';
      state.email = '';
      state.phone = '';
      state.address = '';
      state.avatar = '';
      state.isAdmin = false;
      state.accessToken = '';
    },
  },
})

// Action creators are generated for each case reducer function
export const { updateUser, resetUser } = userSlice.actions

export default userSlice.reducer