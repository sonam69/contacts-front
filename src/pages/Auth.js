// import AuthForm from '../components/Auth/AuthForm';
import {useState, useContext } from 'react';
import { REGISTER, LOGIN } from '../helpers/url_helper';
import { post } from '../helpers/api_helper';
import AuthContext from '../store/auth-context';
import '../styles/form.css'

const Auth = () => {
  const authCtx = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Holds the error message for each input
  // Form Error contains either what exists in data-error or what comes as response from backend
  const [formError, setFormError] = useState({})
  // Holds which inputs should have an error appear
  // The reason why formErrorVisibility exists is because 
  // i want to show errors only on change (not on keystroke) or when user tries to submit the form
  // but hide errors on keystroke (if input is correct)
  const [formErrorVisibility, setFormErrorVisibility] = useState({})
  const [formGlobalError, setFormGlobalError] = useState('')

  const handleChange = (input) => {
    let regex = input.getAttribute('data-regex');
    if (!regex) {
      return;
    }
    let pattern = new RegExp(regex);
    let error_msg = ''
    if (!pattern.test(input.value)) {
      error_msg = input.getAttribute('data-error');
    }
    else {
      setFormErrorVisibility({
        ...formErrorVisibility,
        [input.name]: false
      })
    }
    setFormError({
        ...formError,
        [input.name]: error_msg
    });
  }

  const handleBlur = (input) => {
    if (formError[input.name]) {
      setFormErrorVisibility({
        ...formErrorVisibility,
        [input.name]: true
      })
    }
  }

  const updateErrors = (errors) => {
    let backend_errors = {}
    // TODO MANOS what happens with multiple like phones where name is phones.0?
    for (let [key, val] of Object.entries(errors)) {
      backend_errors[key] = val.message;
    }
    setFormError({
      ...formError,
      ...backend_errors
    });
    // Maybe there is no message so i will set all to true
    for(var i in backend_errors) {
      backend_errors[i] = true;
    }
    setFormErrorVisibility({
      ...formErrorVisibility,
      ...backend_errors
    });
  }

  const submitHandler = (event) => {
    event.preventDefault();
    // Store in errors the property names from formError which have truthy value
    var errors = {}
    for (const [key, value] of Object.entries(formError)) {
      if (value) {
        errors[key] = true
      }
    }
    if (Object.keys(errors).length) {
      setFormErrorVisibility({
        ...formErrorVisibility,
        ...errors
      })
    }
    else {
      let url = isLogin ? LOGIN : REGISTER;
      post(url, {email, password})
        .then(response => {
          authCtx.onLogin(response.token);
        })
        .catch(error => {
          if (error.response.data.error) {
            setFormGlobalError(error.response.data.error.message);
          }
          else {
            updateErrors(error.response.data.errors);
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
        <div className="form_error">{formGlobalError}</div>
        <div className={"form_item " + (formErrorVisibility.email && formError.email ? 'error' : '')}>
          <input 
            type='text'
            name='email'
            id='email'
            placeholder='john@gmail.com'
            value={email}
            onChange={(e) => {setEmail(e.target.value);handleChange(e.target);}}
            onBlur={(e) => handleBlur(e.target)}
            data-regex='^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$'
            data-error='Invalid email address'
            required 
          />
            <label htmlFor='email'>Email</label>
            <small>{formErrorVisibility.email && formError.email}</small>
        </div>
        <div className={"form_item " + (formErrorVisibility.password && formError.password ? 'error' : '')}>
          <input
            type='password' 
            name='password'
            id='password'
            value={password}
            onChange={(e) => {setPassword(e.target.value);handleChange(e.target)}}
            onBlur={(e) => handleBlur(e.target)}
            data-regex='^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,20}$'
            data-error='password must contain at least 1 lowercase letter, 1 uppercase letter, 1 digit and have 8-20 characters'
            required 
          />
            <label htmlFor='password'>Password</label>
            <small>{formErrorVisibility.password && formError.password}</small>
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

export default Auth;