import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import Console from './ConsoleLogger'

import axios from 'axios'


const AddEmployee = () => {

    const { register, handleSubmit, reset, formState: { errors } } = useForm()
    const [show, setShow] = useState(false);
    const [salaryString, setSalaryString] = useState("");

    const [checked, setChecked] = useState(true);
    const [text, setText] = useState("");
    const [errMessage, setErrorMessage] = useState({'message': 'test'});

    var today = new Date();
    today = today.getFullYear() + '-' + today.getMonth() + '-' + today.getDate()   

    const addEmployee = (data) => {       

        if (!data.mgr_id) {
            console.log('Deleting mgr_id')
            delete data['mgr_id'];
        }
        data.request_type = 'post'
        console.log(data)

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)

        }

        fetch('/employees', requestOptions)
        .then(res => res.json())
        .then(data => {
            if ('error' in data) {
                console.log(data)
                setErrorMessage({'message': data.error})
            }
            else {
                reset()
                setErrorMessage({'message': ''})
            }  
            console.log(data.error)
        })
        .catch(
            err => console.error(err.message)
        )
    }

    return (
        <div className="container">
            <h1>Add Employee</h1>
            <form>
                <Form.Group>
                    <Form.Label>Employee Number</Form.Label>
                    <div style={{width:"30%"}}>
                    <Form.Control type='number' placeholder="0" disabled={checked}
                        {...register('emp_id', { required: !checked, valueAsNumber: true})}
                    />
                    {/* <label>Auto-generate Employee Number &nbsp; <input onChange={() => set_emp_id_alloc(!emp_id_alloc)} defaultChecked={true} name="emp_id_auto" type="checkbox" id="emp_id_auto" {...register('emp_id_auto')} /></label> */}
                    <label>
                    Auto-generate Employee Number &nbsp;
                        <input
                            name="checkbox"
                            type="checkbox"
                            checked={checked}
                            onChange={() => {
                                if(checked){
                                    setText('')
                                }
                            setChecked(!checked)
                                }
                            }
                        />
                    </label>
                    </div>
                </Form.Group>    
                {errors.emp_id?.type === "required" && !checked && <p style={{ color: 'red' }}><small>Employee Number is required</small></p>}            
                {/* {creationError.flag && creationError.type === 'emp_id' && <p style={{ color: 'red' }}><small>creationError.message</small></p>} */}
                <br></br>
                <Form.Group>
                    <Form.Label>Name</Form.Label>
                    <div style={{width:"30%"}}>
                    <Form.Control type="text" placeholder="John"
                        {...register('name', { required: true, maxLength: 25 })}
                    />
                    </div>
                </Form.Group>
                {errors.name?.type === "required" && <p style={{ color: 'red' }}><small>Name is required</small></p>}
                {errors.name?.type === "maxLength" && <p style={{ color: 'red' }}>
                    <small>Name should be less than 25 characters</small>
                </p>}
                <br></br>
                <Form.Group>
                    <Form.Label>Surname</Form.Label>
                    <div style={{width:"30%"}}>
                    <Form.Control type="text" placeholder="Doe"
                        {...register('surname', { required: true, maxLength: 25 })}
                    />
                    </div>
                </Form.Group>
                {errors.surname?.type === "required" && <p style={{ color: 'red' }}><small>Surname is required</small></p>}
                {errors.surname?.type === "maxLength" && <p style={{ color: 'red' }}>
                    <small>Surname should be less than 25 characters</small>
                </p>}
                <br></br>
                <Form.Group>
                    <Form.Label>Date of birth</Form.Label>
                    <div style={{width:"14%"}}>
                    
                    <Form.Control type="date" max={today}
                        {...register('dob', { required: true})}
                    />
                    </div>
                </Form.Group>
                {errors.dob?.type === "required" && <p style={{ color: 'red' }}><small>Date of birth is required</small></p>}
                <br></br>
                <Form.Group>
                    <Form.Label>Salary</Form.Label>
                    <div style={{width:"30%"}}>
                    <Form.Control type="number" placeholder="10000.00" 
                        {...register('salary', { required: true, valueAsNumber: true, validate: {positive: v => parseFloat(v) >= 0}})}
                    />
                    </div>
                </Form.Group>
                {errors.salary?.type === "required" && <p style={{ color: 'red' }}><small>Salary is required</small></p>}
                {errors.salary?.type === "positive" && <p style={{ color: 'red' }}><small>Salary value must be >= zero</small></p>}
                
                
                <br></br>
                <Form.Group>
                    <Form.Label>Position</Form.Label>
                    <div style={{width:"30%"}}>
                    <Form.Control type="text" placeholder="Worker"
                        {...register('position', { required: true})}
                    />
                    </div>
                </Form.Group>
                {errors.position?.type === "required" && <p style={{ color: 'red' }}><small>Position is required</small></p>}
                <br></br>
                <Form.Group>
                    <Form.Label>Manager Employee Number</Form.Label>
                    <div style={{width:"30%"}}>
                    <Form.Control type="number" placeholder="0"
                        {...register('mgr_id', { required: false})}
                    />
                    </div>
                </Form.Group>
                
                <br></br>
                <Form.Group>
                    <Button variant="primary" onClick={handleSubmit(addEmployee)}>
                        Save
                    </Button>
                </Form.Group>
                {<p style={{ color: 'red' }}><small>{errMessage.message}</small></p>}
            </form>

        </div>
    )
}


export default AddEmployee