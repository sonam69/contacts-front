import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom";
import Contact from '../components/Contact/Contact';
import Modal from '../components/Modal/Modal';
import { GET_CONTACTS, DELETE_CONTACT } from '../helpers/url_helper'
import { get, del } from '../helpers/api_helper'

const Contacts = props => {

  const [contacts, setContacts] = useState([]);
  const [openContact, setOpenContact] = useState();
  const [contactToBeRemoved, setContactToBeRemoved] = useState();
  const [showModal, setShowModal] = useState();

  useEffect(() => {
    get(GET_CONTACTS)
      .then(response => {
        setContacts(response);
      })
      .catch(error => {
        console.log('contacts error = ', error);
      })
  }, []);

  useEffect(() => {
    if (showModal)
      document.body.classList.add('isModalOpen');
    else
      document.body.classList.remove('isModalOpen');
    return () => {
      document.body.classList.remove('isModalOpen');
    };
  }, [showModal]);

  const deleteContact = (index) => {
    let contactId = contacts.splice(index, 1)[0]._id;
    setContacts(contacts);
    if (contactId) {
      del(DELETE_CONTACT.replace(':id', contactId))
        .then(() => {
          setShowModal(false);
        })
    }
  }

  const accordionUpdate = (contactId) => {
    if (openContact === contactId)
      setOpenContact('');
    else
      setOpenContact(contactId);
  }

  return (
    <React.Fragment>
      <Modal 
      type="alert"
      title="Are you sure?"
      body="Contact will be permanently deleted"
      noAction={() => {setShowModal(false)}}
      yesAction={() => {deleteContact(contactToBeRemoved)}}
      />
      <h1>Contacts</h1>
      {!contacts.length && (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <small>No contacts found</small>
          <Link class="btn" to="/addContact" style={{marginTop: "2rem"}}>Add contact</Link>
        </div>
      )}
      <div className="listWrapper">
          {contacts.map((x, i) => {
            return (
              <Contact 
              key={i}
              onClick={accordionUpdate.bind(this)}
              isOpen={openContact === x._id}
              onDelete={(contact_id) => {
                setShowModal(true);
                setContactToBeRemoved(i);
              }}
              {...x}
              />
            )
          })}
      </div>
    </React.Fragment>
  )
}

export default Contacts