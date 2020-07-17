import React, { useState, useEffect } from 'react';
import User from './components/User'
import UserForm from './components/UserForm'
import formSchema from './validation/FormSchema'
import axios from 'axios'
import * as Yup from 'yup'
import './App.css'


const initialFormValues = {
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  tos: false
}

const initialFormErrors = {
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  tos: ''
}

const initialUsers = []
const initialDisabled = true

function App() {

  //here we will setup state with useState

  const [users, setUsers] = useState(initialUsers)
  const [formValues, setFormValues] = useState(initialFormValues)
  const [formErrors, setFormErrors] = useState(initialFormErrors)
  const [disabled, setDisabled] = useState(initialDisabled)

  //axios call to get users

  const getUsers = () => {
    axios.get('https://reqres.in/api/users')
      .then(res => {
        setUsers(res.data.data)
      })
      .catch(err => {
        console.log(err)
      })
  }

  const postNewUser = newUser => {
    axios.post('https://reqres.in/api/users', newUser)
      .then(res => {
        setUsers([...users, res.data])
      })
      .catch(err => {
      })
      .then(() => {
        setFormValues(initialFormValues)
        
      })
  }

  //////////////// EVENT HANDLERS ////////////////
  const onInputChange = evt => {
    const name = evt.target.name
    const value = evt.target.value
    Yup
      .reach(formSchema, name)
      .validate(value)
      .then(valid => {
        setFormErrors({
          ...formErrors,
          [name]: ""
        });
      })
      .catch(err => {
        setFormErrors({
          ...formErrors,
          [name]: err.errors[0]
        });
      });

    setFormValues({
      ...formValues,
      [name]: value
    })
  }

  const onCheckboxChange = evt => {
    // const name = evt.target.name
    // const checked = evt.target.checked
    const { name, checked } = evt.target
    console.log()
    Yup
      .reach(formSchema, name)
      .validate(checked)
      .then(() => {
        setFormErrors({
          ...formErrors,
          [name]: ''
        });
      })
      .catch(err => {
        setFormErrors({
          ...formErrors,
          [name]: err.errors[0]
        });
      });
    setFormValues({
      ...formValues,
      [name]: checked,
    })
  }

  const onSubmit = evt => {
    evt.preventDefault()

    const newUser = {
      first_name: formValues.first_name.trim(),
      last_name: formValues.last_name.trim(),
      email: formValues.email.trim(),
      password: formValues.password.trim(),
      tos: formValues.tos // this needs checking 
    }
    postNewUser(newUser)
  }

  useEffect(() => {
    getUsers()
  }, [])

  useEffect(() => {
    formSchema.isValid(formValues).then(valid => {
      setDisabled(!valid);
    })
  }, [formValues])

  return (
    <div className='app'>
      <h1>Users App</h1>
      <UserForm
        values={formValues}
        onInputChange={onInputChange}
        onCheckboxChange={onCheckboxChange}
        onSubmit={onSubmit}
        disabled={disabled}
        errors={formErrors}
      />
      {
        users.map(user => {
          return (
            <User key={user.id} details={user} />
          )
        })
      }
    </div>
  );
}

export default App;