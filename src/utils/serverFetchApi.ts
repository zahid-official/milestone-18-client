import envVars from "@/config/envVars";

// serverFetchHelper Function
const serverFetchHelper = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const { headers, ...restOptions } = options;
  const res = await fetch(`${envVars.BACKEND_URL}${endpoint}`, {
    headers: {
      ...headers,
    },
    ...restOptions,
  });

  return res;
};

// Fetch Methods
const getMethod = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  return serverFetchHelper(endpoint, { ...options, method: "GET" });
};

const postMethod = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  return serverFetchHelper(endpoint, { ...options, method: "POST" });
};

const putMethod = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  return serverFetchHelper(endpoint, { ...options, method: "PUT" });
};

const patchMethod = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  return serverFetchHelper(endpoint, { ...options, method: "PATCH" });
};

const deleteMethod = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  return serverFetchHelper(endpoint, { ...options, method: "DELETE" });
};

// Export methods
const serverFetchApi = {
  get: getMethod,
  post: postMethod,
  put: putMethod,
  patch: patchMethod,
  delete: deleteMethod,
};

export default serverFetchApi;
