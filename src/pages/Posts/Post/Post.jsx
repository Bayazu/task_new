import React, {useContext, useEffect, useState} from 'react';
import dayjs from "dayjs";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import {Link, useParams} from "react-router-dom";
import axios from "axios";
import {UserContext} from "../../UserAuth/UserAuth";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Modal from "../../../components/Modal/Modal";
import {Navigate} from "react-router-dom";
import {useNavigate} from "react-router";

const pictureClose = require('../../../Picture/chatClose.svg').default;
const commentPicture = require('../../../Picture/chatPic.svg').default;
const editPicture = require('../../../Picture/edit-icon.svg').default;
const baseURL = `http://test.flcd.ru/api/`;

const Post = (props) => {

    //переписать на useHookForm
    const navigate = useNavigate()

    const {userData, userAuth, tokenData} = useContext(UserContext)
    const {id} = useParams()

    const [post, setPost] = useState([])
    const [getData, setGetData] = useState(false)

    const [comments, setComments] = useState([])
    const [commentsReplyVisibility, setCommentsReplyVisibility] = useState(false)

    const [inputValue, setInputValue] = useState('')
    const [inputError, setInputError] = useState(true)
    const [formValid, setFormValid] = useState(false)

    const [inputEditCommentValue, setInputEditCommentValue] = useState('')
    const [inputEditCommentError, setInputEditCommentError] = useState(true)
    const [formEditValid, setFormEditValid] = useState(false)
    const [modalEditCommentActive, setModalEditCommentActive] = useState(false)

    const [commentId, setCommentId] = useState(null)
    const [inputReplyCommentValue, setInputReplyCommentValue] = useState('')
    const [inputReplyError, setInputReplyError] = useState(true)
    const [formReplyValid, setFormReplyValid] = useState(false)
    const [replyCommentModalActive, setReplyCommentModalActive] = useState(false)


    const [alertSuccessPostComment, setAlertSuccessPostComment] = useState(false)
    const [alertSuccessEditComment, setAlertSuccessEditComment] = useState(false)
    const [alertSuccessDeleteComment, setAlertSuccessDeleteComment] = useState(false)
    const [modalActive, setModalActive] = useState(false)


    const [redirect, setRedirect] = useState(false)

    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', 'Bearer ' + tokenData);

    useEffect(() => {
        axios.get(`${baseURL}post/${id}`)
            .then((res) => {
                setPost(res.data);
                console.log(res.data)
            })
            .catch((error) => console.error(error))
    }, []);


    useEffect(() => {
        axios.get(`${baseURL}post/${id}/comments`)
            .then((res) => {
                setComments(res.data);
                console.log(res.data)
            })
            .catch((error) => console.error(error))
    }, [getData]);

    const createComment = async (e) => {
        e.preventDefault();
        await fetch('http://test.flcd.ru/api/comment', {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify({
                text: inputValue,
                post_id: id
            })
        }).then((res) => {
            if (res.status === 200) {
                setGetData((prevState => !prevState))
                setInputValue('')
                setFormValid(false)
                setAlertSuccessPostComment(true)
            }
        }).catch((errors) => console.error(errors))
    }
    const replyToComment = async (e) => {
        e.preventDefault()
        await fetch('http://test.flcd.ru/api/comment', {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify({
                text: inputReplyCommentValue,
                post_id: id,
                reply_to_comment: commentId
            })
        }).then((res) => {
            if (res.status === 200) {
                setGetData((prevState => !prevState))
                setAlertSuccessPostComment(true)
                setFormReplyValid(false)
                setInputReplyCommentValue('')
                setReplyCommentModalActive(false)
            }
        }).catch((errors) => console.error(errors))
    }

    const editComment = async (e) => {
        e.preventDefault()
        await fetch(`http://test.flcd.ru/api/comment/${commentId}`, {
            method: 'PATCH',
            headers: myHeaders,
            body: JSON.stringify({
                text: inputEditCommentValue,
                id: commentId
            })
        }).then((res) => {
            if (res.status === 200) {
                setGetData((prevState => !prevState))
                setAlertSuccessEditComment(true)
                setFormEditValid(false)
                setInputEditCommentValue('')
                setReplyCommentModalActive(false)
                setModalEditCommentActive(false)
            }
        }).catch((errors) => console.error(errors))
    }


    const deletePost = async (id) => {
        await fetch(`http://test.flcd.ru/api/post/${id}`, {
            method: 'delete',
            headers: myHeaders,
            body: JSON.stringify(id)
        }).then((res) => {
            if (res.status === 200) {
                setModalActive(true)
            }
        }).catch((errors) => console.error(errors))
    }
    const deleteComment = async (idComment) => {
        await fetch(`http://test.flcd.ru/api/comment/${idComment}`, {
            method: 'delete',
            headers: myHeaders,
            body: JSON.stringify(id)
        }).then((res) => {
            if (res.status === 200) {
                setAlertSuccessDeleteComment(true)
                setGetData((prevState => !prevState))

            }
        }).catch((errors) => console.error(errors))
    }


    useEffect(() => {
        if (inputError) {
            setFormValid(false)
        } else {
            setFormValid(true)
        }
        if (inputReplyError) {
            setFormReplyValid(false)
        } else {
            setFormReplyValid(true)
        }
    }, [inputError, inputReplyError])

    useEffect(()=>{
        if (inputEditCommentError) {
            setFormEditValid(true)
        } else {
            setFormEditValid(false)
        }
    },[inputEditCommentError])

    const inputHandler = (e) => {
        setInputValue(e.target.value)
        if (!e.target.value) {
            setInputError(true)
        } else {
            setInputError(false)
        }
    }

    const inputCommentHandler = (e) => {
        setInputReplyCommentValue(e.target.value)
        if (!e.target.value) {
            setInputReplyError(true)
        } else {
            setInputReplyError(false)
        }
    }

    const inputEditCommentHandler = (e) => {
        setInputEditCommentValue(e.target.value)
        if (!e.target.value) {
            setInputEditCommentError(false)
        } else {
            setInputEditCommentError(true)
        }
    }

    const viewReplies = () => {
        setCommentsReplyVisibility((prevState => !prevState))
    }

    const setDataReplyCommentId = (commentId) => {
        setCommentId(commentId)
        setReplyCommentModalActive(true)
    }
    const setEditCommentId = (commentId) => {
        setCommentId(commentId)
        setModalEditCommentActive(true)
    }

    if (redirect) {
        return <Navigate to='/posts'/>
    }

    return (
        <div>
            <div style={{position: "sticky", top: 0}}>
                {alertSuccessPostComment
                    ? <Alert onClose={() => {
                        setAlertSuccessPostComment(false)
                    }} severity="success">
                        Вы успешно оставили комментарий!</Alert>
                    : null}
            </div>
            <div style={{position: "sticky", top: 0}}>
                {alertSuccessDeleteComment
                    ? <Alert onClose={() => {
                        setAlertSuccessDeleteComment(false)
                    }} severity="success">
                        Вы успешно удалили комментарий!</Alert>
                    : null}
            </div>
            <div style={{position: "sticky", top: 0}}>
                {alertSuccessEditComment
                    ? <Alert onClose={() => {
                        setAlertSuccessEditComment(false)
                    }} severity="success">
                        Вы успешно изменили комментарий!</Alert>
                    : null}
            </div>
            <Box
                p={5}
                sx={{
                    padding: 5,
                    maxWidth: 900,
                    alignItems: 'center',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                }}>
                <Paper>
                    <Box p={5}>
                        {post.text}
                        <div className="delete-post-pic">
                            {
                                (userData) && (userData.id === post.user_id)
                                    ? <img
                                        className='filter-red'
                                        src={pictureClose}
                                        alt={'someText'}
                                        onClick={() => deletePost(post.id)}
                                    />
                                    : null
                            }
                        </div>
                        <div className="edit-icon">
                            {
                                (userData) && (userData.id === post.user_id)
                                    ? <img
                                        src={editPicture}
                                        alt={'someText'}
                                        onClick={() => navigate(`/editPost/${post.id}`)}
                                    />
                                    : null
                            }
                        </div>
                        <Box mt={10}>
                            <div className='comments'>
                                {comments.length}
                                <div className="comments-pic">
                                    <img
                                        src={commentPicture}
                                        alt={'someText'}
                                    />
                                </div>
                            </div>
                        </Box>
                        <Box sx={{float: 'right'}}>
                            <div>
                                Дата создания {dayjs(post.created_at).format('DD.MM.YYYY')}
                            </div>
                            <div>
                                Дата редактирования {dayjs(post.created_at).format('DD.MM.YYYY')}
                            </div>
                        </Box>
                    </Box>
                </Paper>
            </Box>
            <Box
                p={5}
                sx={{
                    marginTop: 0,
                    padding: 0,
                    maxWidth: 300,
                    alignItems: 'center',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                }}>
                <form action="" onSubmit={createComment}>
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
                            Ответить на пост
                        </Button>
                    </div>
                </form>
            </Box>


            {comments.map(comment =>
                <Box p={5}
                     sx={{
                         maxWidth: 900,
                         alignItems: 'center',
                         marginLeft: 'auto',
                         marginRight: 'auto',
                     }}>
                    <Paper>
                        <Box p={5}
                             sx={{
                                 maxWidth: 900,
                                 alignItems: 'center',
                                 marginLeft: 'auto',
                                 marginRight: 'auto',
                             }}>
                            <div>{comment.text}</div>
                            {userAuth
                                ? <>
                                    <div className="delete-post-pic">
                                        {
                                            (userData) && (userData.id === comment.user_id)
                                                ? <img
                                                    className='filter-red'
                                                    src={pictureClose}
                                                    alt={'someText'}
                                                    onClick={() => deleteComment(comment.id)}
                                                />
                                                : null
                                        }
                                    </div>
                                    <div className="edit-icon">
                                        {
                                            (userData) && (userData.id === comment.user_id)
                                                ? <img
                                                    src={editPicture}
                                                    alt={'someText'}
                                                    onClick={() => setEditCommentId(comment.id)}
                                                />
                                                : null
                                        }
                                    </div>
                                    <div onClick={() => setDataReplyCommentId(comment.id)}
                                         className='answer-on-comment'>Ответить на
                                        комментарий
                                    </div>
                                </>
                                : null
                            }
                            <div>
                                <div onClick={viewReplies} className='viewPerlies'>
                                    Показать ответы на комментарий ({comment.replies.length})
                                </div>
                                <div className='replies'>
                                    {commentsReplyVisibility
                                        ? (
                                            <>
                                                {
                                                    comment.replies.map(replie =>
                                                        <Paper>
                                                            <Box p={5} sx={{marginTop: 2}}>
                                                                <div>
                                                                    {replie.text}
                                                                </div>
                                                                <br/>
                                                                {userAuth
                                                                    ? <>
                                                                        <div className="delete-post-pic">
                                                                            {
                                                                                (userData) && (userData.id === replie.user_id)
                                                                                    ? <img
                                                                                        className='filter-red'
                                                                                        src={pictureClose}
                                                                                        alt={'someText'}
                                                                                        onClick={() => deleteComment(replie.id)}
                                                                                    />
                                                                                    : null
                                                                            }
                                                                        </div>
                                                                        <div className="edit-icon">
                                                                            {
                                                                                (userData) && (userData.id === replie.user_id)
                                                                                    ? <img
                                                                                        src={editPicture}
                                                                                        alt={'someText'}
                                                                                        //onClick={() => ))}
                                                                                    />
                                                                                    : null
                                                                            }
                                                                        </div>
                                                                        <div
                                                                            onClick={() => setDataReplyCommentId(comment.id)}
                                                                            className='answer-on-comment'>Ответить на
                                                                            комментарий
                                                                        </div>
                                                                    </>
                                                                    : null
                                                                }
                                                            </Box>
                                                        </Paper>
                                                    )
                                                }
                                            </>
                                        )
                                        : null
                                    }
                                </div>
                            </div>
                        </Box>
                    </Paper>
                </Box>
            )}

            <Modal active={modalActive} setActive={setModalActive}>
                <div className='content'>
                    <div>
                        Вы успешно удалили свой пост
                    </div>
                    <div className='button'>
                        <Button
                            variant="contained"
                            onClick={() => (setRedirect(true))}>Ок
                        </Button>
                    </div>
                </div>
            </Modal>

            <Modal active={replyCommentModalActive} setActive={setReplyCommentModalActive}>
                <Box
                    p={5}
                    sx={{
                        maxWidth: 370,
                        alignItems: 'center',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                    }}>
                    <Box>
                        <form action="" onSubmit="return false;">
                            <TextareaAutosize
                                minRows={10}
                                value={inputReplyCommentValue}
                                style={{width: 300}}
                                onChange={e => inputCommentHandler(e)}
                            />
                            <div className='button'>
                                <Button
                                    sx={{float: 'right'}}
                                    variant="contained"
                                    disabled={!formReplyValid}
                                    type='submit'
                                    onClick={replyToComment}
                                >
                                    Ответить на комментарий
                                </Button>
                            </div>
                        </form>
                    </Box>
                </Box>
            </Modal>

            <Modal active={modalEditCommentActive} setActive={setModalEditCommentActive}>
                <Box
                    p={5}
                    sx={{
                        maxWidth: 370,
                        alignItems: 'center',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                    }}>
                    <Box>
                        <form action="" onSubmit="return false;">
                            <TextareaAutosize
                                minRows={10}
                                value={inputEditCommentValue}
                                style={{width: 300}}
                                onChange={e => inputEditCommentHandler(e)}
                            />
                            <div className='button'>
                                <Button
                                    sx={{float: 'right'}}
                                    variant="contained"
                                    disabled={!formEditValid}
                                    type='submit'
                                    onClick={editComment}
                                >
                                    Редактировать комментарий
                                </Button>
                            </div>
                        </form>
                    </Box>
                </Box>
            </Modal>

        </div>
    );
};

export default Post;

