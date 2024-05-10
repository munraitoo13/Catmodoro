import { useState, useEffect } from 'react'
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'

import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PauseIcon from '@mui/icons-material/Pause'
import SettingsIcon from '@mui/icons-material/Settings'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import SkipNextIcon from '@mui/icons-material/SkipNext'
import workMeow from '../assets/sounds/workMeow.mp3'
import shortBreakMeow from '../assets/sounds/shortBreakMeow.mp3'
import longBreakMeow from '../assets/sounds/longBreakMeow.mp3'

import Settings from './Settings'

// timer types
enum TimerType {
  WORK = 'work',
  SHORT_BREAK = 'shortBreak',
  LONG_BREAK = 'longBreak'
}

// timer component
export default function Timer() {
  // meowing sounds
  const [audios] = useState({
    [TimerType.WORK]: new Audio(workMeow),
    [TimerType.SHORT_BREAK]: new Audio(shortBreakMeow),
    [TimerType.LONG_BREAK]: new Audio(longBreakMeow)
  })

  // configuration states
  let [config, setConfig] = useState({
    volume: 0.5,
    work: 25,
    shortBreak: 5,
    longBreak: 15,
    rounds: 4,
    currentRound: 1
  })

  // interface states
  const [isPaused, setIsPaused] = useState(true)
  const [isSettings, setIsSettings] = useState(false)

  // timer states
  const [timerType, setTimerType] = useState(TimerType.WORK)
  const [countdown, setCountdown] = useState(config.work * 60)

  // time formatting
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60

    const formattedMinutes = String(minutes).padStart(2, '0')
    const formattedSeconds = String(remainingSeconds).padStart(2, '0')

    return `${formattedMinutes}:${formattedSeconds}`
  }
  const formattedCountdown = formatTime(countdown)

  // play and pause timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    // start countdown
    if (!isPaused) {
      interval = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1)
      }, 1000)
    }

    // pause countdown
    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [isPaused])

  // pomodoro reset
  const resetPomodoro = () => {
    setTimerType(TimerType.WORK)
    setIsPaused(true)
    config.currentRound = 1
    setCountdown(getTimerValue(TimerType.WORK))
  }

  // timer color
  const timerColor = () => {
    switch (timerType) {
      case TimerType.WORK:
        return '#61E685'
      case TimerType.SHORT_BREAK:
        return '#E6AD60'
      case TimerType.LONG_BREAK:
        return '#9B60E6'
    }
  }

  // timer value
  const getTimerValue = (type: TimerType) => {
    switch (type) {
      case TimerType.WORK:
        return config.work * 60
      case TimerType.SHORT_BREAK:
        return config.shortBreak * 60
      case TimerType.LONG_BREAK:
        return config.longBreak * 60
    }
  }

  // next round function
  const nextRound = () => {
    switch (timerType) {
      case TimerType.WORK:
        if (config.currentRound === config.rounds) {
          audios[TimerType.LONG_BREAK].play()
          setTimerType(TimerType.LONG_BREAK)
          setCountdown(getTimerValue(TimerType.LONG_BREAK))
        } else {
          audios[TimerType.SHORT_BREAK].play()
          setTimerType(TimerType.SHORT_BREAK)
          setCountdown(getTimerValue(TimerType.SHORT_BREAK))
        }
        break
      case TimerType.SHORT_BREAK:
        audios[TimerType.WORK].play()
        setTimerType(TimerType.WORK)
        setCountdown(getTimerValue(TimerType.WORK))
        setConfig({ ...config, currentRound: config.currentRound + 1 })
        setIsPaused(true)
        break
      case TimerType.LONG_BREAK:
        audios[TimerType.WORK].play()
        setTimerType(TimerType.WORK)
        setCountdown(getTimerValue(TimerType.WORK))
        setConfig({ ...config, currentRound: 1 })
        setIsPaused(true)
        break
    }
  }

  // timer description
  const timerDescription = () => {
    switch (timerType) {
      case TimerType.WORK:
        return 'Focus'
      case TimerType.SHORT_BREAK:
        return 'Short Break'
      case TimerType.LONG_BREAK:
        return 'Long Break'
    }
  }

  // next round when timer ends
  useEffect(() => {
    if (countdown <= 0) {
      nextRound()
    }
  }, [countdown])

  // meow volume
  useEffect(() => {
    Object.values(audios).forEach((audio) => {
      audio.volume = config.volume
    })
  }, [config.volume])

  // html return
  return isSettings ? (
    <Settings
      config={config}
      setConfig={setConfig}
      setIsSettings={setIsSettings}
      resetPomodoro={resetPomodoro}
    />
  ) : (
    <div className="flex flex-col items-center justify-center h-screen">
      {/* timer */}
      <CircularProgressbarWithChildren
        className="w-auto h-auto max-h-64"
        value={countdown}
        maxValue={getTimerValue(timerType)}
        strokeWidth={4}
        styles={buildStyles({
          textSize: '1rem',
          pathColor: timerColor(),
          trailColor: '#262626',
          textColor: 'white'
        })}
      >
        <div className="font-bold text-3xl">{formattedCountdown}</div>
        <div className="text-sm">{timerDescription()}</div>
      </CircularProgressbarWithChildren>

      {/* play/pause button */}
      <div
        onClick={() => {
          isPaused ? setIsPaused(false) : setIsPaused(true)
        }}
        className="mt-4 hover:cursor-pointer hover:opacity-50 scale-150"
      >
        {isPaused ? <PlayArrowIcon /> : <PauseIcon />}
      </div>

      {/* rounds */}
      <div className="flex flex-col items-center mt-10">
        {config.currentRound}/{config.rounds}
        {/* reset and skip buttons */}
        <div className="flex flex-row">
          <div onClick={resetPomodoro}>
            <RestartAltIcon className="hover:cursor-pointer opacity-50 hover:opacity-100" />
          </div>

          <div onClick={nextRound}>
            <SkipNextIcon className="hover:cursor-pointer opacity-50 hover:opacity-100" />
          </div>
        </div>
      </div>

      {/* settings button */}
      <div
        onClick={() => {
          setIsSettings(true)
        }}
        className="hover:cursor-pointer hover:opacity-50 mb-5 fixed bottom-0"
      >
        <SettingsIcon />
      </div>

      {/* volume slider */}
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={config.volume}
        onChange={(e) => {
          setConfig({ ...config, volume: parseFloat(e.target.value) })
        }}
        className="w-1/3"
      />
    </div>
  )
}
