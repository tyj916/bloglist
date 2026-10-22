import { create } from 'zustand'
import blogService from '../services/blogs'

const useBlogStore = create((set, get) => ({
  blogs: [],
  actions: {
    initialize: blogs => set(() => ({ blogs })),
    add: async (blogObject) => {
      const newBlog = await blogService.create(blogObject);
      set(state => ({ blogs: [...state.blogs, newBlog] }));
      return newBlog;
    },
    like: async (id) => {
      const blog = get().blogs.find(blog => blog.id === id)
      const updatedBlog = await blogService.update({ ...blog, likes: blog.likes + 1 })
      set(state => ({
        blogs: state.blogs.map(blog => blog.id === id ? updatedBlog : blog)
      }))
    },
  },
}))

export const useBlogs = () => useBlogStore(state => state.blogs)
export const useBlogControls = () => useBlogStore(state => state.actions)
