
import { toast } from "@/hooks/use-toast";

const getApiUrl = () => {
  // Hardcoding the backend URL to remove any ambiguity.
  // The backend server MUST have CORS configured to allow requests from the frontend's origin.
  return "http://localhost:2000"; 
};

const handleResponse = async (response) => {
  if (response.ok) {
    try {
        const text = await response.text();
        return text ? JSON.parse(text) : {};
    } catch (e) {
        // The response was successful, but didn't have a JSON body.
        return {};
    }
  } else {
    let errorMessage = `An error occurred: ${response.statusText}`;
    const responseClone = response.clone(); // Clone the response to read body safely
    const responseText = await response.text();

    if (responseText) {
        try {
            // Try to parse a detailed JSON error response from the clone
            const errorData = await responseClone.json();
            console.error("API Error Response (JSON):", errorData);
            
            // Construct a detailed error message from the JSON payload
            if (errorData.message) {
                errorMessage = errorData.message;
            } else if (errorData.error) {
                errorMessage = errorData.error;
            } else if (Object.keys(errorData).length > 0) {
                // Fallback to stringifying the whole object if specific fields aren't found
                errorMessage = JSON.stringify(errorData);
            } else {
                // If errorData is an empty object, use the raw text if available
                errorMessage = responseText || `Error: ${response.statusText}`;
            }

        } catch (e) {
            // If parsing as JSON fails, use the raw text from the original response
            console.error("API Error Response (Text):", responseText);
            errorMessage = responseText;
        }
    }

    toast({
        variant: "destructive",
        title: `API Error (Status: ${response.status})`,
        description: errorMessage,
    });
    
    throw new Error(errorMessage);
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
    const isFormData = body instanceof FormData;
    const response = await fetch(`${getApiUrl()}${endpoint}`, {
      method: 'PUT',
      headers: getHeaders(isFormData),
      body: isFormData ? body : JSON.stringify(body),
    });
    return handleResponse(response);
  },
  patch: async (endpoint, body) => {
    const isFormData = body instanceof FormData;
    const response = await fetch(`${getApiUrl()}${endpoint}`, {
        method: 'PATCH',
        headers: getHeaders(isFormData),
        body: isFormData ? body : JSON.stringify(body),
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
