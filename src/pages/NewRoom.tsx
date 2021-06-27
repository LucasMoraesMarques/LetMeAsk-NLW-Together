// Images and styles
import illustrationImg2 from '../assets/images/illustration2.svg';
import logoImg from '../assets/images/logo.svg';
import '../styles/auth.scss';

// Hooks, types, and services
import { useAuth } from '../hooks/useAuth'
import { useState, FormEvent } from 'react';
import { database } from '../services/firebase'
import { Link, useHistory } from 'react-router-dom'

// Components
import { Button } from '../components/Buttons';
import { useTheme } from '../hooks/useTheme';

export function NewRoom() {
  const { user } = useAuth()
  const {theme} = useTheme()
  const history = useHistory()
  const [newRoom, setNewRoom] = useState('')
  const [questionLimit, setQuestionLimit] = useState('')
  const [timeInterval, setTimeInterval] = useState('')
  const [categories, setCategories] = useState('')

  async function handleCreateRoom(event: FormEvent) {
    event.preventDefault();

    const roomRef = database.ref('rooms')
    const firebaseRoom = await roomRef.push({
      title: newRoom,
      authorId: user?.id,
      settings: {
        timeInterval: timeInterval,
        questionLimit: questionLimit,
        categories: categories.concat('-default'),
      }

    })

    history.push(`/rooms/${firebaseRoom.key}`)

  }

  function showRoomSettings() {
    var button : HTMLDivElement | null= document.querySelector('.triangle')
    var settings: HTMLDivElement | null = document.querySelector('#settings')
    if (settings!.style.display === 'none'){
      button!.classList.remove('right')
      button!.classList.add('bottom')
      settings!.style.display = 'flex'
    }

    else{
      button!.classList.add('right')
      button!.classList.remove('bottom')
      settings!.style.display = 'none'
    }

  }

  return (
    <div id='page-auth' className={theme}>
      <aside>
        <img src={illustrationImg2} alt="Ilustração simbolizando perguntas e respostas" />
        <strong>Crie salas de Q&amp;A ao vivo</strong>
        <p>Tire as dúvidas de sua audiência em tempo real</p>
      </aside>
      <main>
        <div className='main-content'>
          <img src={logoImg} alt="Letmeask" />
          <h2>Criar uma nova sala</h2>
          <form action="" onSubmit={handleCreateRoom}>
            <input type="text" name="" required id="" title="Especifique um nome para a sala" placeholder="Nome da sala"
              onChange={event => setNewRoom(event.target.value)}
              value={newRoom} />
            <div className="room-settings">
              <div style={{cursor:'pointer'}} onClick={showRoomSettings}>
                <div className="triangle right" ></div>
                <span>Configurar regras da sala (opcional)</span>
              </div>
              <div id="settings" style={{display:'none'}}>
                <textarea placeholder="Digite as categorias separadas por -"
                title="Especifique categorias para filtrar as perguntas"
                onChange={event => setCategories(event.target.value)} 
                value={categories}/>
                <input type="number" min="0" name="" id="" placeholder="Digite o limite de perguntas (0)" 
                title='Especifique um limite de perguntas por pessoa para evitar flood'
                onChange={event => setQuestionLimit(event.target.value)} 
                value={questionLimit}/>
                <input type="number" min="0"name="" id="" placeholder="Digite o tempo de espera (s)" 
                title='Especifique intervalo entre duas perguntas consecutivas'
                onChange={event => setTimeInterval(event.target.value)} 
                value={timeInterval}/>
              </div>
            </div>
            <Button type="submit">
              Criar sala
            </Button>
          </form>
          <p>Quem entrar em uma sala existente? <Link to='/'>Clique aqui</Link></p>
        </div>
      </main>
    </div>
  )
}