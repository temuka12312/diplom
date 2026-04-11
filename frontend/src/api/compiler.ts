import api from "./axios";

export interface RunCodeResponse {
  output: string;
  error: string;
  exit_code: number;
}

export const runPythonCode = async (code: string): Promise<RunCodeResponse> => {
  const res = await api.post("/ai/run-code/", {
    language: "python",
    code,
  });
  return res.data;
};