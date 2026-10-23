import { create } from 'zustand'
import loginService from "../services/login"
import blogService from "../services/blogs"

const useLoginStore = create((set) => ({
  user: null,
  actions: {
    initialize: () => {
      const loggedUserJSON = window.localStorage.getItem("loggedBlogAppUser");
      if (loggedUserJSON) {
        const user = JSON.parse(loggedUserJSON);
        blogService.setToken(user.token);
        set(() => ({ user }))
      }
    },
    login: async (credentials) => {
      const user = await loginService.login(credentials);
      window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(user));
      blogService.setToken(user.token);
      set(() => ({ user }));
    },
    logout: () => {
      window.localStorage.removeItem("loggedBlogAppUser");
      blogService.setToken(null);
      set(() => ({ user: null }))
    }
  }
}))

export const useLoginUser = () => useLoginStore(state => state.user)
export const useLoginActions = () => useLoginStore(state => state.actions)
export default useLoginStore
