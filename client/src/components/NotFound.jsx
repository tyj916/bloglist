import { useNavigate } from "react-router-dom"

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div>
      <h2>404 - Page not found</h2>
      <p>Let me bring you to the home page <button onClick={() => navigate('/')}>take a ride</button></p>
    </div>
  )
}

export default NotFound
