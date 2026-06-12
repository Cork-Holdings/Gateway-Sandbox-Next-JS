export interface Transaction {
    id: string;
    reference: string;
    amount: string;
    status: string;
    customer: string;
    channel: string;
    type: string;
    narration: string;
    date: string;
}