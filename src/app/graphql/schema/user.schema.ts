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

    type PageMeta {
        total : Int!
        page : Int!
        limit : Int!
        totalPages : Int!
    }

    type UserPage {
        users : [User!]
        meta : PageMeta
    }

    type Query {
        users(page : Int, limit : Int) : UserPage!
    }
`;