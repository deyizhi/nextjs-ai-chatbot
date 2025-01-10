// Define your models here.

export interface Model {
  id: string;
  label: string;
  apiIdentifier: string;
  description: string;
}
export const models: Array<Model> = [
  {
    id: 'llama-3.2-90b-vision-preview',
    label: 'Llama 3.2 90B Vision',
    apiIdentifier: 'llama-3.2-90b-vision-preview',
    description: 'Advanced model with vision capabilities',
  },
  {
    id: 'gpt-3.5-turbo',
    label: 'GPT-3.5 Turbo',
    apiIdentifier: 'gpt-3.5-turbo',
    description: 'A powerful model for conversational tasks',
  },
  {
    id: 'gpt-4o-mini',
    label: 'GPT 4o mini',
    apiIdentifier: 'gpt-4o-mini',
    description: 'Small model for fast, lightweight tasks',
  },
    {
    id: 'deepseek-chat',
    label: 'Deepseek Chat',
    apiIdentifier: 'deepseek-chat',
    description: 'A powerful model for conversational tasks',
  },
  {
    id: 'gemini-1.5-flash',
    label: 'Google Gemini 1.5 Flash',
    apiIdentifier: 'gemini-1.5-flash',
    description: 'The previous generation of Google Gemini Flash models, offering a balance of power and speed',
  },
  {
    id: 'gemini-2.0-flash-exp',
    label: 'Google Gemini 2.0 Flash Exp',
    apiIdentifier: 'gemini-2.0-flash-exp',
    description: 'The latest advanced model from Google, offering enhanced capabilities and speed',
  },
] as const;

export const DEFAULT_MODEL_NAME: string = 'gpt-4o-mini';
