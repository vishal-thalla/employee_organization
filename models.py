from exts import db
from marshmallow import Schema
from marshmallow import fields
import datetime

class FullEmployeeSchema(Schema):
    id = fields.Int()
    name = fields.Str()
    surname = fields.Str()
    dob = fields.Date()
    emp_id = fields.Int()
    salary = fields.Float()
    position = fields.Str()
    mgr_id = fields.Int()

class ListEmployeeSchema(Schema):
    name = fields.Str()
    surname = fields.Str()
    emp_id = fields.Int()
    position = fields.Str()
    mgr_id = fields.Int()


class Employee(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(), nullable=False)
    surname = db.Column(db.String(), nullable=False)
    dob = db.Column(db.Date(), nullable=False)
    emp_id = db.Column(db.Integer(), unique=True, nullable=False)
    salary = db.Column(db.Float(), nullable=False)
    position = db.Column(db.String(), nullable=False)
    mgr_id = db.Column(db.Integer(), nullable=True)

    def __init__(self, **kwargs):
        if isinstance(kwargs['dob'], str):
            kwargs['dob'] = datetime.datetime.strptime(kwargs['dob'], '%Y-%m-%d')
        super(Employee, self).__init__(**kwargs)


    def __repr__(self):
        return f'<Employee {self.name} {self.surname}>'

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def update(self,
        # name,
        # surname,
        # dob,
        # emp_id,
        # salary,
        # position,
        # mgr_id,
        **kwargs, 
    ):

        modifiable_fields = ['name', 'surname', 'emp_id', 'salary', 'position', 'mgr_id']
        dob = kwargs.get('dob', None)
        if dob is not None:
            if isinstance(dob, str):
                self.dob = datetime.datetime.strptime(kwargs['dob'], '%Y-%m-%d')
            else:
                self.dob = dob

        
        for field in modifiable_fields:
            if field in kwargs:
                setattr(self, field, kwargs[field])
        db.session.commit()
