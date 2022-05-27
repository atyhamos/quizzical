import React from "react"
import "../style.css"
import line from "../images/line.png"
import {nanoid} from "nanoid"
import {decode} from 'html-entities'

export default function Quiz(props) {
    const [numberOfGames, setNumberOfGames] = React.useState(0)
    const [questions, setQuestions] = React.useState([])
    const [answers, setAnswers] = React.useState([])
    const [isPlaying, setPlaying] = React.useState(true)


    React.useEffect(() => {
        fetch("https://opentdb.com/api.php?amount=5")
            .then(res => res.json())
            .then(data => {
                    setQuestions(data.results)
                    setAnswers(data.results.map(question => generateAnswers(question.incorrect_answers, 
                        question.correct_answer, question.question)).flat())
                }
            )
    }, [numberOfGames])

    const questionElements = questions.map(question => {
        const answersToQuestion = answers.filter(answer => answer.questionName === question.question)
        const answerElements = answersToQuestion.map(answer => {
            let styles = {}
            if (isPlaying) {
                styles = {backgroundColor: answer.selected ? "#D6DBF5" : "#F5F7FB"}
            } else {
                if (answer.correct) {
                    styles = {backgroundColor: "#94D7A2"}
                } else if (answer.selected && !answer.correct) {
                    styles = {backgroundColor: "#F8BCBC", opacity: "50%"}
                } else {
                    styles = {opacity: "50%"}
                }
            }
            return (
            <button className="answer" onClick={() => selectAnswer(answer.id)} 
            style={styles}>
            {decode(answer.value)}
            </button>
        )
        })
                       
        return (
            <div className="questions">
                <h2 className="question">{decode(question.question)}</h2>
                    <div className="answers">
                        {answerElements}
                    </div>
                <img src={line} className="line-break" alt="a line break" />
            </div>
        )}
    )

    function generateAnswers(incorrect, correct, title) {
        const answerArr = [...incorrect, correct].map(answer =>  {
            return {
                id: nanoid(),
                questionName: title,
                correct: false,
                value: answer,
                selected: false
            }
        })
        answerArr[answerArr.length - 1].correct = true

        // Scramble answers
        for (let i = answerArr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [answerArr[i], answerArr[j]] = [answerArr[j], answerArr[i]]; 
        }
        return answerArr
    }

    function selectAnswer(id) {
        if (!isPlaying) {
            return
        }
        const questionName = answers.find(answer=> answer.id === id).questionName
        const otherAnswersToQuestion = answers.filter(answer => answer.questionName === questionName &&
            answer.id !== id)

        setAnswers(prevAnswers => prevAnswers.map(answer => {
            if (answer.id === id) {
                return {
                    ...answer,
                    selected: !answer.selected
                } 
            } else if (otherAnswersToQuestion.map(answer => answer.id).includes(answer.id)) {
                return {
                    ...answer,
                    selected: false
                }
            } else {
                return answer
            }             
        }))
    }

    function checkOrPlay() {
        if (isPlaying) {
            setPlaying(false)            
        } else {
            setNumberOfGames(prevNumber => prevNumber + 1)
            setPlaying(true)
        }
    }

    return (
        <div className="quiz-page">
            {questionElements}
            {isPlaying ? <button className="check-answers" onClick={checkOrPlay}>Check answers</button>
            : <div className="end-game">
                <h2 className="score-message">You scored {answers.filter(answer => answer.selected && answer.correct).length}/5 correct answers</h2>
                <button className="play-again" onClick={checkOrPlay}>Play again</button>
            </div>
            }
        </div>
    )
}