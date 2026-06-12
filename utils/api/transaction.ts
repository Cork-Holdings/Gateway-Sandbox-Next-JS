import { api_endpoints } from "../api_constants";
import { Transaction } from "../types/Filters";

export const GetTransactions = async ({
    token,
    page,
    page_size,
    status,
    portal,
    user_id,
    transaction_reference,
    customer,
    external_reference,
    transaction_type,
    channel,
    start_date,
    end_date,
}: {
    token: string;
    page?: number;
    page_size?: number;
    status?: string;
    search_query?: string;
    portal?: string;
    user_id: string;
    transaction_reference: string;
    customer: string;
    external_reference: string;
    transaction_type: string;
    channel: string;
    start_date: string;
    end_date: string;
}): Promise<{
    transactions: Transaction[];
    total_pages: number;
    current_page: number;
    has_more: boolean;
    count: number;
    pending: number;
    successful: number;
    failed: number;
}> => {
    try {

        const params = new URLSearchParams();
        if (page) params.append("page", page.toString());
        if (page_size) params.append("page_size", page_size.toString());
        if (status) params.append("status", status);
        if (portal) params.append("portal", portal);

        if (user_id) params.append("user_id", user_id);
        if (transaction_reference) params.append("transaction_reference", transaction_reference);
        if (customer) params.append("customer", customer);
        if (external_reference) params.append("external_reference", external_reference);
        if (transaction_type) params.append("transaction_type", transaction_type);
        if (channel) params.append("channel", channel);
        if (start_date) params.append("start_date", start_date);
        if (end_date) params.append("end_date", end_date);

        const response = await fetch(`${api_endpoints.backoffice.getTransactions}?${params.toString()}`, {

            headers: {
                "Authorization": `Bearer ${token}`,
            },
          
        });

        const responseBody = await response.json();

        if (responseBody["status"] === "success") {
            const data = responseBody.data;
            return {
                transactions: data.transactions || [],
                total_pages: data.total_pages || 1,
                current_page: data.current_page || 1,
                has_more: data.has_more || false,
                count: data.count || 0,
                pending: data.total_pending || 0,
                successful: data.total_successful || 0,
                failed: data.total_failed || 0,
            };
        } else {
            throw new Error(responseBody.error || "Failed to get transactions");
        }
    }
    catch (error) {
        throw new Error(`${error}` || "Failed to get transactions");
    }
};

// export const CreateCategory = async ({
//     token,
//     data
// }: {
//     token: string;
//     data: any;
// }) => {
//     try {
//         const response = await fetch(api_endpoints.createCategory, {
//             method: "POST",
//             headers: {
//                 "Authorization": `Bearer ${token}`,
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify(data),
//         });

//         const responseBody = await response.json();

//         if (responseBody["status"] === "success") {
//             return responseBody.data;
//         } else {
//             throw new Error(responseBody.error || "Failed to create category");
//         }
//     } catch (error) {
//         throw new Error(`${error}` || "Failed to create category");
//     }
// };
