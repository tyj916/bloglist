import { create } from 'zustand'

const useBlogStore = create((set) => ({
  blogs: [],
  actions: {
    initialize: blogs => set(() => ({ blogs }))
  },
}))

export const useBlogs = () => useBlogStore(state => state.blogs)
export const useBlogControls = () => useBlogStore(state => state.actions)
