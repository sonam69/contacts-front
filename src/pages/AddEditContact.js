import React, { useEffect, useState } from "react";
import { useHistory, useParams } from 'react-router-dom';
import { GET_CONTACT, PATCH_CONTACT, POST_CONTACT } from '../helpers/url_helper';
import { get, patch, post } from '../helpers/api_helper';

const AddEditContact = props => {
    const history = useHistory();
    const { contactId } = useParams();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [phones, setPhones] = useState([]);
    // Holds the error message for each input
    // Form Error contains either what exists in data-error or what comes as response from backend
    const [formError, setFormError] = useState({});
    // Holds which inputs should have an error appear
    // The reason why formErrorVisibility exists is because 
    // i want to show errors only on change (not on keystroke) or when user tries to submit the form
    // but hide errors on keystroke (if input is correct)
    const [formErrorVisibility, setFormErrorVisibility] = useState({});
    const [formGlobalError, setFormGlobalError] = useState('');

    useEffect(() => {
      if (contactId) {
        get(GET_CONTACT.replace(":id", contactId))
          .then((response) => {
            setName(response.name);
            setEmail(response.email);
            setAddress(response.address);
            setPhones(response.phones);
          })
          .catch((e) => {
            console.log('could not fetch contact error = ', e);
          })
      }
    }, [contactId])

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
        const url = contactId ? PATCH_CONTACT.replace(":id", contactId) : POST_CONTACT;
        const httpFunction = contactId ? patch : post;
        httpFunction(url, {name, email, address, phones})
          .then(response => {
            history.replace('/contacts');
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

    const removePhone = (index) => {
      delete formError['phones.' + index + '.prefix']
      delete formError['phones.' + index + '.number']
      setPhones(formError);
      delete formErrorVisibility['phones.' + index + '.prefix']
      delete formErrorVisibility['phones.' + index + '.number']
      setPhones(formErrorVisibility)
      phones.splice(index,1);
      setPhones([...phones]);
    }

    return (
        <section className="page-content">
          <h1>{contactId ? 'edit contact' : 'add contact'}</h1>
          <form 
            onSubmit={(e) => submitHandler(e)}
            >
            <div className="form_error">{formGlobalError}</div>
            <div className={"form_item " + (formErrorVisibility.name && formError.name ? 'error' : '')}>
              <input 
                type='text'
                name='name'
                id='name'
                placeholder="john"
                value={name}
                onChange={(e) => {setName(e.target.value);handleChange(e.target);}}
                onBlur={(e) => handleBlur(e.target)}
                data-regex='\S'
                data-error='Invalid name'
                required 
              />
                <label htmlFor='name'>Name</label>
                <small>{formErrorVisibility.name && formError.name}</small>
            </div>
            <div className={"form_item " + (formErrorVisibility.email && formError.email ? 'error' : '')}>
              <input 
                type='text'
                name='email'
                id='email'
                placeholder="john@gmail.com"
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
                type='text' 
                name='address'
                id='address'
                placeholder="skra 10, kallithea"
                value={address}
                onChange={(e) => {setAddress(e.target.value);handleChange(e.target)}}
                onBlur={(e) => handleBlur(e.target)}
              />
              <label htmlFor='address'>Address</label>
              <small>{formErrorVisibility.address && formError.address}</small>
            </div>
            {phones.map((x, i) => {
              let prefixName = "phones." + i + ".prefix";
              let numberName = "phones." + i + ".number";
              return (
                <div key={i} className="form_group form_group-mobile">
                    <div className={"form_item " + (formErrorVisibility[prefixName] && formError[prefixName] ? 'error' : '')}>
                        <input
                          id={"prefix" + i}
                          type="text"
                          name={prefixName}
                          placeholder="+30"
                          value={x.prefix}
                          onChange={(e) => {
                            phones[i].prefix = e.target.value;
                            setPhones(phones);
                            handleChange(e.target);
                          }}
                          onBlur={(e) => handleBlur(e.target)}
                          data-regex='^\+[0-9]{1,4}$'
                          data-error='Invalid phone prefix'
                          required
                        />
                        <label htmlFor={"prefix" + i}>prefix</label>
                        <small>{formErrorVisibility[prefixName] && formError[prefixName]}</small>
                    </div>
                    <div className={"form_item " + (formErrorVisibility[numberName] && formError[numberName] ? 'error' : '')}>
                        <input
                          id={"number" + i}
                          type="text"
                          name={numberName}
                          placeholder="6989289932"
                          value={x.number}
                          onChange={(e) => {
                            phones[i].number = e.target.value;
                            setPhones(phones);
                            handleChange(e.target);
                          }}
                          onBlur={(e) => handleBlur(e.target)}
                          data-regex='^\d(?: ?\d){9,14}$'
                          data-error='Invalid phone number'
                          required
                        />
                        <label htmlFor={"number" + i}>number</label>
                        <small>{formErrorVisibility[numberName] && formError[numberName]}</small>
                    </div>
                    <div 
                      title="remove" 
                      className="remove remove-input"
                      onClick={() => {removePhone(i)}}
                    ></div>
                </div>
              )
            })}
            <span 
              className="form_add_input" 
              onClick={() => {setPhones([...phones, {"prefix": "+30", "number": ""}])}}
            >Add phone</span>
            <div className="form_actions">
              <button className="btn">Submit</button>
            </div>
          </form>
        </section>
    )
}

export default AddEditContact