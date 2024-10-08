import { Link } from 'react-router-dom'
export default function Vm({ service_group_id, vmname, vmid, agrement_id, ip }) {
    const statusVm = 'running'
    console.log(service_group_id)
    return (
        <Link to={String(service_group_id)} >
            <div className={statusVm === "running" ? 'vm-box active-status' : 'vm-box stopped-status'}>
                <h4>ID: {vmid} {vmname}</h4>
                <p>Договор: {agrement_id} </p>
                <p>IP: {ip}</p>

                <span className="vm-status">

                    <i>
                        {statusVm}
                    </i>
                </span>
                <div className="blink"></div>
            </div >
        </Link>

    )
}