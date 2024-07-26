import './Buttons.css'


function Button({ children, handleClick }) {

    return <button type='button' className='button' onClick={handleClick}>{children}</button>
}

export { Button }