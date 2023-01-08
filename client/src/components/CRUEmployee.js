import React, { useState, useEffect } from 'react'
import { Form, Button } from 'react-bootstrap'
import { useForm } from 'react-hook-form'


const CRUEmployeePage = (params) => {

    
    const { register, handleSubmit, reset, formState: { errors } } = useForm()
    const [text, setText] = useState("");
    const [checked, setChecked] = useState(true);
    const [errMessage, setErrorMessage] = useState({'message': ''});
    const [updateMessage, setUpdateMessage] = useState('');
    const [readOnly, setReadOnly] = useState(false)
    const [employee, setEmployee] = useState(null)

    var today = new Date();
    today = today.getFullYear() + '-' + today.getMonth() + '-' + today.getDate()   

    useEffect(() => {
        setReadOnly(params.readonly)
        setEmployee(params.employee)
        }, []     

    )

    console.log(updateMessage)

    const renameDictKeys = (dict, str) => {
        Object.keys(dict).forEach((key) => {
            dict[key.replace(str, '')] = dict[key] 
            delete dict[key]
        })
    }

    const addEmployee = (data) => {       
        renameDictKeys(data, 'add_')
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

    const updateEmployee = (data) => {       
        renameDictKeys(data, 'edit_')
        console.log(data.mgr_id)
        // if (!data.mgr_id) {
        //     delete data['mgr_id'];
        // }

        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)

        }

        fetch(`/employees/${data.emp_id}`, requestOptions)
        .then(res => {
            if (!res.ok) {
                return res.json()
            }
            return {}
        })
        .then(data => {
            if ('error' in data) {
                console.log(data)
                setErrorMessage({'message': data.error})
                setUpdateMessage('')
            }
            else {
                setErrorMessage({'message': ''})
                setUpdateMessage('Successfully updated employee!')
            }  
            
        })
        .catch(
            err => console.error(err.message)
        )
    }



    return (
        <div className="container">
            {readOnly &&
            <form>
                <h1>Employee Information</h1>
                <br></br>
                <Form.Group>
                    <Form.Label><b>Employee Number</b></Form.Label>
                    <div style={{width:"30%"}}>
                        <label>
                            <small>{employee.emp_id}</small>
                        </label>
                    </div>
                </Form.Group>    
                <br></br>
                <Form.Group>
                    <Form.Label><b>Name</b></Form.Label>
                    <div style={{width:"30%"}}>
                        <label>
                            <small>{employee.name}</small>
                        </label>
                    </div>
                </Form.Group>
                <br></br>
                <Form.Group>
                    <Form.Label><b>Surname</b></Form.Label>
                    <div style={{width:"30%"}}>
                        <label>
                            <small>{employee.surname}</small>
                        </label>
                    </div>
                </Form.Group>
                <br></br>
                <Form.Group>
                    <Form.Label><b>Date of birth</b></Form.Label>
                    <div style={{width:"30%"}}>
                        <label>
                            <small>{employee.dob}</small>
                        </label>
                    </div>
                </Form.Group>
                <br></br>
                <Form.Group>
                    <Form.Label><b>Salary (R)</b></Form.Label>
                    <div style={{width:"30%"}}>
                        <label>
                            <small>{employee.salary}</small>
                        </label>
                    </div>
                </Form.Group>
                <br></br>
                <Form.Group>
                    <Form.Label><b>Position</b></Form.Label>
                    <div style={{width:"30%"}}>
                        <label>
                            <small>{employee.position}</small>
                        </label>
                    </div>
                </Form.Group>
                <br></br>
                <Form.Group>
                    <Form.Label><b>Manager Employee Number</b></Form.Label>
                    <div style={{width:"30%"}}>
                        <label>
                            <small>{employee.mgr_id ? employee.mgr_id : "None"}</small>
                        </label>
                    </div>
                </Form.Group>
            </form>
            
            }
            {!readOnly && employee !== null &&
            <form>
                <h1>Edit Employee</h1>

                <br></br>
                <Form.Group>
                    <Form.Label><b>Employee Number</b></Form.Label>
                    <div style={{width:"180px"}}>
                    <Form.Control type='number' placeholder="0" defaultValue={employee.emp_id}
                        {...register('edit_emp_id', { required: true, valueAsNumber: true})}
                    />
                    </div>
                </Form.Group>    
                {errors.emp_id?.type === "required" && !checked && <p style={{ color: 'red' }}><small>Employee Number is required</small></p>}            
                
                <br></br>
                <Form.Group>
                    <Form.Label><b>Name</b></Form.Label>
                    <div style={{width:"180px"}}>
                    <Form.Control type="text" placeholder="John" defaultValue={employee.name}
                        {...register('edit_name', { required: true, maxLength: 25 })}
                    />
                    </div>
                </Form.Group>
                {errors.name?.type === "required" && <p style={{ color: 'red' }}><small>Name is required</small></p>}
                {errors.name?.type === "maxLength" && <p style={{ color: 'red' }}>
                    <small>Name should be less than 25 characters</small>
                </p>}
                <br></br>
                <Form.Group>
                    <Form.Label><b>Surname</b></Form.Label> 
                    <div style={{width:"180px"}}>
                    <Form.Control type="text" placeholder="Doe" defaultValue={employee.surname}
                        {...register('edit_surname', { required: true, maxLength: 25 })}
                    />
                    </div>
                </Form.Group>
                {errors.surname?.type === "required" && <p style={{ color: 'red' }}><small>Surname is required</small></p>}
                {errors.surname?.type === "maxLength" && <p style={{ color: 'red' }}>
                    <small>Surname should be less than 25 characters</small>
                </p>}
                <br></br>
                <Form.Group>
                    <Form.Label><b>Date of birth</b></Form.Label>
                    <div style={{width:"135px"}}>
                    
                    <Form.Control type="date" max={today} defaultValue={employee.dob}
                        {...register('edit_dob', { required: true})}
                    />
                    </div>
                </Form.Group>
                {errors.dob?.type === "required" && <p style={{ color: 'red' }}><small>Date of birth is required</small></p>}
                <br></br>
                <Form.Group>
                    <Form.Label><b>Salary (R)</b></Form.Label>
                    <div style={{width:"180px"}}>
                    <Form.Control type="number" placeholder="10000.00" defaultValue={employee.salary}
                        {...register('edit_salary', { required: true, valueAsNumber: true, validate: {positive: v => parseFloat(v) >= 0}})}
                    />
                    </div>
                </Form.Group>
                {errors.salary?.type === "required" && <p style={{ color: 'red' }}><small>Salary is required</small></p>}
                {errors.salary?.type === "positive" && <p style={{ color: 'red' }}><small>Salary value must be >= zero</small></p>}
                
                
                <br></br>
                <Form.Group>
                    <Form.Label><b>Position</b></Form.Label>
                    <div style={{width:"180px"}}>
                    <Form.Control type="text" placeholder="Worker" defaultValue={employee.position}
                        {...register('edit_position', { required: true})}
                    />
                    </div>
                </Form.Group>
                {errors.position?.type === "required" && <p style={{ color: 'red' }}><small>Position is required</small></p>}
                <br></br>
                <Form.Group>
                    <Form.Label><b>Manager Employee Number</b></Form.Label>
                    <div style={{width:"180px"}}>
                    <Form.Control type="number" placeholder="0" defaultValue={(employee.mgr_id === null)? '' : employee.mgr_id}
                        {...register('edit_mgr_id', { required: false})}
                    />
                    </div>
                </Form.Group>
                
                <br></br>
                <Form.Group>
                    <Button variant="primary" onClick={handleSubmit(updateEmployee)}>
                        Update
                    </Button>
                </Form.Group>
                {errMessage.message !== '' && <p style={{ color: 'red' }}><small>{errMessage.message}</small></p>}
                {updateMessage !== '' && <p style={{ color: 'green' }}><small>{updateMessage}</small></p>}
            </form>
            }
            {!readOnly && employee === null &&
            <form>
                <h1>Add Employee</h1>
                <br></br>
                <Form.Group>
                    <Form.Label><b>Employee Number</b></Form.Label>
                    <div style={{width:"180px"}}>
                    <Form.Control type='number' placeholder="0" disabled={checked}
                        {...register('add_emp_id', { required: !checked, valueAsNumber: true})}
                    />
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
            
                <br></br>
                <Form.Group>
                    <Form.Label><b>Name</b></Form.Label>
                    <div style={{width:"180px"}}>
                    <Form.Control type="text" placeholder="John"
                        {...register('add_name', { required: true, maxLength: 25 })}
                    />
                    </div>
                </Form.Group>
                {errors.name?.type === "required" && <p style={{ color: 'red' }}><small>Name is required</small></p>}
                {errors.name?.type === "maxLength" && <p style={{ color: 'red' }}>
                    <small>Name should be less than 25 characters</small>
                </p>}
                <br></br>
                <Form.Group>
                    <Form.Label><b>Surname</b></Form.Label>
                    <div style={{width:"180px"}}>
                    <Form.Control type="text" placeholder="Doe"
                        {...register('add_surname', { required: true, maxLength: 25 })}
                    />
                    </div>
                </Form.Group>
                {errors.surname?.type === "required" && <p style={{ color: 'red' }}><small>Surname is required</small></p>}
                {errors.surname?.type === "maxLength" && <p style={{ color: 'red' }}>
                    <small>Surname should be less than 25 characters</small>
                </p>}
                <br></br>
                <Form.Group>
                    <Form.Label><b>Date of birth</b></Form.Label>
                    <div style={{width:"135px"}}>
                    
                    <Form.Control type="date" max={today}
                        {...register('add_dob', { required: true})}
                    />
                    </div>
                </Form.Group>
                {errors.dob?.type === "required" && <p style={{ color: 'red' }}><small>Date of birth is required</small></p>}
                <br></br>
                <Form.Group>
                    <Form.Label><b>Salary (R)</b></Form.Label>
                    <div style={{width:"180px"}}>
                    <Form.Control type="number" placeholder="10000.00" 
                        {...register('add_salary', { required: true, valueAsNumber: true, validate: {positive: v => parseFloat(v) >= 0}})}
                    />
                    </div>
                </Form.Group>
                {errors.salary?.type === "required" && <p style={{ color: 'red' }}><small>Salary is required</small></p>}
                {errors.salary?.type === "positive" && <p style={{ color: 'red' }}><small>Salary value must be >= zero</small></p>}
                
                
                <br></br>
                <Form.Group>
                    <Form.Label><b>Position</b></Form.Label>
                    <div style={{width:"180px"}}>
                    <Form.Control type="text" placeholder="Worker"
                        {...register('add_position', { required: true})}
                    />
                    </div>
                </Form.Group>
                {errors.position?.type === "required" && <p style={{ color: 'red' }}><small>Position is required</small></p>}
                <br></br>
                <Form.Group>
                    <Form.Label><b>Manager Employee Number</b></Form.Label>
                    <div style={{width:"180px"}}>
                    <Form.Control type="number" placeholder="0"
                        {...register('add_mgr_id', { required: false})}
                    />
                    </div>
                </Form.Group>
                
                <br></br>
                <Form.Group>
                    <Button variant="primary" onClick={handleSubmit(addEmployee)}>
                        Save
                    </Button>
                </Form.Group>
                {errMessage.message !== '' && <p style={{ color: 'red' }}><small>{errMessage.message}</small></p>}
            </form>
            }
        </div>
    )
}


export default CRUEmployeePage