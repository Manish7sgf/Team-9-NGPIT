import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

/**
 * Nvidia NIM API client — OpenAI-compatible SDK.
 * Model used: nvidia/nvidia-nemotron-nano-9b-v2
 * Endpoint: https://integrate.api.nvidia.com/v1
 */
export const nvidia = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: "https://integrate.api.nvidia.com/v1",
});
