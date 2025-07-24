// Base URLs




//local
// export const base_ip = "localhost:2000";
// export const next_url ="localhost:3000";
// export const base_url = `http://${base_ip}/v1`;

// export const sandbox_url = `http://${base_ip}`;


//prod

export const base_ip = "pgsandbox.mygeepay.com";
export const next_url ="pgsandbox.mygeepay.com";
export const base_url = `https://${base_ip}/v1`;

export const sandbox_url = `https://${base_ip}`;

// API Endpoints
export const api_endpoints = {
    // Auth-related Endpoints
    auth: {
        login: `${base_url}/auth/login`,
        Register: `${base_url}/auth/register`,
      },

    backoffice: {
        getUsers: `${base_url}/users/get`,
        deleteUser: `${base_url}/user/delete`,
        editUser: `${base_url}/user/edit`,
        getMerchants:`${base_url}/merchants/get`,
        getOverviewInfo:`${base_url}/overview/cards`,
        getTransactions:`${base_url}/dashboard/transactions`,
        getAPIRequests:`${base_url}/dashboard/requests`,
        getAllUsers: `${base_url}/dashboard/users`,
        getTransactionChannels:`${base_url}/dashboard/transactions/channels`,
        getResponseTimes:`${base_url}/dashboard/request/response`,
        getTopMerchants:`${base_url}/dashboard/merchants/top`,
        getUserStats: `${base_url}/dashboard/users/info`,
        getMerchantStats: `${base_url}/dashboard/merchants/info`,
        getAPIStats: `${base_url}/dashboard/requests/info`,
        getTransactionStats: `${base_url}/dashboard/transactions/info`,
         
    
    },

    // Company-related Endpoints
    merchant: {
        makeAuthorizationRequest : `${base_url}/oauth/token`,
        makeCollectionRequest: `${base_url}/mobile-money/collect`,
        makeTransactionQueryRequest:`${base_url}/mobile-money/check-status`,
        makeNameLookupRequest:`${base_url}/mobile-money/name-lookup`,
        makeDisburseRequest: `${base_url}/mobile-money/disburse`,
        makeQueryDisbursementRequest: `${base_url}/mobile-money/disburse/status`,
        makeCheckoutRequest: `${base_url}/checkout/respond`,
        makeGetCheckoutDetailsRequest: `${base_url}/checkout/get`,
        makeAddCheckoutRequest: `${base_url}/checkout/session`,
        makeQueryDisbursementBalanceRequest: `${base_url}/mobile-money/disburse/balance`,
    },

    common: {
        getProjects: `${base_url}/projects/get`,
        getApis: `${base_url}/apis/get`,
        getApiResponse: `${base_url}/api/responses/get`,
        getAPiParameters: `${base_url}/api/parameters/get`,
        getApiHeaders: `${base_url}/api/headers/get`,
        getApiDetails :`${base_url}/api/get`,
        getProjectDetails :`${base_url}/project/get`,
        generateSignature: `${base_url}/signature/generate`,
        generateSecret: `${base_url}/secret/generate`,
        updatePin: `${base_url}/pin/create`,
        updateFloat:`${base_url}/float/update`,
        getAPIcredentials : `${base_url}/user/credentials/get`,
        resetPassword:`${base_url}/reset/password`,
        verifyCode:`${base_url}/verify/code`,
        requestCode:`${base_url}/request/code`,
        getUserProfile: `${base_url}/user/get`
    },
};
