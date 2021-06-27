// Hooks, types and services
import { useAuth } from '../hooks/useAuth';
import { useRoom } from '../hooks/useRoom';
//import { useRules } from '../hooks/useRules';

import { FormEvent, useState, useEffect} from 'react';
import { Link, useParams } from 'react-router-dom'
import { database, auth } from '../services/firebase';
// Components
import { Button } from '../components/Buttons'
import { Question } from '../components/Questions';
import { RoomCode } from '../components/RoomCode';
import { Chip } from '../components/Chips';
import { ToastContainer, toast } from 'react-toastify';
import Modal from 'react-modal';

// Images and styles
import logoImg from '../assets/images/logo.svg'
import emptyQuestionsImg from '../assets/images/empty-questions.svg'
import '../styles/room.scss';
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from '../hooks/useTheme';


type RoomsParams = {
  id: string;
}

export function Room() {
  const { user, signInWithGoogle, signOut } = useAuth()
  const {theme, toggleTheme} = useTheme()
  const params = useParams<RoomsParams>()
  const roomId = params.id
  const [newQuestion, setNewQuestion] = useState('')
  const { title, questions, availableCategories } = useRoom(roomId)
  const [shownCategories, setShownCategories] = useState<Array<string>>([])
  const [selectedCategories, setSelectedCategories] = useState<Array<string>>([])
  const [orderByLikes, setOrderByLikes] = useState(false)
  const [hidAnswered, setHidAnswered] = useState(false)
  const [shownQuestions, setShownQuestions] = useState(questions)

  /*const {availableCategories,
    setavailablecategories,
    timeInterval,
    settimeinterval,
    userExceedLimit,
    setuserexceedlimit,
    questionLimit, 
    setquestionlimit} = useRules()*/
  

  async function handleSendQuestion(event: FormEvent) {
    event.preventDefault()
    
    const question = {
      content: newQuestion,
      author: {
        name: user!.name,
        avatar: user!.avatar,
      },
      isHighlighted: false,
      isAnswered: false,
      categories: (!selectedCategories.length ? ['default']: selectedCategories),
    }

    await database.ref(`rooms/${roomId}/questions`).push(question);
    setNewQuestion('')
    setSelectedCategories([''])
  }

  async function handleLikeQuestion(questionId: string, likeId: string | undefined) {
    if (likeId) {
      await database.ref(`rooms/${roomId}/questions/${questionId}/likes/${likeId}`).remove()
    }
    else {
      await database.ref(`rooms/${roomId}/questions/${questionId}/likes`).push({
        authorId: user?.id,
      })
    }
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
      setShownQuestions(shownQuestions.sort((a, b) =>{
      return b.likeCount - a.likeCount}))
    }

    if(hidAnswered){
      setShownQuestions(shownQuestions.filter((question) =>{
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
          <div className='menu-area'>
            <div className="menu-mobile-opener" onClick={openMenuMobile}>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div className='menu'>
              <Button type='button'  onClick={toggleTheme}>{theme}</Button>
              <div>
                <RoomCode code={roomId}></RoomCode>
              </div>
              <Link to={`${roomId}`} style={{textDecoration: 'none'}}
              onClick={()=>{signOut()}}><Button isOutlined >Logout</Button></Link>
              <Link to='/' style={{textDecoration: 'none'}}><Button isOutlined>Sair</Button></Link>
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
           <Button isOutlined
           onClick={() => alert(`Esta sala somente permite perguntas das seguintes categorias ${availableCategories.join(' - ')}`)}>
           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-info-circle-fill" viewBox="0 0 16 16">
          <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
        </svg>
             Regras</Button>
          </div>
        </div>
        <form onSubmit={handleSendQuestion}>
          <p>Adicione tags à sua pergunta e obtenha maior atenção!</p>
          <div className="chips">
            {availableCategories.map((value, index) => {
              return <Chip key={index} onClick={() => handleSelectedCategories(value)}
                className={selectedCategories.includes(value) ? `chip selected ${theme}` : `chip ${theme}`}>{value}</Chip>
            })}
          </div>
          <textarea placeholder="O que você quer perguntar?"
            required
            onChange={event => setNewQuestion(event.target.value)} value={newQuestion}></textarea>
          <div className="form-footer">
            {user ?
              <div className='user-info'>
                <img src={user.avatar} alt={user.name} />
                <span>{user.name}</span>
              </div>
              : (<span>Para enviar uma pergunta, <button type='button' onClick={()=>{signInWithGoogle()}}>faça seu login</button></span>)}
            <div>
              <Button disabled={!user || !newQuestion || !selectedCategories.length} type="submit"
              onClick={()=>{toast.dark('🙋 Pergunta enviada com sucesso!')}}>Enviar pergunta</Button>
              <ToastContainer/>
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
        style={{display:'none'}}>
          <div className="chips" >
            <span>Filtrar por categorias</span>
            {availableCategories.map((value, index) => {
              return <Chip key={index} onClick={() => handleShownCategories(value)}
              className={shownCategories.includes(value)?`chip selected ${theme}` : `chip  ${theme}`}>{value}</Chip>
            })}
          </div>
          <div className="orderAndHid">
            <div>
              <input type="checkbox" name="orderByLikes" id="" onClick={() => {!orderByLikes ?setOrderByLikes(true) : setOrderByLikes(false)}}/>
              <label htmlFor="orderByLikes">Ordenar por número de likes (habilite esconder respondidas)</label>
            </div>
            <div>
              <input type="checkbox" name="orderBy" id="" 
              onClick={() => {!hidAnswered ?setHidAnswered(true) : setHidAnswered(false)}}/>
              <label htmlFor="hidAnswered">
              Esconder questões respondidas</label>
            </div>
          </div>
        </div>
        </form>
        
        <div className="question-list">
        {(!questions.length)?  
          <div className='empty-questions'>
          <img src={emptyQuestionsImg} alt='Nenhuma pergunta feita ainda'/> 
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
                  <button
                    className={`like-button ${question.likeId ? 'liked' : ''}`}
                    type='button'
                    aria-label='Marcar como gostei'
                    onClick={() => handleLikeQuestion(question.id, question.likeId)}>
                    {question.likeCount > 0 && <span>{question.likeCount}</span>}
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2L7 11V22H18.28C18.7623 22.0055 19.2304 21.8364 19.5979 21.524C19.9654 21.2116 20.2077 20.7769 20.28 20.3L21.66 11.3C21.7035 11.0134 21.6842 10.7207 21.6033 10.4423C21.5225 10.1638 21.3821 9.90629 21.1919 9.68751C21.0016 9.46873 20.7661 9.29393 20.5016 9.17522C20.2371 9.0565 19.9499 8.99672 19.66 9H14Z" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>)}
                </Question>
            )})
        }
        {(!shownQuestions.length && questions.length !== 0) ?
        <div className='empty-questions'>
        <img src={emptyQuestionsImg} alt='Nenhuma pergunta na categoria selecionada'/> 
        <p>Não foram encontradas perguntas com as tags selecionadas!</p>
        </div>
        : ''}
        </div>
      </main>
    </div>
  )
}


