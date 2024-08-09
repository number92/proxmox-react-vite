import './ConsoleVm.css'
import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom"
function ConsoleVm() {
    try {
        const { service_id } = useParams();
        const [data, setData] = useState(null);
        useEffect(() => {

            async function fetchData() {
                try {
                    const response = await fetch(`https://localcenter.ru/api/v1/proxmox/vms/${service_id}/console`);
                    const data = await response.json();
                    const expDate = new Date(new Date().getTime() + 60 * 1000);

                    //document.cookie = `PVEAuthCookie=${data["pve_ticket"]}; path=/; domain=localcenter; SameSite=lax; secure`
                    setData(data);
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            }
            // Вызываем функцию при первом рендере компонента
            fetchData();
        }, []);
        if (data) {
            console.log(data)

            const iframe = document.getElementById('iframe-console')


            iframe.src = data['console']



            // const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
            // iframeDocument.cookie = `PVEAuthCookie=${data["pve_ticket"]}; path=/; domain=.localcenter; SameSite=lax;`
            //  src={data['console']} sandbox="allow-scripts allow-same-origin"

        }

    } catch (err) {
        console.error("Ошибка в iframe", err);
    }
    return (
        <div className='console-card'>
            <iframe className="iframe" id='iframe-console' ></iframe>
        </div >


    )

}

export { ConsoleVm }