import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState('Realtime speech transcription API')
  const [ws, setWs] = useState(null)
  const [microphone, setMicrophone] = useState(null)

  const getMicrophone = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      return new MediaRecorder(stream, { mimeType: 'audio/webm' })
    } catch (error) {
      console.error('error accessing microphone:', error)
      throw error
    }
  }

  const handleRecordClick = async () => {
    if (!microphone) {
      try {
        const mic = await getMicrophone()
        setMicrophone(mic)
        setIsRecording(true)
        
        mic.onstart = () => {
          console.log('client: microphone opened')
        }

        mic.onstop = () => {
          console.log('client: microphone closed')
          setIsRecording(false)
        }

        mic.ondataavailable = (event) => {
          if (event.data.size > 0 && ws?.readyState === WebSocket.OPEN) {
            ws.send(event.data)
          }
        }

        mic.start(1000)
      } catch (error) {
        console.error('error opening microphone:', error)
      }
    } else {
      microphone.stop()
      setMicrophone(null)
    }
  }

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:3001/ws')
    setWs(socket)

    socket.addEventListener('message', (event) => {
      if (event.data === '') return
      
      try {
        const data = JSON.parse(event.data)
        if (data?.channel?.alternatives?.[0]?.transcript) {
          setTranscript(data.channel.alternatives[0].transcript)
        }
      } catch (e) {
        console.error('Failed to parse JSON:', e)
      }
    })

    return () => {
      socket.close()
    }
  }, [])

  return (
    <>
      <div className="content">
        <img className="click" src="click.png" alt="Click indicator" />
        <div className="button-container">
          <input 
            type="checkbox" 
            id="record" 
            className="mic-checkbox" 
            checked={isRecording}
            readOnly
          />
          <label 
            htmlFor="record" 
            className="mic-button"
            onClick={handleRecordClick}
          >
            <div className="mic">
              <div className="mic-button-loader"></div>
              <div className="mic-base"></div>
            </div>
            <div className="button-message">
              <span>&nbsp;</span>
              <span>{isRecording ? 'STOP' : 'START'}</span>
            </div>
          </label>
        </div>
      </div>
      <h1>Captions by Deepgram</h1>
      <div className="captions" id="captions">
        <span>{transcript}</span>
      </div>
      <div className="button-container">
        <a
          href="https://console.deepgram.com/signup"
          className="info-button sign-up"
          target="_blank"
          rel="noopener noreferrer"
        >
          Sign Up
        </a>
        <a
          href="https://developers.deepgram.com/docs/introduction"
          className="info-button docs"
          target="_blank"
          rel="noopener noreferrer"
        >
          Read the Docs
        </a>
      </div>
    </>
  )
}

export default App