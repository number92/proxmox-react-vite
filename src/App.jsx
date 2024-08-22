import './App.css'
import SidebarMenu from './components/sidebar/Sidebar'
import VmsPool from './components/vms/Vmspool'
import { Routes, Route, Outlet } from 'react-router-dom'
import { HomePage } from './pages/HomePages'
import { Notfoundpage } from './pages/Notfoundpage'
import { VmPannel } from './pages/vmpannel/VmPannel'
import { ConfigVm } from './components/controlpannel/config/ConfigVm'


export default function App() {
  return (
    <>

      <div className='main-container'>

        <aside>
          <SidebarMenu />
        </aside>
        <main className='main-content'>

          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/vms' element={<VmsPool />} />
            <Route path='/vms/:service_group_id/*' element={<VmPannel />}>

            </Route>

            <Route path='*' element={<Notfoundpage />} />

          </Routes>

        </main>

      </div >
    </>
  )
}

