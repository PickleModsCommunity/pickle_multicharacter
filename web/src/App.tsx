import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LoadingScreen from './components/loading/loading'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='dark w-screen h-screen absolute top-0 left-0'>
      <LoadingScreen/>
    </div>
  )
}

export default App
