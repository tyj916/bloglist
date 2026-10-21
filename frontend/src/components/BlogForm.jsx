import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TextField, Button } from '@mui/material'

const BlogForm = ({ addBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    addBlog({ title, author, url })
    setTitle('')
    setAuthor('')
    setUrl('')
    navigate('/')
  }

  return (
    <div>
      <h2>Create New</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)} 
            variant='outlined'
            size='small'
            margin='dense'
            sx={{ width: 'min(100%, 400px)' }}
          />
        </div>
        <div>
          <TextField
            label="Author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)} 
            variant='outlined'
            size='small'
            margin='dense'
            sx={{ width: 'min(100%, 400px)' }}
          />
        </div>
        <div>
          <TextField
            label="Url"
            value={url}
            onChange={(e) => setUrl(e.target.value)} 
            variant='outlined'
            size='small'
            margin='dense'
            sx={{ width: 'min(100%, 400px)' }}
          />
        </div>

        <Button type='submit' variant='contained' style={{ marginTop: 10 }}>Create</Button>
      </form>
    </div>
  )
}

export default BlogForm
