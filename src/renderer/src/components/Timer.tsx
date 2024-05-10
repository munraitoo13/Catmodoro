import { useState, useEffect } from 'react'

import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'

import SettingsIcon from '@mui/icons-material/Settings'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import VolumeOffIcon from '@mui/icons-material/VolumeOff'

import workMeow from '../assets/sounds/workMeow.mp3'
import shortBreakMeow from '../assets/sounds/shortBreakMeow.mp3'
import longBreakMeow from '../assets/sounds/longBreakMeow.mp3'

import Settings from './Settings'
import Controls from './Controls'

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
  const [config, setConfig] = useState({
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
    audios[TimerType.WORK].play()
    setTimerType(TimerType.WORK)
    setCountdown(getTimerValue(TimerType.WORK))
    setConfig({ ...config, currentRound: 1 })
    setIsPaused(true)
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

  // mute and unmute
  const muteUnmute = () => {
    if (config.volume === 0) {
      setConfig({ ...config, volume: 0.5 })
    } else {
      setConfig({ ...config, volume: 0 })
    }
  }

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
        className="w-auto h-auto max-h-44"
        value={countdown}
        maxValue={getTimerValue(timerType)}
        strokeWidth={8}
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

      {/* reset/play and pause/skip button */}
      <Controls
        isPaused={isPaused}
        setIsPaused={setIsPaused}
        resetPomodoro={resetPomodoro}
        nextRound={nextRound}
      />

      {/* round counter */}
      <div className="opacity-50 text-sm">
        {config.currentRound} of {config.rounds}
      </div>

      {/* settings button */}
      <div
        onClick={() => {
          setIsSettings(true)
        }}
        className="hover:cursor-pointer hover:opacity-50 m-5 fixed bottom-0 right-0"
      >
        <SettingsIcon />
      </div>

      {/* volume control */}
      <div className="flex items-center justify-left fixed bottom-0 m-5 left-0">
        <div className="mr-2 flex items-center cursor-pointer" onClick={muteUnmute}>
          {config.volume === 0 ? <VolumeOffIcon className="opacity-50" /> : <VolumeUpIcon />}
        </div>

        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={config.volume}
          onChange={(e) => {
            setConfig({ ...config, volume: parseFloat(e.target.value) })
          }}
          className={
            config.volume === 0
              ? 'w-1/3 cursor-pointer rounded-lg appearance-none bg-neutral-800 accent-neutral-700'
              : 'w-1/3 cursor-pointer rounded-lg appearance-none bg-neutral-800 accent-white'
          }
        />
      </div>
    </div>
  )
}
