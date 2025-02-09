// Define your models here.

export interface Model {
  id: string;
  label: string;
  apiIdentifier: string;
  description: string;
}

export const models: Array<Model> = [
//  {
//    id: 'llama-3.2-90b-vision-preview',
//    label: 'Llama 3.2 90B Vision',
//    apiIdentifier: 'llama-3.2-90b-vision-preview',
//    description: 'Advanced model with vision capabilities',
//  },
  {
    id: 'gemini-2.0-flash-exp',
    label: 'Google Gemini 2.0 Flash Exp',
    apiIdentifier: 'gemini-2.0-flash-exp',
    description: 'The latest advanced model from Google, offering enhanced capabilities and speed',
  },
  {
    id: 'gpt-4o-mini',
    label: 'OpenAI GPT 4o mini',
    apiIdentifier: 'gpt-4o-mini',
    description: 'Small model for fast, lightweight tasks',
  },
  {
    id: 'gpt-4o',
    label: 'OpenAI GPT 4o',
    apiIdentifier: 'gpt-4o',
    description: 'A powerful model for conversational tasks',
  },
  {
    id: 'o1-mini',
    label: 'OpenAI o1-mini',
    apiIdentifier: 'o1-mini',
    description: 'optimized for math, science, programming, and other STEM-related tasks.',
  },
//  {
//    id: 'o3-mini',
//    label: 'OpenAI o3-mini',
//    apiIdentifier: 'o3-mini',
//    description: 'A cost-efficient language model optimized for STEM reasoning tasks, particularly excelling in science, mathematics, and coding',
//  },
  {
    id: 'deepseek-chat',
    label: 'Deepseek-V3',
    apiIdentifier: 'deepseek-chat',
    description: 'A powerful model for conversational tasks',
  },
  {
    id: 'deepseek-R1',
    label: 'Deepseek R1 Full',
    apiIdentifier: 'deepseek-R1',
    description: 'An advanced reasoning model for complex tasks',
  },
  {
    id: 'deepseek-r1-distill-llama-70b',
    label: 'Deepseek R1 Distill Llama 70B',
    apiIdentifier: 'deepseek-r1-distill-llama-70b',
    description: 'A distilled version of the Deepseek R1 model, optimized for efficiency and performance',
  },
  {
    id: 'claude-3.5-haiku',
    label: 'Claude 3.5 Haiku',
    apiIdentifier: 'claude-3.5-haiku',
    description: 'A fast and affordable model from Anthropic',
  },
  {
    id: 'claude-3-sonnet',
    label: 'Claude 3 sonnet',
    apiIdentifier: 'claude-3-sonnet',
    description: 'A efficiency model from Anthropic',
  },
  /*
  {
    id: 'claude-3.5-sonnet',
    label: 'claude-3.5-sonnet slow beta',
    apiIdentifier: 'claude-3.5-sonnet',
    description: 'A efficiency model from Anthropic',
  },*/
  {
    id: 'gemini-2.0-flash-thinking-exp-01-21',
    label: 'Google Gemini 2.0 Flash Thinking Exp',
    apiIdentifier: 'gemini-2.0-flash-thinking-exp-01-21',
    description: 'Google’s advanced reasoning model for complex and thoughtful tasks',
  },
] as const;

export const DEFAULT_MODEL_NAME: string = 'gemini-2.0-flash-exp';
