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
    id: 'grok-beta',
    label: 'Grok Beta',
    apiIdentifier: 'grok-beta',
    description: 'Model designed for advanced reasoning and analysis tasks',
  },
  {
    id: 'gpt-3.5-turbo',
    label: 'GPT-3.5 Turbo',
    apiIdentifier: 'gpt-3.5-turbo',
    description: 'A powerful model for conversational tasks',
  },
  {
    id: 'gpt-4o-mini',
    label: 'GPT-4O Mini',
    apiIdentifier: 'gpt-4o-mini',
    description: 'A compact version of GPT-4 for efficient processing',
  },
  {
    id: 'net-gpt-3.5-turbo',
    label: 'Net GPT-3.5 Turbo',
    apiIdentifier: 'net-gpt-3.5-turbo',
    description: 'A variant of GPT-3.5 Turbo optimized for network tasks',
  },
] as const;

export const DEFAULT_MODEL_NAME: string = 'grok-beta';
