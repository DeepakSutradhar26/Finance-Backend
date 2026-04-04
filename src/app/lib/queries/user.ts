import {gql} from "@apollo/client";

export const GET_USERS = gql`
    query GetUsers {
        users {
            id
            name
            email
            role
            isActive
            records {
                id
            }
        }
    }
`;

export const GET_USER_BY_ID = gql`
    query GetUserById($id : String){
        userById(id : $id) {
            id
            name
            email
            role
            isActive
            records {
                id
            }
        }
    }
`;