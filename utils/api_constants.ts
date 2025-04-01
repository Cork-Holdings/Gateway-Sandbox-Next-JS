// Base URLs

export const base_ip = "localhost:2000";
export const base_url = `http://${base_ip}/v1`;

export const sandbox_url = `http://${base_ip}`;

// API Endpoints
export const api_endpoints = {
    // Auth-related Endpoints
    auth: {
        login: `${base_url}/auth/login`,
        Register: `${base_url}/auth/register`,
      },

    backoffice: {
    
    },

    // Company-related Endpoints
    merchant: {
        makeAuthorizationRequest : `${base_url}/token-generate`,
        makeCollectionRequest: `${base_url}/make-collection`
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
        getAPIcredentials : `${base_url}/user/credentials/get`
    },
};
