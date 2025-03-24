
export interface API {
    project_id: string;
    is_public: boolean;
    description: string;
    name: string;

  }
  
  
  export type APIDetails = {
    project_id: string;
    name: string;
    method: string;
    description: string;
    api_id: string;
    endpoint: string;
    requiresAuth: boolean;
  }
  
  
   
  export type APIResponseDetails = {
    resp_id: string;
    status_code: string;
    condition: string;
    response: string;
    api_id: string;
  }
  
  
  export type APIParameterDetails = {
    description: any;
    expected_value: string;
    name: string;
    type: string;
    api_parameter_id: string;
    api_id: string;
    is_required:string;
    location:string;
  }
  
  
  export type APIHeaderDetails = {
    description: any;
    name: string;
    expected_value: string;
    header_id: string;
    api_id: string;
    is_required:string;
  }

  
  
  
  

  
  

  