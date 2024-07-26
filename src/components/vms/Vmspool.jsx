

import './Vms.css'

import { dataVms } from './data'
import Vm from './VMcard'

export default function VmsPool() {

    return (
        <div className='vms'>
            {dataVms.map(vm => <Vm key={vm.vmname} {...vm} />)}
        </div >
    )
}