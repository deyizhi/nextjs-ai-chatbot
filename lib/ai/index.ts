import { groq } from '@ai-sdk/groq';
import { xai } from '@ai-sdk/xai';
import { experimental_wrapLanguageModel as wrapLanguageModel } from 'ai';
import { openai } from 'openai-sdk'; // Assuming this is the correct import for the OpenAI object

import { customMiddleware } from './custom-middleware';

const openai_custom = (apiIdentifier: string) => {
  return openai.createOpenAI({
    baseUrl: 'https://run.v36.cm/v1', // Specify the base URL for OpenAI
  });
};


export const customModel = (apiIdentifier: string) => {
  let model;
  switch (apiIdentifier) {
    case 'grok-beta':
    case 'grok-vision-beta':
      model = xai(apiIdentifier);
      break;
    case 'gpt-3.5-turbo':
    case 'gpt-4o-mini':
    case 'net-gpt-3.5-turbo':
      model = openai_custom(apiIdentifier); // Using the OpenAI object for these models
      break;
    default:
      model = groq(apiIdentifier);
      break;
  }
  return wrapLanguageModel({
    model,
    middleware: customMiddleware,
  });
};

