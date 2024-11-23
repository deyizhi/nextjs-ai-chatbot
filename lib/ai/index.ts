import { groq } from '@ai-sdk/groq';
import { xai } from '@ai-sdk/xai';
import { experimental_wrapLanguageModel as wrapLanguageModel } from 'ai';
import { createOpenAI,openai } from '@ai-sdk/openai'; // Assuming this is the correct import for the OpenAI object
import { customMiddleware } from './custom-middleware';

const openai_custom = createOpenAI({
  // custom settings, e.g.
  baseURL: process.env.OPENAI_URL_CUSTOM, // Specify the base URL for OpenAI
  apiKey: process.env.OPENAI_API_KEY_CUSTOM, 
});

export const customModel = (apiIdentifier: string) => {
  let model;
  switch (apiIdentifier) {
    case 'grok-beta':
    case 'grok-vision-beta':
      model = xai(apiIdentifier);
      break;
    case 'gpt-3.5-turbo':
    case 'net-gpt-3.5-turbo':
    case 'gpt-4o-mini':  
      model = openai_custom(apiIdentifier); // Using the OpenAI object for these models
      break;
    case 'gpt-4o':
      model = openai(apiIdentifier); // Using the OpenAI object for these models
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

