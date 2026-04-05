import {gql} from "@apollo/client";

export const GET_SUMMARY = gql`
    query GetSummary{
        dashboardSummary{
            totalIncome
            totalExpense
            netBalance
            recordCount
        }
    }
`;

export const GET_CATEGORY_WISE = gql`
    query GetCategoryWise{
        categoryTotals{
            category
            total
            count
        }
    }
`;

export const GET_MONTHLY_TRENDS = gql`
    query GetMonthlyTrends($year : Int){
        monthlyTrends(year : $year){
            month
            income
            expense
        }
    }
`;