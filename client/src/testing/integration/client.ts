import axios, { AxiosError } from "axios";
import * as api from "./api";

const URL = "http://localhost:3020";

export async function resetDatabase(): Promise<api.ResetDatabase_Response> {
  const url = `${URL}/reset`;
  let statusCode: number;
  let statusText: string;
  try {
    const response = await axios({
      url,
      method: "POST",
      responseType: "json",
    });
    statusCode = response.status;
    statusText = response.statusText;
  } catch (e) {
    const axiosError = e as AxiosError;
    if (axiosError.response) {
      statusCode = axiosError.response.status;
      statusText = axiosError.response.statusText;
    } else {
      statusCode = 503;
      statusText = axiosError.code || axiosError.message;
    }
  }
  switch (statusCode) {
    case 200:
      return {
        kind: "success",
      };
    default:
      throw new Error(`Unexpected status: ${statusCode} ${statusText}`);
  }
}
