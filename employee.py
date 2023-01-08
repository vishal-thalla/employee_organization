from flask_restx import Namespace,Resource,fields
from models import Employee
from models import FullEmployeeSchema
from models import ListEmployeeSchema
from flask import request
from sqlalchemy import func
from exts import db

employee_ns = Namespace('employees', description='A namespace for model employee interactions.')

full_employee_schema = FullEmployeeSchema()
list_employee_schema = ListEmployeeSchema()

@employee_ns.route('/')
class EmployeesResource(Resource):            
    def post(self):
        """Get employees list or Create a new employee."""
        data = request.get_json()
        if data['request_type'] == 'get':
            pagination_params = data.get('pagination_params', None)
            emp_ids = data.get('emp_ids', None)
            if emp_ids is not None:
                query = Employee.query.filter(Employee.emp_id.in_(emp_ids))
            else:
                query = Employee.query
            if pagination_params is not None:
                page = pagination_params.get('page', None)
                per_page = pagination_params.get('per_page', None)
                if page is not None:
                    employees = query.paginate(page=page, per_page=per_page)
            else:
                employees = query.all() #sqlalchemy object

            return full_employee_schema.dump(employees, many=True)

        elif data['request_type'] == 'post':
            if data.get('emp_id', None) is not None:
                try:
                    emp_id = int(data['emp_id'])
                except ValueError as e:
                    print(e)
                    return {'error': f'Invalid Employee Number: {data["emp_id"]}'}, 400

                if Employee.query.filter(Employee.emp_id.in_([emp_id])).first() is not None:
                    # employee already exists
                    return {'error': f'Employee already exists: {data["emp_id"]}'}, 400
                    
            else:
                if db.session.query(func.count(Employee.emp_id)).scalar() > 0:
                    data['emp_id'] = int(db.session.query(func.max(Employee.emp_id)).one()[0]) + 1
                else:
                    data['emp_id'] = 1

            if data.get('mgr_id', None) is not None:
                try:
                    mgr_id = int(data['mgr_id'])
                    mgr = Employee.query.filter(Employee.emp_id.in_([mgr_id])).one()
                    # manager exists
                except Exception as e:
                    print(e)
                    return {'error': f'Invalid Manager Employee Number: {data["mgr_id"]}'}, 400

            if data.get('salary', None) is not None:
                try:
                    salary = float(data['salary'])
                except ValueError as e:  
                    return {'error': f'Invalid salary: {data["salary"]}'}, 400


            try:
                del data['request_type']
                emp = Employee(**data)
                emp.save()
                return full_employee_schema.dump(emp), 201

            except Exception as e:
                print(e)
                return {'error': str(e)}, 400

@employee_ns.route('/<int:emp_id>')
class EmployeeResourceByID(Resource):
    def get(self, emp_id):
        """Get a specific employee by their emp_id."""
        try:
            emp = Employee.query.filter(Employee.emp_id.in_([emp_id])).one()
            return full_employee_schema.dump(emp), 200
        except Exception as e:
            print(e)
            return {'error': f'Invalid Employee Number: {emp_id}'}, 404
        

    def put(self, emp_id):
        """Update a specific employee by their emp_id."""

        # Check employee number
        try:
            emp = Employee.query.filter(Employee.emp_id.in_([emp_id])).one()
        except Exception as e:
            print(e)
            return {'error': f'Invalid Employee Number: {emp_id}'}, 404       
        
        try:
            data = request.get_json()
            mgr_id = data.get('mgr_id', '')

            if mgr_id is None:
                emp.update(**data)
                return full_employee_schema.dump(emp), 204
                
            if mgr_id != '':
            
                if Employee.query.filter(Employee.emp_id.in_([mgr_id])).first() is not None:
                    emp.update(**data)
                    return full_employee_schema.dump(emp), 204
                else:
                    print(f'Invalid Manager Employee Number: {data["mgr_id"]}')
                    return {'error': f'Invalid Manager Employee Number: {data["mgr_id"]}'}, 404
            
            
        except Exception as e:
            print(e)
            return {'error': str(e)}, 400

    def delete(self, emp_id):
        """Delete a specific employee by their emp_id."""
        try:
            emp = Employee.query.filter(Employee.emp_id.in_([emp_id])).one()
        except Exception as e:
            print(e)
            return {'error': f'Invalid Employee Number: {emp_id}'}, 404
            # it doesn't matter if wrong number as the desired effect is that
            # the employee should not exist in the database.

        try:
            emp.delete()
            emps_to_update = Employee.query.filter(Employee.mgr_id.in_([emp_id])).all()
            # TODO: paginate to handle large databases
            for emp in emps_to_update:
                emp.update(mgr_id=None)
            return 204
        except Exception as e:
            print(e)
            return {'error': str(e)}, 400
