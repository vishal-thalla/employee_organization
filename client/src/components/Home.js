import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Modal ,Form,Button} from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import Employee from './Employee'
import { useHistory } from 'react-router-dom';
import { UserContext } from '..'
import axios from 'axios'
import SortButtons from './SortButtons'


const Home = () => {
    const [employees, setEmployees] = useState([])
    const [managers, setManagers] = useState({})
    const history = useHistory();
    
    const employee = useContext(UserContext)
    

    
    const loadEmployees = () => {
        employee.setEmployee(null)

        var requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },    
            body: JSON.stringify({
                'request_type': 'get'
            })
        }
        fetch('/employees/', requestOptions)
            .then(res => res.json())
            .then(data => {
                const unique = [...new Set(data.flatMap(item => ['mgr_id'].map(k => item[k])))].filter(item => item)
                setEmployees(data)
                return unique
            })
            .then(mgr_ids => {
                console.log(mgr_ids)
                requestOptions = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },    
                    body: JSON.stringify({
                        'request_type': 'get',
                        'emp_ids': mgr_ids
                    })
                }
                return fetch('/employees/', requestOptions)
                    
            })
            .then(res => res.json())
            .then(data => {

                var mgrs = {}
                mgrs = data.reduce((mgrs, d) => (
                    mgrs[d['emp_id']] = d['name'] + ' ' + d['surname'], mgrs
                ), {})
                console.log('managers')
                console.log(mgrs)
                setManagers(mgrs)
            })
            .catch(err => console.log(err))        
    }

    

    useEffect(() => {
            loadEmployees()
        }, []     
    )

    const updateEmployee = (data) => {
        employee.setEmployee(data)
        history.push('/edit_employee')
    }

    const viewEmployee = (data) => 
    {
        employee.setEmployee(data)
        history.push('/view_employee')
    }

    const deleteEmployee = (data) => {
        employee.setEmployee(null)

        const requestOptions = {
            method: 'DELETE',
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
            }
        })
        .catch(
            err => console.error(err.message)
        )

        loadEmployees()
        window.location.reload()
        
    }

    const handleSortDown = () => {

    }

    const handleSortUp = () => {
        
    }


    return (
        <div className="employees container">
            <h1>List of Employees</h1>
            <br></br>
            <div class="row">
          
                <div style={{width: "10%"}}>
                    {/* <p><b>Employee ID</b></p> */}
                    <SortButtons text="Sort Me" onSortUp={handleSortUp} onSortDown={handleSortDown} />
                </div>
                <div style={{width: "17%"}}>
                    <p><b>Employee name</b></p>
                </div>
                <div style={{width: "20%"}}>
                    <p><b>Position</b></p>
                </div>
                <div style={{width: "18%"}}>
                    <p><b>Manager</b></p>
                </div>
                <div style={{width: "8%"}}>
                    <p><b>Salary</b></p>
                </div> 
                   
            </div>
            <div class="row">
          
                <div style={{width: "10%"}}>
                    <p><b>Employee ID</b></p>
                </div>
                <div style={{width: "17%"}}>
                    <p><b>Employee name</b></p>
                </div>
                <div style={{width: "20%"}}>
                    <p><b>Position</b></p>
                </div>
                <div style={{width: "18%"}}>
                    <p><b>Manager</b></p>
                </div>
                <div style={{width: "8%"}}>
                    <p><b>Salary</b></p>
                </div> 
                   
            </div>
            {
                employees.map((item,i) => (
                    <Employee
                        key={i}
                        name={item.name}
                        surname={item.surname}
                        emp_id={item.emp_id}
                        manager={item.mgr_id == null ? "None" : `${item.mgr_id} - ${managers[item.mgr_id]}`}
                        salary={item.salary}
                        position={item.position}
                        onClick={() => viewEmployee(item)}
                        onEdit={() => updateEmployee(item)}
                        onDelete={() => deleteEmployee(item)}
                    />
                ))
            }
        </div>
    )
}



const HomePage = () => {

    return (
        <div>
            <Home/>
        </div>
    )
}

export default HomePage