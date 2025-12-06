// envVars Function
interface EnvConfig {
  BACKEND_URL: string;
  NODE_ENV: string;
  JWT: {
    ACCESS_TOKEN_SECRET: string;
    ACCESS_TOKEN_EXPIRESIN: string;
  };
}

const loadEnvs = (): EnvConfig => {
  // Check missing envs
  const requiredEnvs: string[] = [
    "NEXT_PUBLIC_BACKEND_URL",
    "JWT_ACCESS_TOKEN_SECRET",
    "JWT_ACCESS_TOKEN_EXPIRESIN",
    "NODE_ENV",
  ];

  requiredEnvs.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Missing the required enviroment variable : ${key}`);
    }
  });

  // Return validated envs
  return {
    BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL as string,
    NODE_ENV: process.env.NODE_ENV as string,
    JWT: {
      ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET as string,
      ACCESS_TOKEN_EXPIRESIN: process.env.JWT_ACCESS_TOKEN_EXPIRESIN as string,
    },
  };
};

const envVars = loadEnvs();
export default envVars;
