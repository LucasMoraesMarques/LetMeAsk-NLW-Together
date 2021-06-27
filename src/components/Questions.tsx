import { ReactNode } from 'react'
import { useTheme } from '../hooks/useTheme'
import '../styles/question.scss'

type QuestionProps = {
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  children?: ReactNode;
  isAnswered?: boolean;
  isHighlighted?: boolean;
}

export function Question({content, author, children, isAnswered=false, isHighlighted=false}: QuestionProps){
  const { theme } = useTheme()
  return(
    <div className={`question ${theme} ${isAnswered ? 'answered': ''} ${(isHighlighted && !isAnswered) ? 'highlighted': ''}`}>
      <p>{content}</p>
      <footer>
        <div className="user-info">
          <img src={author.avatar} alt={author.name}/>
          <span>{author.name}</span>
        </div>
        <div>
          {children} {/* Botao de likes */}
        </div>
      </footer>
    </div>
  )
}