import './ConsoleVm.css'

import { StartConsole } from './RunTerminal';
import { createPortal } from 'react-dom';
import { useEffect, useState, useRef } from 'react';
import { useParams } from "react-router-dom"

import '@xterm/xterm/css/xterm.css'

function ConsoleVm() {


    const { service_group_id } = useParams();


    const [Terminal, setTerminal] = useState(null);
    const [input, setInput] = useState('');
    return (
        <div className='console-card' >

            <div className='iframe-wrap' id='iframe-wrap' >
                <StartConsole />
            </div>




        </div >
    )
};
export { ConsoleVm }

// const onTermInit = (term) => {
//     setTerminal(term);
//     term.reset();
//     term.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ');
// };

// const onTermDispose = (term) => {
//     setTerminal(null);
// };

// const handleData = (data) => {
//     if (Terminal) {
//         const code = data.charCodeAt(0);
//         // If the user hits empty and there is something typed echo it.
//         if (code === 13 && input.length > 0) {
//             Terminal.write("\r\nYou typed: '" + input + "'\r\n");
//             Terminal.write('echo> ');
//             setInput('');
//         } else if (code < 32 || code === 127) {
//             console.log('Control Key', code);
//             // Disable control Keys such as arrow keys
//             return;
//         } else {
//             // Add general key press characters to the terminal
//             Terminal.write(data);
//             setInput(input + data);
//         }
//     }
// };
// wrap.appendChild(iframe)