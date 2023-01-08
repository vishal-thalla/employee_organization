import React from 'react'
import { Button, Card ,Modal} from 'react-bootstrap';
import { Link } from 'react-router-dom';


const Employee=({
    name, surname, emp_id, manager, salary, position, onClick, onEdit, onDelete
}) => {
    return(
        <div className="row">
            <div style={{width: "10%"}}>
                <p>{emp_id}</p>
            </div>
            <div style={{width: "17%"}}>
                <p onClick={onClick} style={{cursor: "pointer", textDecoration: "underline", color: "#0000ff"}}>{(name + ' ' + surname)}</p>
            </div>
            <div style={{width: "20%"}}>
                <p>{position}</p>
            </div>
            <div style={{width: "18%"}}>
                <p>{manager}</p>
            </div>
            <div style={{width: "10%"}}>
                <p>{salary}</p>
            </div>
            <div style={{width: "4.3%"}}>
                <Button variant='primary' onClick={onEdit}>Edit</Button>
            </div>
            <div style={{width: "5%"}}>
                <Button variant='danger' onClick={onDelete}>Delete</Button>
            </div>
        </div>
        
       
    )
}


export default Employee;