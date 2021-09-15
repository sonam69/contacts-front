import React from "react";
import './Modal.css';

const Modal = (props) => {
  return (
    <React.Fragment>
      <div className="modal_overlay" onClick={props.noAction}></div>
      <div className= {"modal modal-" + props.type}>
        <h2>{props.title}</h2>
        <p>{props.body}</p>
        <div className="modal_footer">
            <button className="btn" onClick={props.yesAction}>Yes</button>
            <button className="btn btn-2" onClick={props.noAction}>No</button>
        </div>
      </div>
    </React.Fragment>
  )
}

export default Modal;