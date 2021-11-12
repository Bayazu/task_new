import React, {useContext, useState} from 'react';
import './Navbar.css'
import {Link} from "react-router-dom";
import {UserContext} from "../../pages/UserAuth/UserAuth";


const Navbar = (props) => {

    const [clicked, setClicked] = useState(false)

    const {userAuth} = useContext(UserContext);



    return (
        <nav className='NavbarItems'>
            <h1 className="navbar-logo">Блог<i className=''/></h1>

            <div className='menu-icon' onClick={() => setClicked(!clicked)}>
                <i className={clicked ? 'fas fa-times' : 'fas fa-bars'}/>
            </div>
            <ul className={clicked ? 'nav-menu active' : 'nav-menu'}>
                <li>
                    <Link onClick={() => setClicked(!clicked)} className='nav-links' to="/posts">Посты</Link>
                </li>
                {
                    userAuth
                        ?
                        <>
                            <li>
                                <Link onClick={() => setClicked(!clicked)} className='nav-links' to="/create">Создать пост</Link>
                            </li>
                            <li>
                                <Link onClick={() => props.logout()} className='nav-links' to="/posts">Выйти</Link>
                            </li>

                        </>
                        :
                        <>
                            <li>
                                <Link onClick={() => setClicked(!clicked)} className='nav-links' to="/login">Авторазиция</Link>
                            </li>
                            <li>
                                <Link onClick={() => setClicked(!clicked)} className='nav-links' to="/registration">Регистрация</Link>
                            </li>
                        </>
                }

            </ul>


        </nav>
    );
};


export default Navbar;