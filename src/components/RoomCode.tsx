import copyImg from '../assets/images/copy.svg';
import '../styles/room-code.scss'
import { ToastContainer, toast } from 'react-toastify';import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from '../hooks/useTheme';

type RoomCodeProps = {
  code: string
}
export function RoomCode(props: RoomCodeProps){

  const {theme} = useTheme()

  function copyRoomCodeToClipboard(){
    navigator.clipboard.writeText(props.code) // Copia para o clipboard
  }

  return (
    <div>
      <button className={`room-code ${theme}`} onClick={()=>{
        copyRoomCodeToClipboard();
        toast.dark('📋Código da sala copiado com sucesso')}}>
        <div>
          <img src={copyImg} alt="Copy code room" />
        </div>
        <span>Sala #{props.code}</span>
      </button>
      <ToastContainer/>
    </div>
  )
}