import {gql} from "graphql-tag";

export const dashboardSchema = gql`
    type DashboardSummary {
        totalIncome : Int!
        totalExpense : Int!
        netBalance : Int!
        recordCount : Int!
    }

    type CategoryTotal {
        category : String!
        total : Int!
        count : Int!
    }

    type MonthlyTrend {
        month : String!
        income : Int!
        expense : Int!
    }

    extend type Query {
        dashboardSummary : DashboardSummary!

        categoryTotals : [CategoryTotal!]

        monthlyTrends(year : Int) : [MonthlyTrend!]
    }
`;