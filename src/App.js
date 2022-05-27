import React from "react"
import Start from "./components/Start"
import Quiz from "./components/Quiz"

export default function App() {
  const [isPlaying, setPlaying] = React.useState(false)

  function startPlaying() {
    setPlaying(true)
  }

  return (
    <main>
      {isPlaying ? <Quiz /> : <Start startPlaying={startPlaying}/> }
      {/* <div className="start-screen">
        This is my app
      </div>
      <div className="quiz-screen">

      </div> */}
    </main>
  )
}