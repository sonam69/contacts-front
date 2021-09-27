// import AuthForm from '../components/Auth/AuthForm';
import {useState, useContext } from 'react';
import { REGISTER, LOGIN } from '../helpers/url_helper';
import { post } from '../helpers/api_helper';
import AuthContext from '../store/auth-context';
import withForm from '../components/HOC/withForm';
import '../styles/form.css'

const Auth = (props) => {
  const authCtx = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submitHandler = (event) => {
    event.preventDefault();
    if (props.formIsValid()) {
      let url = isLogin ? LOGIN : REGISTER;
      post(url, {email, password})
        .then(response => {
          authCtx.onLogin(response.token);
        })
        .catch(error => {
          if (error.response.data.error) {
            props.setFormGlobalError(error.response.data.error.message);
          }
          else {
            props.updateErrors(error.response.data.errors);
          }
        })
    }
  };

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  return (
    <section className="authform">
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form 
        onSubmit={(e) => submitHandler(e)}
        >
        <div className="form_error">{props.formGlobalError}</div>
        <div className={"form_item " + (props.formErrorVisibility.email && props.formError.email ? 'error' : '')}>
          <input 
            type='text'
            name='email'
            id='email'
            placeholder='john@gmail.com'
            value={email}
            onChange={(e) => {setEmail(e.target.value);props.handleChange(e.target);}}
            onBlur={(e) => props.handleBlur(e.target)}
            data-regex='^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$'
            data-error='Invalid email address'
            required 
          />
            <label htmlFor='email'>Email</label>
            <small>{props.formErrorVisibility.email && props.formError.email}</small>
        </div>
        <div className={"form_item " + (props.formErrorVisibility.password && props.formError.password ? 'error' : '')}>
          <input
            type='password' 
            name='password'
            id='password'
            value={password}
            onChange={(e) => {setPassword(e.target.value);props.handleChange(e.target)}}
            onBlur={(e) => props.handleBlur(e.target)}
            data-regex='^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,20}$'
            data-error='password must contain at least 1 lowercase letter, 1 uppercase letter, 1 digit and have 8-20 characters'
            required 
          />
            <label htmlFor='password'>Password</label>
            <small>{props.formErrorVisibility.password && props.formError.password}</small>
        </div>
        <div className="form_actions">
          <button className="btn">{isLogin ? 'Login' : 'Create Account'}
          </button>
        </div>
        <div style={{textAlign: 'right'}}>
          <button
            type='button'
            className="form_actions_toggle"
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
}

export default withForm(Auth);