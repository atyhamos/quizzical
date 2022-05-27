import React from "react"
import "../style.css"

export default function Start(props) {
    return (
        <div className="start-page">
            <h1 className="title">Quizzical</h1>
            <h2 className="desc">Test your knowledge!</h2>
            <button onClick={props.startPlaying} className="start-button">Start quiz</button>
        </div>
    )
}