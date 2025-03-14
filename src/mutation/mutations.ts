import { gql } from '@apollo/client/core';

export const LOGIN_ADMIN_USER = gql`
mutation LoginAdmin($email: String!, $password: String!) {
  loginAdmin(email: $email, password: $password)
}`;

export const LOGOUT_USER = gql`
mutation Logout($token: String!) {
    logout(token: $token)
}`;

export const ADD_USER = gql`
mutation CreateUser($username: String!, $email: String!, $password: String!, $telephone: String!, $role: String!) {
  createUser(username: $username, email: $email, password: $password, telephone: $telephone, role: $role) {
      id
      status
      username
      email
      telephone
      password
      role
  }
}`;

export const ADD_AUTHOR = gql`
mutation CreateAuthor($name: String!, $email: String!, $status: Int!, $telephone: String!, $age: Int!){
    createAuthor(name: $name, email: $email, status: $status, telephone: $telephone, age: $age) {
        id
        name
        email
        telephone
        status
        age
    }
}`;

export const ADD_COUNTRY = gql`
mutation CreateCountry($name: String!, $status: Int!){
    createCountry(name: $name, status: $status) {
        id
        name
        status
    }
}`;

export const EDIT_USER = gql`
mutation UpdateUser($id: Int!, $username: String!, $email: String!, $telephone: String!) {
  updateUser(id: $id, username: $username, email: $email, telephone: $telephone) {
      id
      status
      username
      email
      telephone
      password
      role
  }
}`;


export const EDIT_AUTHOR = gql`
mutation UpdateAuthor($id: Int!, $name: String!, $email: String!, $telephone: String!, $age: Int!) {
  updateAuthor(id: $id, name: $name, email: $email, telephone: $telephone, age: $age) {
      id
      name
      email
      telephone
      status
      age
  }
}`;

export const EDIT_COUNTRY = gql`
mutation UpdateCountry($id: Int!, $name: String!) {
  updateCountry(id: $id, name: $name) {
      id
      name
  }
}`;

export const SOFT_DELETE_USER_BY_ID = gql`
mutation SoftDeleteUserById ($id: Int!) {
  softDeleteUserById(id: $id) {
      id
      status
      username
      email
      telephone
      password
      role
  }
}`;

export const SOFT_ACTIVATE_USER_BY_ID = gql`
mutation SetActiveUserById ($id: Int!) {
    setActiveUserById(id: $id) {
        id
        status
        username
        email
        telephone
        password
        role
    }
}`;

export const SOFT_DELETE_AUTHOR_BY_ID = gql`
mutation SoftDeleteAuthorById ($id: Int!) {
  softDeleteAuthorById(id: $id) {
        id
        name
        email
        telephone
        status
        age
  }
}`;

export const SOFT_ACTIVATE_AUTHOR_BY_ID = gql`
mutation SetActiveAuthorById ($id: Int!) {
    setActiveAuthorById(id: $id) {
        id
        name
        email
        telephone
        status
        age
    }
}`;

export const SOFT_DELETE_COUNTRY_BY_ID = gql`
mutation SoftDeleteCountryById ($id: Int!) {
  softDeleteCountryById(id: $id) {
        id
        name
        status
  }
}`;

export const SOFT_ACTIVATE_COUNTRY_BY_ID = gql`
mutation SetActiveCountryById ($id: Int!) {
    setActiveCountryById(id: $id) {
        id
        name
        status
    }
}`;