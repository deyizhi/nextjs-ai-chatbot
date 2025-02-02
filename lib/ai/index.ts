import { groq } from '@ai-sdk/groq';
import { xai } from '@ai-sdk/xai';
import { experimental_wrapLanguageModel as wrapLanguageModel } from 'ai';
import { createOpenAI,openai } from '@ai-sdk/openai'; // Assuming this is the correct import for the OpenAI object
import { customMiddleware } from './custom-middleware';
import { google } from '@ai-sdk/google';
import { deepseek } from '@ai-sdk/deepseek';
//import { createOpenRouter } from '@openrouter/ai-sdk-provider';
//import { openrouter } from "@openrouter/ai-sdk-provider";

const openai_custom = createOpenAI({
  // custom settings, e.g.
  baseURL: process.env.OPENAI_URL_CUSTOM, // Specify the base URL for OpenAI
  apiKey: process.env.OPENAI_API_KEY_CUSTOM, 
});

const openrouter_custom = createOpenAI({
  // custom settings, e.g.
  baseURL: 'https://openrouter.ai/api/v1', // Specify the base URL for OpenAI
  apiKey: process.env.OPENROUTER_API_KEY, 
});

const nvidia_custom = createOpenAI({
  // custom settings, e.g.
  baseURL: process.env.NVIDIA_API_URL, // Specify the base URL for OpenAI
  apiKey: process.env.API_KEY_REQUIRED_IF_EXECUTING_OUTSIDE_NGC, 
});

const openai_gpt4free = createOpenAI({
  // custom settings, e.g.
  baseURL: process.env.OPENAI_URL_FREE, // Specify the base URL for OpenAI
  apiKey: process.env.OPENAI_API_KEY_FREE, 
});

export const customModel = (apiIdentifier: string) => {
  let model;
  switch (apiIdentifier) {
    case 'grok-beta':
    case 'grok-vision-beta':
      model = xai(apiIdentifier);
      break;
    case 'gpt-3.5-turbo':
    case 'gpt-4o-mini':
      model = openai_custom(apiIdentifier); // Using the OpenAI object for these models
      break;
    case 'gpt-4o':
      //model = openrouter_custom('openai/gpt-4o-2024-11-20');
      model = openai_gpt4free('gpt-4o');
      break;
    //case 'o1':
    case 'o1-mini':
      //model = openrouter_custom('openai/o1-mini'); 
      model = openai_gpt4free('o1-mini');
      break;
    case 'gemini-1.5-flash':
    case 'gemini-2.0-flash-exp':
    case 'gemini-2.0-flash-thinking-exp-01-21':
      model = google(apiIdentifier); // Using Google SDK for Gemini models
      break;
    case 'deepseek-chat':
      model = deepseek(apiIdentifier);
      break;
    case 'deepseek-r1-distill-llama-70b':
      model = groq("deepseek-r1-distill-llama-70b");
      break;
    case 'deepseek-R1':
      model = Math.random() < 0.1 
        ? nvidia_custom("deepseek-ai/deepseek-r1") 
        : Math.random() < 0.5 
          ? openrouter_custom("deepseek/deepseek-r1:free") 
          : deepseek("deepseek-reasoner");
      break;
    case 'claude-3-haiku': 
      model = openrouter_custom("anthropic/claude-3-haiku");
      break;
    //case 'claude-3.5-haiku': 
    //case 'claude-3-sonnet': 
    //case 'claude-3.5-sonnet': 
    //case 'claude-3-opu': 
      //TODO
      //break;
    default:
      model = groq(apiIdentifier);
      break;
  }

  return wrapLanguageModel({
    model,
    middleware: customMiddleware,
  });
};

