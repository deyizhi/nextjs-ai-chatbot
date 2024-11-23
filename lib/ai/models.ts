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
  // {
  //   id: 'grok-vision-beta',
  //   label: 'Grok Vision Beta',
  //   apiIdentifier: 'grok-vision-beta',
  //   description: 'Model with vision capabilities for enhanced analysis',
  // },
] as const;

export const DEFAULT_MODEL_NAME: string = 'grok-beta';
