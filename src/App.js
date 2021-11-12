import React, {useEffect, useMemo, useState} from 'react';
import {Routes, Route} from "react-router-dom";

import './App.css';

import Login from "./pages/Login/Login";
import Registration from "./pages/Registration/Registration";
import Navbar from "./components/Navbar/Navbar";
import Posts from "./pages/Posts/Posts";
import CreatePost from "./CreatePost/CreatePost";
import Post from "./pages/Posts/Post/Post";
import PageNotFound from "./pages/PageNotFound/PageNotFound";
import EditPost from "./pages/EditPost/EditPost";

import {UserContext} from "./pages/UserAuth/UserAuth";


const App = () => {

    const token = localStorage.getItem('token');

    const [tokenData, setTokenData] = useState(token)
    const [userAuth, setUserAuth] = useState(false)
    const [userData, setUserData] = useState()

    useEffect(() => {
        if (token) {
            setUserAuth(true)
        }
    })

    const providerValue = useMemo(() => (
            {
                tokenData,
                setTokenData,
                userAuth,
                setUserAuth,
                userData,
                setUserData

            }),
        [tokenData, setTokenData, userAuth, setUserAuth, userData, setUserData])

    const logout = () => {
        setUserAuth(false)
        setTokenData(null)
        setUserData([])
        localStorage.removeItem("token");
    }

    //изменить на протектед роуты
    return (
        <div className='App'>
            <UserContext.Provider value={providerValue}>
                <Navbar logout={logout}/>
                <div className='app-wrapper-content'>
                    <Routes>
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/create" element={<CreatePost/>}/>
                        <Route path="/posts" element={<Posts/>}/>
                        <Route path="/post/:id" element={<Post/>}/>
                        <Route path="/registration" element={<Registration/>}/>
                        <Route path="/:pageName" element={<PageNotFound/>}/>
                        <Route path="/editPost/:id" element={<EditPost/>}/>
                    </Routes>
                </div>
            </UserContext.Provider>

        </div>

    );
}

export default App;
