import { FC } from "react"
interface Props {
    text:string,
    className:string,
    click: () => void
}
const Button:FC<Props> = (props:Props) => {
    return (
        <button className={props.className} onClick={props.click}>{props.text}</button>
    )
}

export default Button
