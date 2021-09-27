import React, { useEffect, useState } from "react";
import { useHistory, useParams } from 'react-router-dom';
import { GET_CONTACT, PATCH_CONTACT, POST_CONTACT } from '../helpers/url_helper';
import { get, patch, post } from '../helpers/api_helper';
import withForm from '../components/HOC/withForm';

const AddEditContact = props => {
    const history = useHistory();
    const { contactId } = useParams();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [phones, setPhones] = useState([]);

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
  
    const submitHandler = (event) => {
      event.preventDefault();
      if (props.formIsValid()) {
        const url = contactId ? PATCH_CONTACT.replace(":id", contactId) : POST_CONTACT;
        const httpFunction = contactId ? patch : post;
        httpFunction(url, {name, email, address, phones})
          .then(response => {
            history.replace('/contacts');
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

    const removePhone = (index) => {
      delete props.formError['phones.' + index + '.prefix']
      delete props.formError['phones.' + index + '.number']
      setPhones(props.formError);
      delete props.formErrorVisibility['phones.' + index + '.prefix']
      delete props.formErrorVisibility['phones.' + index + '.number']
      setPhones(props.formErrorVisibility)
      phones.splice(index,1);
      setPhones([...phones]);
    }

    return (
        <section className="page-content">
          <h1>{contactId ? 'edit contact' : 'add contact'}</h1>
          <form 
            onSubmit={(e) => submitHandler(e)}
            >
            <div className="form_error">{props.formGlobalError}</div>
            <div className={"form_item " + (props.formErrorVisibility.name && props.formError.name ? 'error' : '')}>
              <input 
                type='text'
                name='name'
                id='name'
                placeholder="john"
                value={name}
                onChange={(e) => {setName(e.target.value);props.handleChange(e.target);}}
                onBlur={(e) => props.handleBlur(e.target)}
                data-regex='\S'
                data-error='Invalid name'
                required 
              />
                <label htmlFor='name'>Name</label>
                <small>{props.formErrorVisibility.name && props.formError.name}</small>
            </div>
            <div className={"form_item " + (props.formErrorVisibility.email && props.formError.email ? 'error' : '')}>
              <input 
                type='text'
                name='email'
                id='email'
                placeholder="john@gmail.com"
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
                type='text' 
                name='address'
                id='address'
                placeholder="skra 10, kallithea"
                value={address}
                onChange={(e) => {setAddress(e.target.value);props.handleChange(e.target)}}
                onBlur={(e) => props.handleBlur(e.target)}
              />
              <label htmlFor='address'>Address</label>
              <small>{props.formErrorVisibility.address && props.formError.address}</small>
            </div>
            {phones.map((x, i) => {
              let prefixName = "phones." + i + ".prefix";
              let numberName = "phones." + i + ".number";
              return (
                <div key={i} className="form_group form_group-mobile">
                    <div className={"form_item " + (props.formErrorVisibility[prefixName] && props.formError[prefixName] ? 'error' : '')}>
                        <input
                          id={"prefix" + i}
                          type="text"
                          name={prefixName}
                          placeholder="+30"
                          value={x.prefix}
                          onChange={(e) => {
                            phones[i].prefix = e.target.value;
                            setPhones(phones);
                            props.handleChange(e.target);
                          }}
                          onBlur={(e) => props.handleBlur(e.target)}
                          data-regex='^\+[0-9]{1,4}$'
                          data-error='Invalid phone prefix'
                          required
                        />
                        <label htmlFor={"prefix" + i}>prefix</label>
                        <small>{props.formErrorVisibility[prefixName] && props.formError[prefixName]}</small>
                    </div>
                    <div className={"form_item " + (props.formErrorVisibility[numberName] && props.formError[numberName] ? 'error' : '')}>
                        <input
                          id={"number" + i}
                          type="text"
                          name={numberName}
                          placeholder="6989289932"
                          value={x.number}
                          onChange={(e) => {
                            phones[i].number = e.target.value;
                            setPhones(phones);
                            props.handleChange(e.target);
                          }}
                          onBlur={(e) => props.handleBlur(e.target)}
                          data-regex='^\d(?: ?\d){9,14}$'
                          data-error='Invalid phone number'
                          required
                        />
                        <label htmlFor={"number" + i}>number</label>
                        <small>{props.formErrorVisibility[numberName] && props.formError[numberName]}</small>
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

export default withForm(AddEditContact)