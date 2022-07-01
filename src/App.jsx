import React, { useState, useEffect } from 'react'
import './App.css'

import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg'
// show ffmpeg in the browser console
const ffmpeg = createFFmpeg({ log: true })

function App() {
  const [ready, setReady] = useState(false)
  const [video, setVideo] = useState()
  const [gif, setGif] = useState()
  const sharedArray = new SharedArrayBuffer(1024)
  console.log(sharedArray)
  console.log(ffmpeg)

  const load = async () => {
    await ffmpeg.load()
    setReady(true)
  }

  const convertToGif = async () => {
    // Write the file to memory
    ffmpeg.FS('writeFile', 'test.mp4', await fetchFile(video))

    // Run the FFMpeg command
    await ffmpeg.run(
      '-i',
      'test.mp4',
      '-t',
      '2.5',
      '-ss',
      '2.0',
      '-f',
      'gif',
      'out.gif'
    )

    // Read the result
    const data = ffmpeg.FS('readFile', 'out.gif')
    // Create a URL
    const url = URL.createObjectURL(
      new Blob([data.buffer], { type: 'image/gif' })
    )
    setGif(url)
  }

  useEffect(() => {
    load()
  }, [])

  return ready ? (
    <div className='container'>
      <h1 className='video_text'>Converta seus videos em gifs!</h1>
      <div className='video_container'>
        {video ? (
          <video
            controls
            width='250'
            className='video_box'
            src={URL.createObjectURL(video)}
          ></video>
        ) : (
          <div className='empty'></div>
        )}
        <div className='container_buttons'>
          <div className='fileUpload'>
            <span>Upload</span>
            <input
              className='upload'
              type='file'
              onChange={e => setVideo(e.target.files?.item(0))}
            />
          </div>
          <div className='fileUpload' onClick={convertToGif}>
            <span>Converter</span>
          </div>
        </div>
      </div>

      {gif && (
        <div className='gif_container'>
          <img src={gif} width='250' className='video_box' />
          <div className=''>
            <a href={gif} download>
              <button className='download_gif upload'>Download do gif</button>
            </a>
          </div>
        </div>
      )}
    </div>
  ) : (
    <p>Carregando...</p>
  )
}

export default App
