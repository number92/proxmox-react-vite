import { sideItem } from './data.js'
import './Sidebar.css'
import { Link } from 'react-router-dom'


function ListItem({ title, icon, path }) {
    return (
        <Link to={path}>
            <li>
                <img src={icon} width="20" height="20" alt={title} />

                <strong>{title}</strong>

            </li >
        </Link >
    )
}


export default function SidebarMenu() {

    return (
        <div className='sidebar'>
            <ul>
                {sideItem.map(liItem => <ListItem key={liItem.title} {...liItem} />)}
            </ul>
        </div>


    )
}