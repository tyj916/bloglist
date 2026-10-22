import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'

const useNotificationStore = create((set, get) => ({
  message: 'test',
  type: 'success',
  actions: {
    setNotification: (message, type) => set(() => ({ message, type }))
  }
}))

export const useNotification = () => useNotificationStore(
  useShallow((state) => ({
    message: state.message,
    type: state.type,
  }))
)
export const useNotificationActions = () => useNotificationStore(state => state.actions)
