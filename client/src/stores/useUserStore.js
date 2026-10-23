import { create } from 'zustand'
import userService from '../services/users'

const useUserStore = create(set => ({
  users: [],
  actions: {
    initialize: async () => {
      const users = await userService.getAll()
      set(() => ({ users }))
    }
  }
}))

export const useUsers = () => useUserStore(state => state.users)
export const useUserActions = () => useUserStore(state => state.actions)
export default useUserStore
