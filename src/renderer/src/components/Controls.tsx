import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PauseIcon from '@mui/icons-material/Pause'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import SkipNextIcon from '@mui/icons-material/SkipNext'

export default function Controls({ isPaused, setIsPaused, resetPomodoro, nextRound }) {
  return (
    <div className="my-4 flex">
      <div onClick={resetPomodoro}>
        <RestartAltIcon className="hover:cursor-pointer opacity-50 hover:opacity-100 scale-75" />
      </div>

      <div
        onClick={() => {
          isPaused ? setIsPaused(false) : setIsPaused(true)
        }}
        className="hover:cursor-pointer hover:opacity-50 scale-150 mx-4"
      >
        {isPaused ? <PlayArrowIcon /> : <PauseIcon />}
      </div>

      <div onClick={nextRound}>
        <SkipNextIcon className="hover:cursor-pointer opacity-50 hover:opacity-100 scale-75" />
      </div>
    </div>
  )
}
