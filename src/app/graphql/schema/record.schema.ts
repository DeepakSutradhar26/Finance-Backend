import {gql} from "graphql-tag";

export const recordSchema = gql`
    enum Type {
        Income
        Expense
    }

    type Record {
        id : String!
        amount : String!
        type : Type
        category : String!
        description : String!
        createdAt : String!
    }

    type PageMeta {
        total : Int!
        page : Int!
        limit : Int!
        totalPages : Int!
    }

    type RecordPage {
        records : [Record!]
        meta : PageMeta
    }

    extend type Query {
        records(
            type : Type
            category : String
            from : String
            to : String
            page : Int
            limit : Int
        ): RecordPage!

        recentActivity(limit : Int) : [Record!]
    }
`;