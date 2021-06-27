import { ButtonHTMLAttributes } from 'react'
import '../styles/chip.scss'
type ChipsPropsTypes = ButtonHTMLAttributes<HTMLButtonElement> & {
  isSelected?: boolean;
}

export function Chip({isSelected=false, ...props}: ChipsPropsTypes){
  return (
    <button type='button'{...props}></button>
  ) 
}