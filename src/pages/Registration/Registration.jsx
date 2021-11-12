import React, {useEffect, useState} from 'react';
import {Navigate} from 'react-router-dom';

import Button from '@mui/material/Button';
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";

import './registration.css'
import Modal from "../../components/Modal/Modal";


const Registration = () => {

    //переписать на useHookForm

    const [name, setName] = useState('')
    const [nameDirty, setNameDirty] = useState(false)
    const [nameError, setNameError] = useState('Имя не может быть пустым')

    const [email, setEmail] = useState('')
    const [emailDirty, setEmailDirty] = useState(false)
    const [emailError, setEmailError] = useState('Емайл не может быть пустым')

    const [password, setPassword] = useState('')
    const [passwordDirty, setPasswordDirty] = useState(false)
    const [passwordError, setPasswordError] = useState('Пароль не может быть пустым')

    const [passwordConfirmation, setPasswordConfirmation] = useState('')
    const [passwordConfirmationDirty, setPasswordConfirmationDirty] = useState(false)
    const [passwordConfirmationError, setPasswordConfirmationError] = useState('Пароль не может быть пустым')

    const [formValid, setFormValid] = useState(false)
    const [redirect, setRedirect] = useState(false)

    const [modalSuccessReg, setModalSuccessReg] = useState(false)
    const [modalErrorReg, setModalErrorReg] = useState(false)

    const registration = async (e) => {
        e.preventDefault();
        const password_confirmation = passwordConfirmation
        await fetch('http://test.flcd.ru/api/register', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                name,
                email,
                password,
                password_confirmation
            })
        }).then((res) => {
            if (res.status === 422) {
                setModalErrorReg(true)
            }
            if (res.status === 200) {
                setModalSuccessReg(true)
            }
        }).catch((errors) => console.log(errors))
    }

    useEffect(() => {
        if (emailError || passwordError || nameError || passwordConfirmationError) {
            setFormValid(false)
        } else {
            setFormValid(true)
        }
    }, [emailError, passwordError, nameError, passwordConfirmationError])

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

    const passwordConfirmationHandler = (e) => {
        setPasswordConfirmation(e.target.value)
        if (password !== e.target.value) {
            setPasswordConfirmationError('Пароли не совпадают')
        } else {
            setPasswordConfirmationError('')
        }
    }

    const nameHandler = (e) => {
        setName(e.target.value)
        if (!e.target.value) {
            setNameError('Имя не может быть пустым')
        } else {
            setNameError('')
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
            case 'name' :
                setNameDirty(true)
                break
            case 'passwordConfirmation':
                setPasswordConfirmationDirty(true)
                break
            default:
                break;
        }
    }

    if (redirect) {
        return <Navigate to='/login'/>
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
                        <form className='form' onSubmit={registration}>
                            <h1>Регистрация</h1>

                            <div className='inputs'>
                                {(nameDirty && nameError) && <div style={{color: 'red'}}>{nameError}</div>}
                                <input
                                    onChange={e => nameHandler(e)}
                                    value={name}
                                    onBlur={e => blurHandler(e)}
                                    name='name' type='text'
                                    placeholder='Введите имя'/>
                            </div>

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

                            <div className='inputs'>
                                {(passwordConfirmationError && passwordConfirmationDirty) &&
                                <div style={{color: 'red'}}>{passwordConfirmationError}</div>}
                                <input onChange={e => passwordConfirmationHandler(e)}
                                       value={passwordConfirmation} onBlur={e => blurHandler(e)}
                                       name='passwordConfirmation'
                                       type='password'
                                       placeholder='Введите пароль'/>
                            </div>

                            <div className='button'>
                                <Button
                                    variant="contained"
                                    disabled={!formValid}
                                    type='submit'
                                    onClick={() => (setModalErrorReg(false))}>Зарегестрироваться
                                </Button>
                            </div>

                        </form>
                    </Box>
                </Paper>
            </Box>

            <Modal active={modalErrorReg} setActive={setModalErrorReg}>
                <div className='content'>
                    <div>
                        Данный емайл уже существует
                    </div>
                    <div className='button'>
                        <Button
                            variant="contained"
                            onClick={() => (setModalErrorReg(false))}>Ок
                        </Button>
                    </div>
                </div>
            </Modal>
            <Modal active={modalSuccessReg} setActive={setModalSuccessReg}>
                <div className='contentReg'>
                    <div>
                        Вы успешно зарегестрировались!
                    </div>
                    <div className='buttonReg'>
                        <Button
                            color="success"
                            variant="contained"
                            onClick={() => (setRedirect(true))}>Авторизироваться
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Registration;