import {gql} from "@apollo/client";

export const GET_RECORDS = gql`
    query GetRecords($type : Type, $category : String, $from : String, $to : String, $page : Int, $limit : Int) {
        records(type : $type, category : $category, from : $from, to : $to, page : $page, limit : $limit) {
            records {
                id
                amount,
                type,
                category,
                description,
                createdAt
            },
            meta {
                total,
                page,
                limit,
                totalPages
            }
        }
    }
`;

export const GET_RECENT_ACTIVITY = gql`
    query GetRecentActivity($limit : Int){
        recentActivity(limit : $limit){
            id
            amount,
            type,
            category,
            description,
            createdAt
        } 
    }
`;