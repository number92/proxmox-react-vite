import './ConsoleVm.css'
import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom"
function ConsoleVm() {
    const { service_group_id } = useParams();
    const [data, setData] = useState(null);
    useEffect(() => {
        // Асинхронная функция, которая загружает данные
        async function fetchData() {
            try {
                const response = await fetch(`https://localcenter/api/${service_group_id}/console`);
                const data = await response.json();
                document.cookie = `PVEAuthCookie=${data["pve_ticket"]}; path=/; domain=localcenter ;`;
                setData(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        if (data) {
            const iframe = document.getElementById('iframe-console')
            iframe.src = data['console']
        }
        // Вызываем функцию при первом рендере компонента
        fetchData();
    }, []);
    return (
        <div className='console-card'>
            <iframe className="iframe" id='iframe-console'></iframe>
        </div>


    )
}

export { ConsoleVm }