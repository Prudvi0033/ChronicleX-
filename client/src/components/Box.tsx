import { ChangeEvent, useState } from "react"
import { Link } from "react-router-dom"

const Box = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center">
        <div className="text-3xl font-bold">Create an account</div>
        <div className="text-sm text-slate-400">Already have an account ?<Link to="/signup" className="text-black underline" > Signup</Link> </div>
        <div className="mt-8 flex flex-col gap-3 w-full">
        <LabeledInput label="Username" placeholder="Varma@0033" onchange={(e) => { setUsername(...e ,e.target.value) }} />
        <LabeledInput label="Password" placeholder=".........." onchange={(e) => {setPassword (e.target.value) }} />
        <button
        onClick={() => {}}
        className="bg-black mt-2 py-3 rounded-md text-white hover:duration-200 hover:ease-in-out hover:scale-105">Login</button>
      </div>
        {username}{password}
      </div>
      
    </div>
  )
}

interface labelledInputType {
  label: string,
  placeholder: string,
  onchange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const LabeledInput = ({ label, placeholder, onchange }: labelledInputType) => {
  return <div>
    <label className="block mb-2 text-sm font-medium text-gray-900 ">{label}</label>
    <input onChange={onchange} type="text" id="first_name" className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder={placeholder} required />
  </div>
}

export default Box