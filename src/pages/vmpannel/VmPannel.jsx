import './VmPannel.css'
import { Route, Routes, NavLink, Navigate, Link, useNavigate } from "react-router-dom";
import { ConfigVm } from '../../components/controlpannel/config/ConfigVm';
import { ConsoleVm } from '../../components/controlpannel/console/ConsoleVm';
import { SendTicket } from '../../components/controlpannel/SendTicket';
import { Button } from '../../components/buttons/Button'
function VmPannel() {
    const navigate = useNavigate();
    const goBack = () => navigate('/vms/')
    return (
        <div className="vm-pannel">

            <h4>Панель управления</h4>
            <div className='nav-switcher'>


                <NavLink to='conf'>Конфигурация</NavLink>
                <NavLink to='console'>Консоль</NavLink>
                <NavLink to='send-ticket'>Создать тикет</NavLink>

            </div>
            <Routes>
                <Route path='/'>
                    <Route index element={<Navigate to='conf' replace />} />
                    <Route path='conf' element={<ConfigVm />} />
                    <Route path='console' element={<ConsoleVm />} />
                    <Route path='send-ticket' element={<SendTicket />} />
                </Route>
            </Routes>
            <div>

                <button className='button btn back' onClick={goBack}>Назад</button>
            </div>
        </div>

    )
}

export { VmPannel };