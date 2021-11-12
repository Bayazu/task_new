import React from 'react';
import {useParams} from "react-router-dom";

const PageNotFound = () => {

    const params = useParams()

    return (
        <div>
            <h1>Страница "{params.pageName}" не найдена</h1>
        </div>
    );
};

export default PageNotFound;