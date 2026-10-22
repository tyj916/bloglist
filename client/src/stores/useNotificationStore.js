import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'

const useNotificationStore = create((set, get) => ({
  message: '',
  type: '',
  actions: {
    setNotification: (message, type) => {
      set(() => ({ message, type }))
      setTimeout(() => {
        set(() => ({ message: '', type: '' }))
      }, 5000)
    }
  }
}))

export const useNotification = () => useNotificationStore(
  useShallow((state) => ({
    message: state.message,
    type: state.type,
  }))
)
export const useNotificationActions = () => useNotificationStore(state => state.actions)
