import React, { useContext, useEffect } from 'react';

import { AuthContext } from '../context/Auth.context.js';
import ax from '../conf/ax.js';

const StudentHome = () => {
    useEffect(() => {
        const fetchBooks = async () => {
            const result = await ax.get('users/me?populate=role')
            console.log(result.data.role.type)
        }
        fetchBooks()
    }, [])
    const { state: ContextState, logout } = useContext(AuthContext);
    const { user } = ContextState


    return (
        <div className="row">

            <div className="col-sm-8">
                <h1>

                </h1>
            </div>

            <div className="col-sm-4">
                <h1>

                </h1>
            </div>
        </div>
    );
}

export default StudentHome;