import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { FormStyled, history, PageStyled } from "../_helpers";
import { userActions } from '../_store';

export { Register };

function Register() {
    const dispatch = useDispatch<any>();
    const userError = useSelector((x:any) => x.user.error);

    history.location = useLocation();

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('User name is required'),
        email: Yup.string().email().required('Email is required'),
        password: Yup.string().required('Password is required')
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    const { register, handleSubmit, formState } = useForm(formOptions);
    const { errors, isSubmitting } = formState;

    function onSubmit({ name, password, email } : any) {
        return dispatch(userActions.CreateAccount({ name, password, email }));
    }

    return (
        <PageStyled>
            <FormStyled onSubmit={handleSubmit(onSubmit)}>
                <h1 className="login-header">Register</h1>
                <div className="form-control">
                    <label htmlFor="name">User name</label>
                    <input type="text" {...register('name')} className={`input-control ${errors.name ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.name?.message}</div>
                </div>
                <div className="form-control">
                    <label htmlFor="password">Password</label>
                    <input type="password" {...register('password')} className={`input-control ${errors.password ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.password?.message}</div>
                </div>
                  <div className="form-control">
                    <label htmlFor="email">Email</label>
                    <input type="email" {...register('email')} className={`input-control ${errors.password ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.email?.message}</div>
                </div>
                <button disabled={isSubmitting} className="submit-btn">
                    {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                    Registre
                </button>
                {userError && 
                    <div className="alert alert-danger mt-3 mb-0">{userError.message}</div>
                }              
          </FormStyled>
        </PageStyled>

    )
}