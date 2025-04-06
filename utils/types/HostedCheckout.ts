export interface HDetails {
    order_id: string;
    amount: string;
    customer_name: string;
    customer_email: string;
    checkout_url: string;
    redirect_urls: {
      success: string;
      failure: string;
      cancel: string;
    };
  }
  