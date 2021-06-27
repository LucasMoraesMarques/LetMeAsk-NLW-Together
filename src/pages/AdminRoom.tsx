// Hooks, types and services
import { useAuth } from '../hooks/useAuth';
import { useRoom } from '../hooks/useRoom';
import { FormEvent, useEffect, useState } from 'react';
import { database } from '../services/firebase';
import { Link, useHistory, useParams } from 'react-router-dom'

// Images and styles
import logoImg from '../assets/images/logo.svg'
import deleteImg from '../assets/images/delete.svg'
import checkImg from '../assets/images/check.svg'
import answerImg from '../assets/images/answer.svg'
import '../styles/room.scss';

// Components
import { Button } from '../components/Buttons'
import { Question } from '../components/Questions';
import { RoomCode } from '../components/RoomCode';
import { Toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Chip } from '../components/Chips';

import emptyQuestionsImg from '../assets/images/empty-questions.svg'
import { useTheme } from '../hooks/useTheme';

type RoomsParams = {
  id: string;
}

export function AdminRoom() {
  const history = useHistory()
  const params = useParams<RoomsParams>()
  const roomId = params.id
  const { user, signInWithGoogle, signOut } = useAuth()
  const {theme, toggleTheme} = useTheme()
  const { title, questions, availableCategories } = useRoom(roomId)
  const [shownCategories, setShownCategories] = useState<Array<string>>([])
  const [selectedCategories, setSelectedCategories] = useState<Array<string>>([])
  const [orderByLikes, setOrderByLikes] = useState(false)
  const [hidAnswered, setHidAnswered] = useState(false)
  const [shownQuestions, setShownQuestions] = useState(questions)

  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    })
    history.push('/')
  }

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm('Tem certeza que você deseja remover esta pergunta?')) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }
  }

  async function handleHighlightQuestion(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: true,
    });
  }

  async function handleCheckQuestionAsAnswered(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true,
    });
  }

  
  function handleSelectedCategories(categorie: string) {
    if (selectedCategories.includes(categorie)) {
      setSelectedCategories(selectedCategories.filter((item) => { return item !== categorie }))
    }
    else {
      setSelectedCategories(selectedCategories.concat(categorie))
    }

  }

  function handleShownCategories(categorie: string) {
    if (shownCategories.includes(categorie)) {
      setShownCategories(shownCategories.filter((item) => { return item !== categorie }))
    }
    else {
      setShownCategories(shownCategories.concat(categorie))
    }


  }

  function showQuestionsFilters() {
    var button : HTMLDivElement | null= document.querySelector('.triangle')
    var filters: HTMLDivElement | null = document.querySelector('#filters')
    if (filters!.style.display === 'none'){
      button!.classList.remove('right')
      button!.classList.add('bottom')
      filters!.style.display = 'flex'
    }

    else{
      button!.classList.add('right')
      button!.classList.remove('bottom')
      filters!.style.display = 'none'
    }

  }

  useEffect(() => {
    setShownQuestions(questions.filter((question) => {
      return question!.categories!.some((cat) => {
        return shownCategories.includes(cat)
      })
    }))
    if(orderByLikes){
      setShownQuestions(questions.sort((a, b) =>{
      return b.likeCount - a.likeCount}))
    }

    if(hidAnswered){
      setShownQuestions(questions.filter((question) =>{
        return !question.isAnswered
      }))
    }


  }, [orderByLikes, hidAnswered, questions, shownCategories]);

  function openMenuMobile(){
    var menu: HTMLDivElement | null = document.querySelector('.menu')
    if (menu!.style.display === 'none'){
      menu!.style.display = 'flex'
    }
    else{
      menu!.style.display = 'none';
    }
  }

  return (
    <div id="page-room" className={theme}>
      <header>
        <div className="content">
          <Link to='/'><img src={logoImg} alt="Letmeask" /></Link>
          <div>
            <div className="menu-mobile-opener" onClick={openMenuMobile}>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div className="menu">
              <Button type='button' onClick={toggleTheme}>{theme}</Button>
              <div>
                <RoomCode code={roomId}></RoomCode>
              </div>
              <Link to={`${roomId}`} style={{ textDecoration: 'none' }}
                onClick={() => { signOut() }}><Button isOutlined >Logout</Button></Link>
              <Link to='/' style={{ textDecoration: 'none' }}></Link>
              <Button isOutlined onClick={handleEndRoom}>Encerrar Sala</Button>
            </div>
          </div>
      </div>
      </header>
      <main>
        <div className="room-title">
          <div>
            <h1>Sala {title}</h1>
            {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
          </div>
          <div className="room-rules">
            <Button isOutlined>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-info-circle-fill" viewBox="0 0 16 16">
                <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
              </svg>
              Regras</Button>
          </div>
        </div>
        <br />
        <div className='separator'>Perguntas</div>
        {questions.length ?
          <div style={{ cursor: 'pointer' }} onClick={showQuestionsFilters}>
            <div className="triangle right" ></div>
            <span>Filtros</span>
          </div>
          : ''}
        <div id="filters"
          style={{ display: 'none' }}>
          <div className="chips" >
            <span>Filtrar por categorias</span>
            {availableCategories.map((value, index) => {
              return <Chip key={index} onClick={() => handleShownCategories(value)}
              className={selectedCategories.includes(value) ? `chip selected ${theme}` : `chip ${theme}`}>{value}</Chip>
            })}
          </div>
          <div className="orderAndHid">
            <div>
              <input type="checkbox" name="orderByLikes" id="" onClick={() => { !orderByLikes ? setOrderByLikes(true) : setOrderByLikes(false) }} />
              <label htmlFor="orderByLikes">Ordenar por número de likes</label>
            </div>
            <div>
              <input type="checkbox" name="orderBy" id=""
                onClick={() => { !hidAnswered ? setHidAnswered(true) : setHidAnswered(false) }} />
              <label htmlFor="hidAnswered">
                Esconder questões respondidas</label>
            </div>
          </div>
        </div>

        <div className="question-list">
          {(!questions.length && selectedCategories.length === 0) ?
            <div className='empty-questions'>
              <img src={emptyQuestionsImg} alt='Nenhuma pergunta feita ainda' />
              <p>Ainda não existem perguntas a serem respondidas!</p>
            </div>
            :
            shownQuestions.map(question => {
              return (
                <Question
                  key={question.id}
                  content={question.content}
                  author={question.author}
                  isAnswered={question.isAnswered}
                  isHighlighted={question.isHighlighted}
                >{!question.isAnswered && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleCheckQuestionAsAnswered(question.id)}
                      >
                        <img src={checkImg} alt="Marcar pergunta como respondida" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleHighlightQuestion(question.id)}
                      >
                        <img src={answerImg} alt="Dar destaque à pergunta" />
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDeleteQuestion(question.id)}
                  >
                    <img src={deleteImg} alt="Remover pergunta" />
                  </button>                    
                </Question>
              )
            })
          }
          {(!shownQuestions.length && questions.length !== 0) ?
            <div className='empty-questions'>
              <img src={emptyQuestionsImg} alt='Nenhuma pergunta na categoria selecionada' />
              <p>Não foram encontradas perguntas com as tags selecionadas!</p>
            </div>
            : ''}
        </div>
      </main>
    </div>
  )
}






