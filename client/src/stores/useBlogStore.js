import { create } from 'zustand'
import blogService from '../services/blogs'

const useBlogStore = create((set) => ({
  blogs: [],
  actions: {
    initialize: blogs => set(() => ({ blogs })),
    add: async (blogObject) => {
      const newBlog = await blogService.create(blogObject);
      set(state => ({ blogs: [...state.blogs, newBlog] }));
      return newBlog;
    }
  },
}))

export const useBlogs = () => useBlogStore(state => state.blogs)
export const useBlogControls = () => useBlogStore(state => state.actions)
