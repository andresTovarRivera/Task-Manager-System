import { useEffect } from 'react';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useSelector, useDispatch} from 'react-redux';
import { useLocation } from 'react-router-dom';

import { FormStyled, history, PageStyled } from "../_helpers";
import { authActions } from '../_store';

export { Login };

function Login() {
    const dispatch = useDispatch<any>();
    const authUser = useSelector((x:any) => x.auth.user);
    const authError = useSelector((x:any) => x.auth.error);

    history.location = useLocation();

    useEffect(() => {
        if (authUser) history.navigate('/');
    }, []);

    const validationSchema = Yup.object().shape({
        username: Yup.string().required('Username is required'),
        password: Yup.string().required('Password is required')
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    const { register, handleSubmit, formState } = useForm(formOptions);
    const { errors, isSubmitting } = formState;

    function onSubmit({ username, password } : any) {
        return dispatch(authActions.login({ username, password }));
    }

    return (
        <PageStyled>
            <FormStyled onSubmit={handleSubmit(onSubmit)}>
                <h1 className="login-header">Login</h1>
                <div className="login-header-test">
                    Username: admin<br />
                    Password: 123
                </div>  
                <div className="form-control">
                    <label htmlFor="username">Username</label>
                    <input type="text" {...register('username')} className={`input-control ${errors.username ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.username?.message}</div>
                </div>
                <div className="form-control">
                    <label htmlFor="password">Password</label>
                    <input type="password" {...register('password')} className={`input-control ${errors.password ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.password?.message}</div>
                </div>
                <div className='login-button-section'>
                    <button disabled={isSubmitting} className="submit-btn">
                    {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                        Login
                    </button>
                    <a href="/Register">Register</a>
                </div>
               
                {authError && 
                    <div className="alert alert-danger mt-3 mb-0">{authError.message}</div>
                }              
          </FormStyled>
        </PageStyled>

    )
}