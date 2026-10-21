import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { describe } from 'vitest'

const blog = {
  title: 'Component test with react-testing-library',
  author: 'Author Name',
  url: 'http://localhost:3003/',
  likes: 1,
  user: {
    id: 'god',
    name: 'Username'
  }
}
const mockUpdateHandler = vi.fn()
const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const originalModule = await vi.importActual('react-router-dom')
  return {
    ...originalModule,
    useNavigate: () => mockNavigate,
  }
})

describe('<Blog />', () => {
  beforeEach(() => {
    mockUpdateHandler.mockClear()
    mockNavigate.mockClear()
    render(<Blog blog={blog} updateBlog={mockUpdateHandler} />)
  })

  test('render blog', () => {
    const title = screen.getByText('Author Name: Component test with react-testing-library')
    const url = screen.getByText('http://localhost:3003/')
    const likes = screen.getByText('Likes: 1')
    const name = screen.getByText('Username')

    expect(title).toBeVisible()
    expect(url).toBeVisible()
    expect(likes).toBeVisible()
    expect(name).toBeVisible()
  })

  test('like button is not displayed to unauthenticated user', () => {
    const button = screen.queryByRole('button', { name: 'Like' })
    expect(button).not.toBeInTheDocument()
  })

  describe('when a user is logged in', () => {
    beforeEach(() => {
      const user = {
        id: 'root',
        username: 'root',
        name: 'Superuser',
      }

      render(<Blog blog={blog} user={user} updateBlog={mockUpdateHandler} />)
    })

    test('like button is shown', () => {
      const button = screen.getByRole('button', { name: 'Like' })
      expect(button).toBeVisible()
    })

    test('remove button is not shown to non creator', () => {
      const button = screen.queryByRole('button', { name: 'Remove' })
      expect(button).not.toBeInTheDocument()
    })

    test('clicking the like button 2 times calls event handler twice', async () => {
      const user = userEvent.setup()
      const likeButton = screen.getByText('Like')
      await user.click(likeButton)
      await user.click(likeButton)

      expect(mockUpdateHandler.mock.calls).toHaveLength(2)
    })

    describe('and the user is creator', () => {
      beforeEach(() => {
        const user = {
          id: 'god',
          username: 'Username',
          name: 'Username',
        }

        render(<Blog blog={blog} user={user} updateBlog={mockUpdateHandler} />)
      })

      test('blog creator is shown the remove button', () => {
        const button = screen.getByRole('button', { name: 'Remove' })
        expect(button).toBeVisible()
      })
    })
  })
})
