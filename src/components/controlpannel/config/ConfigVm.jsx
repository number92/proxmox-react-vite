import { useParams } from "react-router-dom"
import { useState, useEffect } from 'react';
import './ConfigVm.css'

function ConfigVm() {
    const { service_group_id } = useParams();
    const [data, setData] = useState(null);

    useEffect(() => {
        // Асинхронная функция, которая загружает данные
        async function fetchData() {
            try {
                const response = await fetch(`http://localcenter/api/${service_group_id}/conf`);
                const data = await response.json();
                setData(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        // Вызываем функцию при первом рендере компонента
        fetchData();
    }, []);
    if (!data) return <div className="loading">Loading...</div>;

    return (
        <div className="conf-stat">
            <div className="configuration">

                <div><span>Core(s):</span><span>{data.vcpu}</span></div>
                <div><span>RAM:</span> <span>{data.ram} ГБ</span></div>
                <div><span>SSD: </span><span>{data.ssd} ГБ</span></div>
                <div><span>IP: </span><span>{data.ip}</span></div>
            </div>
            <div className="statistics"></div>
        </div>
    );
}

export { ConfigVm }


