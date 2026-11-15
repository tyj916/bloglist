import { create } from 'zustand'
import loginService from "../services/login"
import blogService from "../services/blogs"
import persistentUser from '../services/persistentUser'

const useLoginStore = create((set) => ({
  user: null,
  actions: {
    initialize: () => {
      const loggedUserJSON = persistentUser.getUser();
      if (loggedUserJSON) {
        const user = JSON.parse(loggedUserJSON);
        blogService.setToken(user.token);
        set(() => ({ user }))
      }
    },
    login: async (credentials) => {
      const user = await loginService.login(credentials);
      persistentUser.saveUser(user);
      blogService.setToken(user.token);
      set(() => ({ user }));
    },
    logout: () => {
      persistentUser.removeUser();
      blogService.setToken(null);
      set(() => ({ user: null }))
    }
  }
}))

export const useLoginUser = () => useLoginStore(state => state.user)
export const useLoginActions = () => useLoginStore(state => state.actions)
export default useLoginStore
