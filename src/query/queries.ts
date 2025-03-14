import { gql } from '@apollo/client/core';

export const GET_ALL_USERS = gql`
query FindAllUsers {
  findAllUsers {
    id
    status
    username
    email
    telephone
    role
  }
}`;

export const GET_ALL_AUTHORS = gql`
query FindAllAuthors {
  findAllAuthors {
      id
      name
      email
      telephone
      status
      age
  }
}`;

export const GET_ALL_COUNTRIES = gql`
query FindAllCountries {
    findAllCountries {
        id
        name
        status
    }
}`;


