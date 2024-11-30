import React, {useState} from 'react';
import {useFormik} from "formik";
import * as Yup from "yup";
import {InputLabel} from "@mui/material";
import BootstrapInput from "../../shared/BootstrapInput";
import {useNavigate} from "react-router-dom";


const Login = ({setIsAuthenticated}) => {
    const navigate = useNavigate();
    const [error, setError] = useState(false);
    const user = {
        email:'playhouseAdmin',
        password:'Play@house2024'
    }

    const formik = useFormik({
        initialValues: {
            email:'',
            password:''
        },
        validationSchema:Yup.object({
                email: Yup.string().required('**User Name is Required'),
                password: Yup.string().required('**Password is Required'),


        }),
        onSubmit: async (values) => {
            console.log('Form values:', values);
            if(values.email ===user.email && values.password ===user.password){
                setIsAuthenticated(true); // Set user as authenticated
                navigate('/users');
            }
            else{
                setError(true);
                setTimeout(() => {
                    setError(false);
                    formik.resetForm();

                }, 500);

            }




        }
})
        return (
        <div className="login" style={{backgroundImage: `url("./banner88.png")`}}>
                <div className="login-form-container">
                    <form onSubmit={formik.handleSubmit} className="form" style={{width: "300px"}}>

                        <div className="form-group">
                            <InputLabel shrink> User Name</InputLabel>
                            <BootstrapInput
                                {...formik.getFieldProps('email')}
                                error={formik.touched.email && !!formik.errors.email}
                            />
                            {formik.touched.email && formik.errors.email && (
                                <div className="error-text">{formik.errors.email}</div>
                            )}

                        </div>
                        <div className="form-group">
                            <InputLabel shrink> Password</InputLabel>
                            <BootstrapInput type="password"
                                {...formik.getFieldProps('password')}
                                error={formik.touched.password && !!formik.errors.password}
                            />
                            {formik.touched.password && formik.errors.password && (
                                <div className="error-text">{formik.errors.password}</div>
                            )}

                        </div>
                        <div className="form-group">
                            {error && (
                                <div className="error-text" >**Incorrect email or password</div>
                            )}
                        </div>

                        <button type="submit" className="submit-button">Login</button>

                    </form>
                </div>
            {/*<h1>Login</h1>*/}
        </div>
        )
}

export default Login;