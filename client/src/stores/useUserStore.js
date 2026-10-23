import { create } from 'zustand'
import loginService from "../services/login"
import blogService from "../services/blogs"

const useUserStore = create((set) => ({
  user: null,
  actions: {
    initialize: async () => {
      const loggedUserJSON = window.localStorage.getItem("loggedBlogAppUser");
      if (loggedUserJSON) {
        const user = JSON.parse(loggedUserJSON);
        blogService.setToken(user.token);
        set(() => ({ user }))
      }
    }
  }
}))

export const useUser = () => useUserStore(state => state.user)
export const useUserActions = () => useUserStore(state => state.actions)
