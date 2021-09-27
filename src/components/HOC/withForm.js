import { useState } from "react";

const withForm = Component => props => {
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

  const formIsValid = () => {
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
      return false;
    }
    return true;
  }

  return <Component 
            {...props} 
            formError={formError}
            setFormError={setFormError}
            formErrorVisibility={formErrorVisibility}
            setFormErrorVisibility={setFormErrorVisibility}
            formGlobalError={formGlobalError}
            setFormGlobalError={setFormGlobalError}
            handleChange={handleChange}
            handleBlur={handleBlur}
            updateErrors={updateErrors}
            formIsValid={formIsValid}
          />;
}

export default withForm;