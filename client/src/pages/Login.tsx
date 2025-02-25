import Box from "../components/Box"
import Quote from "../components/Quote"

const Login = ({ }) => {
  return (
    <div className="grid grid-cols-2">
      <Box />
      <div className="lg:visible invisible">
        <Quote />
      </div>
    </div>
  )
}

export default Login