import React, {useContext, useEffect, useState} from 'react';

import {Navigate} from "react-router-dom";

import Modal from "../../components/Modal/Modal";

import Button from "@mui/material/Button";
import {UserContext} from "../UserAuth/UserAuth";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";


const Login = () => {

    const {setUserAuth,setTokenData} = useContext(UserContext);

    const [email, setEmail] = useState('')
    const [emailDirty, setEmailDirty] = useState(false)
    const [emailError, setEmailError] = useState('Емайл не может быть пустым')

    const [password, setPassword] = useState('')
    const [passwordDirty, setPasswordDirty] = useState(false)
    const [passwordError, setPasswordError] = useState('Пароль не может быть пустым')

    const [formValid, setFormValid] = useState(false)
    const [redirect, setRedirect] = useState(false)
    const [modalActive, setModalActive] = useState(false)

    useEffect(() => {
        if (emailError || passwordError) {
            setFormValid(false)
        } else {
            setFormValid(true)
        }
    }, [emailError, passwordError])

    const emailHandler = (e) => {
        setEmail(e.target.value)
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(String(e.target.value).toLowerCase())) {
            setEmailError('Неккоректный емайл')
        } else {
            setEmailError('')
        }
    }

    const passwordHandler = (e) => {
        setPassword(e.target.value)
        if (e.target.value.length < 6) {
            setPasswordError('Пароль должен быть длиннее 6 символов')
            if (!e.target.value) {
                setPasswordError('Пароль не может быть пустым')
            }
        } else {
            setPasswordError('')
        }
    }

    const blurHandler = (e) => {
        switch (e.target.name) {
            case 'email' :
                setEmailDirty(true)
                break
            case 'password':
                setPasswordDirty(true)
                break
            default:
                break;
        }
    }
    const submit = async (e) => {
        e.preventDefault(e)
        await fetch('http://test.flcd.ru/api/token', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email,
                password,
            })
        })
            .then (function (response) {
                if (response.status === 422) {
                    setModalActive(true)
                }
                if (response.status === 200) {
                    setRedirect(true)
                    setUserAuth(true)
                }
                return response.text();
            })
            .then(function (data) {
                const token = data.replace(`"token":`, ``).replace(/{|},|}/g, ``).replace(/"/g, ``);
                setUserAuth(true)
                setTokenData(token)
                window.localStorage.setItem('token', token)
            })
            .catch((errors) => console.log(errors))
    }

    if (redirect) {
        return <Navigate to='/posts'/>
    }

    return (
        <div className='main'>
            <Box
                p={5}
                sx={{
                    maxWidth: 900,
                    alignItems: 'center',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                }}>
                <Paper>
                    <Box p={5}>
                        <form className='form' onSubmit={submit}>
                            <h1>Авторизация</h1>
                            <div className='inputs'>
                                {(emailDirty && emailError) && <div style={{color: 'red'}}>{emailError}</div>}
                                <input
                                    onChange={e => emailHandler(e)}
                                    value={email}
                                    onBlur={e => blurHandler(e)}
                                    name='email' type='text'
                                    placeholder='Введите email'/>
                            </div>
                            <div className='inputs'>
                                {(passwordError && passwordDirty) && <div style={{color: 'red'}}>{passwordError}</div>}
                                <input onChange={e => passwordHandler(e)}
                                       value={password} onBlur={e => blurHandler(e)}
                                       name='password'
                                       type='password'
                                       placeholder='Введите пароль'/>
                            </div>

                            <div className='button'>
                                <Button
                                    variant="contained"
                                    disabled={!formValid}
                                    type='submit'>
                                    Войти
                                </Button>
                            </div>
                        </form>
                    </Box>
                </Paper>
            </Box>

            <Modal active={modalActive} setActive={setModalActive}>
                <div className='content'>
                    <div>
                        Вы неверно ввели логин или пароль
                    </div>
                    <div className='button'>
                        <Button
                            variant="contained"
                            onClick={() => (setModalActive(false))}>Ок
                        </Button>
                    </div>
                </div>
            </Modal>

        </div>
    );
};


export default Login;
