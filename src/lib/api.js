import { toast } from "@/hooks/use-toast";

const getApiUrl = () => {
  // During development, the proxy will handle this.
  // For production, the full URL might be needed if the API is on a different domain.
  return ""; 
};

const handleResponse = async (response) => {
  if (response.ok) {
    try {
        const data = await response.json();
        return data;
    } catch (e) {
        // The response was successful, but didn't have a JSON body.
        return {};
    }
  } else {
    const errorData = await response.text();
    console.error("API Error:", errorData);
    toast({
        variant: "destructive",
        title: "API Error",
        description: "An error occurred while fetching data. Please try again."
    });
    throw new Error(errorData || "An error occurred while fetching data.");
  }
};

const getAuthToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('token');
    }
    return null;
}

const getHeaders = (isFormData = false) => {
    const headers = {};
    const token = getAuthToken();

    if (!isFormData) {
        headers['Content-Type'] = 'application/json';
    }
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
}

export const api = {
  get: async (endpoint) => {
    const response = await fetch(`${getApiUrl()}${endpoint}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
  post: async (endpoint, body) => {
    const isFormData = body instanceof FormData;
    const response = await fetch(`${getApiUrl()}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(isFormData),
      body: isFormData ? body : JSON.stringify(body),
    });
    return handleResponse(response);
  },
  put: async (endpoint, body) => {
    const response = await fetch(`${getApiUrl()}${endpoint}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(body),
    });
    return handleResponse(response);
  },
  delete: async (endpoint) => {
    const response = await fetch(`${getApiUrl()}${endpoint}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
};