import { useEffect, useState } from "react"
import { database } from "../services/firebase"
import { useAuth } from '../hooks/useAuth';


type QuestionType = {
  id: string;
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
  likeCount: number;
  likeId: string | undefined;
  categories?: Array<string>;
  author:{
    name: string;
    avatar: string;
  }
  
}

type FirebaseQuestions = Record<string, {
  author:{
    name: string;
    avatar: string;
  }
  categories?: Array<string>;
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
  likes: Record<string, {
    authorId: string;
  }>
}>


export function useRoom(roomId: string){
  const [questions, setQuestions] = useState<QuestionType[]>([])
  const [title, setTitle] = useState('') 
  const [availableCategories, setAvailableCategories] = useState([])
  

  const {user} = useAuth();

  // Desmentra dados do firebase e retorna como objeto com os dados da question
  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`)
    roomRef.on('value', room => {
      const databaseRoom = room.val();
      setAvailableCategories(databaseRoom.settings.categories.split('-').map((item:string)=> {return item.trim()}))
      const timeInterval = databaseRoom.settings.timeInterval
      const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};
      const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) =>{
        return{
          id: key,
          content: value.content,
          author: value.author,
          isHighlighted: value.isHighlighted,
          isAnswered: value.isAnswered,
          categories: value.categories,
          likeCount: Object.values(value.likes ?? {}).length, //Se houver likes, faz a contagem
          likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0],
        }
      })
      setQuestions(parsedQuestions)
      setTitle(databaseRoom.title)
    })

    return () => {
      roomRef.off('value')
    }
  }, [roomId, user?.id]);

  return {questions, title, availableCategories}

}