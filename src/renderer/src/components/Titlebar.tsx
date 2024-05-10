import logo from '../assets/images/icon.svg'
import CloseIcon from '@mui/icons-material/Close'
import MinimizeIcon from '@mui/icons-material/Remove'

const { ipcRenderer } = require('electron')
const ipc = ipcRenderer

export default function Titlebar() {
  function closeBtn() {
    ipc.send('closeApp')
  }
  function minBtn() {
    ipc.send('minApp')
  }

  return (
    <div className="contain-content drag bg-transparent top-0 fixed w-screen h-10 flex items-center justify-between px-3 text-white">
      <a href="http://github.com/munraitoo13" target="_blank" className="no-drag w-5 h-5">
        <img src={logo} alt="Catmodoro" />
      </a>

      <div className="no-drag">
        <MinimizeIcon onClick={minBtn} className="hover:opacity-50 w-5 scale-75" />
        <CloseIcon onClick={closeBtn} className="w-5 ml-2 hover:fill-red-500 scale-75" />
      </div>
    </div>
  )
}
