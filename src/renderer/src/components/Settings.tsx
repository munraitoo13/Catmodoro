import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn'

export default function Settings({ config, setConfig, setIsSettings, resetPomodoro }) {
  return (
    <div className="flex flex-col items-center w-screen">
      <h1 className="text-2xl mb-5">Timer settings</h1>

      <div className="flex flex-col items-center mb-2">
        <label>Work</label>
        <input
          value={config.work}
          onChange={(e) => {
            setConfig({ ...config, work: parseFloat(e.target.value) })
          }}
          type="number"
          className="rounded-md bg-neutral-800 px-3 py-1 w-1/3"
        />
      </div>

      <div className="flex flex-col items-center mb-2">
        <label>Short</label>
        <input
          value={config.shortBreak}
          onChange={(e) => {
            setConfig({ ...config, shortBreak: parseFloat(e.target.value) })
          }}
          type="number"
          className="rounded-md bg-neutral-800 px-3 py-1 w-1/3"
        />
      </div>

      <div className="flex flex-col items-center mb-2">
        <label>Long</label>
        <input
          value={config.longBreak}
          onChange={(e) => {
            setConfig({ ...config, longBreak: parseFloat(e.target.value) })
          }}
          type="number"
          className="rounded-md bg-neutral-800 px-3 py-1 w-1/3"
        />
      </div>

      <div className="flex flex-col items-center mb-5">
        <label>Rounds</label>
        <input
          value={config.rounds}
          onChange={(e) => {
            setConfig({ ...config, rounds: parseFloat(e.target.value) })
          }}
          type="number"
          className="rounded-md bg-neutral-800 px-3 py-1 w-1/3"
        />
      </div>

      <KeyboardReturnIcon
        onClick={() => {
          setIsSettings(false), resetPomodoro()
        }}
        className="hover:cursor-pointer hover:opacity-50 mb-5 fixed bottom-0"
      />
    </div>
  )
}
