import { groq } from '@ai-sdk/groq';
import { xai } from '@ai-sdk/xai';
import { experimental_wrapLanguageModel as wrapLanguageModel } from 'ai';

import { customMiddleware } from './custom-middleware';

export const customModel = (apiIdentifier: string) => {
  const model = (apiIdentifier === 'grok-beta' || apiIdentifier === 'grok-vision-beta') ? xai(apiIdentifier) : groq(apiIdentifier);
  return wrapLanguageModel({
    model,
    middleware: customMiddleware,
  });
};

