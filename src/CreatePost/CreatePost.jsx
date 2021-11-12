import React, {useContext, useEffect, useState} from 'react';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {UserContext} from "../pages/UserAuth/UserAuth";
import Alert from "@mui/material/Alert";


const CreatePost = () => {
    const {tokenData} = useContext(UserContext);

    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', 'Bearer ' + tokenData);

    const [inputValue, setInputValue] = useState()
    const [inputError, setInputError] = useState(true)
    const [formValid, setFormValid] = useState(false)
    const [postCreated, setPostCreated] =useState(false)
    const [alertSuccess, setAlertSuccess] = useState(false)

    const createPost = (e) => {
        e.preventDefault();
        const text = inputValue
        fetch('http://test.flcd.ru/api/post', {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify({
                text
            })
        }).then((res) => {
            if (res.status === 200) {
                setAlertSuccess(true)
                setInputValue('')
                setFormValid(false)
            }
        }).catch((errors) => console.error(errors))
    }

    useEffect(() => {
        if (inputError) {
            setFormValid(false)
        } else {
            setFormValid(true)
        }
    }, [inputError])

    const inputHandler = (e) => {
        setInputValue(e.target.value)
        if (!e.target.value) {
            setInputError(true)
        } else {
            setInputError(false)
        }
    }

    return (
        <div>
            <div style={{position:"sticky", top:0}}>
                {alertSuccess
                    ? <Alert onClose={() => {setAlertSuccess(false)}} severity="success">Вы успешно создали пост!</Alert>
                    : null
                }
            </div>

            <Box
                p={5}
                sx={{
                    maxWidth: 370,
                    alignItems: 'center',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                }}>
                <Box>
                    <form action="" onSubmit={createPost}>
                        <TextareaAutosize
                            minRows={10}
                            value={inputValue}
                            style={{width: 300}}
                            onChange={e => inputHandler(e)}
                        />
                        <div className='button'>
                            <Button
                                sx={{float: 'right'}}
                                variant="contained"
                                disabled={!formValid}
                                type='submit'>
                                Создать пост
                            </Button>
                        </div>
                    </form>
                </Box>
            </Box>

        </div>
    );
};

export default CreatePost;