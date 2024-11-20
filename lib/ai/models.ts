// Define your models here.

export interface Model {
  id: string;
  label: string;
  apiIdentifier: string;
  description: string;
}

export const models: Array<Model> = [
  {
    id: 'mixtral-8x7b-32768',
    label: 'Mixtral 8x7B',
    apiIdentifier: 'mixtral-8x7b-32768',
    description: 'Powerful model for complex reasoning and generation tasks',
  },
  {
    id: 'llama-3.2-90b-vision-preview',
    label: 'Llama 3.2 90B Vision',
    apiIdentifier: 'llama-3.2-90b-vision-preview', 
    description: 'Advanced model with vision capabilities',
  },
] as const;

export const DEFAULT_MODEL_NAME: string = 'mixtral-8x7b-32768';
