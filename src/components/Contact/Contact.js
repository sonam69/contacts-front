import './Contact.css';
import { useLayoutEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';

const Contact = (props) => {

  const [state, setState] = useState({
    calculating: true,
    calculated: false,
    height: 1000
  })

  const myRef = useRef();

  const recalculateHeight = () => {
    let delivery_body_height = myRef.current.clientHeight;
    setState({
      calculated: true,
      calculating: false,
      height: delivery_body_height,
      recalculate: false,
    })
  }

  useLayoutEffect(() => {
    if (state.recalculate) {
      recalculateHeight();
    }
  }, [state.recalculate])

  useLayoutEffect(()=> {
    let delivery_body_height = myRef.current.clientHeight;
    setState({
        calculated: true,
        calculating: false,
        height: delivery_body_height
    })
    window.addEventListener('resize', () => {
        setState(prevState => {
            return {
            ...prevState,
            calculating: true,
            recalculate: true
          }
        });
    });
  }, [])
  
  return (
    <div className={`contact ${!props.isOpen ? "closed" : ""} ${state.calculated ? "calculated" : ""} ${state.calculating ? "calculating" : ""}`}>
        <div className="contact_head" onClick={() => {props.onClick(props._id)}}>
            <div className="icon icon-contact">{props.name}</div>
            <div
              title="remove" 
              className="remove" 
              onClick={(e) => {
                e.stopPropagation();
                props.onDelete(props._id);
              }}
            ></div>
        </div>
        <div className="contact_body" ref={myRef} style={{maxHeight: state.height ? state.height + "px" : ""}}>
          <div className="contact_body_wrapper">
              <a title="email" className="icon icon-email" href={"mailto:" + props.email}>{props.email}</a>
              {props.address && (
                <a title="address" className="icon icon-address" href={"https://www.google.com/maps/place/" + props.address}>{props.address}</a>
              )}
              {props.phones.map((x, i) => {
                return (
                  <a title="phone" className="icon icon-phone" key={i} href={"tel:" + x.prefix + x.number}>{x.prefix} {x.number}</a>
                )
              })}
              <Link className="edit" title="edit" to={"/editContact/" + props._id}></Link>
          </div>
        </div>
    </div>
  )
}

export default Contact;