import { gql } from "graphql-tag";

export const userSchema = gql`
    enum Role {
        Viewer
        Analyst
        Admin
    }

    type User {
        id : String!
        name : String!
        email : String!
        password : String!
        role : Role
        isActive : Boolean
        records : [Record!]
    }

    type Query {
        users : [User!]
        userById(id : String) : User
    }
`;