

export interface OverViewCard{
    users: string,
    merchants:string,
    api_requests:string
}


export interface UserStatistics{
    users :number,
    active_users :number,
    inactive_users :number,
    adminUsers :number,
    merchantUsers :number,  
}

export interface APIResponseTimes{
    endpoint1 :string,
    endpoint2 :string,
    endpoint3 :string,
    endpoint1Time :string,
    endpoint2Time :string,
    endpoint3Time :string,
}



export interface APIStatistics{
    requests :number,
    requests_today :number,
    error_rate :number,
    endpoint1 :string,
    endpoint2 :string,
    endpoint3 :string,
    endpoint1Count :string,
    endpoint2Count :string,
    endpoint3Count :string,
}



export interface MerchantStatistics{
    merchants:number,
    active_merchants:number,
    inactive_merchants:number,
    newToday:number,
    newMonth:number,
    newWeeek:number,
}



export interface TransactionStatistics{
    transactions:number,
    successful:number,
    failed:number,
    pending:number,
    totalAmount:number,
}


export interface TransactionChannels{
    mtn:number,
    zamtel:number,
    airtel:number,
}

export interface API {
    user_id :string,
    status :string,
    endpoint :string,
    method :string,
    ip_address :string,
    id :string,
}

export interface TopMerchants{
    merchant_one: string,
    merchant_two:string,
    merchant_three:string,
    merchant_one_count:string,
    merchant_two_count:string,
    merchant_three_count:string,
}



