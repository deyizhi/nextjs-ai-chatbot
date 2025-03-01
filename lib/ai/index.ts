import { groq, createGroq } from '@ai-sdk/groq';
import { xai } from '@ai-sdk/xai';
import { createOpenAI,openai } from '@ai-sdk/openai'; // Assuming this is the correct import for the OpenAI object
import { google } from '@ai-sdk/google';
import { deepseek } from '@ai-sdk/deepseek';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createFireworks } from '@ai-sdk/fireworks';
import {
  extractReasoningMiddleware,
  wrapLanguageModel,
} from 'ai';
//import { createOpenRouter } from '@openrouter/ai-sdk-provider';
//import { openrouter } from "@openrouter/ai-sdk-provider";

const openai_custom = createOpenAI({
  // custom settings, e.g.
  baseURL: process.env.OPENAI_URL_CUSTOM, // Specify the base URL for OpenAI
  apiKey: process.env.OPENAI_API_KEY_CUSTOM, 
});

const openrouter_custom = createOpenAI({
  // custom settings, e.g.
  baseURL: process.env.OPENROUTER_URL, // Specify the base URL for OpenAI
  apiKey: process.env.OPENROUTER_API_KEY, 
});

const nvidia_custom = createOpenAI({
  // custom settings, e.g.
  baseURL: process.env.NVIDIA_API_URL, // Specify the base URL for OpenAI
  apiKey: process.env.API_KEY_REQUIRED_IF_EXECUTING_OUTSIDE_NGC, 
});

const openai_gpt4free = createOpenAI({
  // custom settings, e.g.
  baseURL: process.env.OPENAI_URL_FREE ?? '', // Specify the base URL for OpenAI
  apiKey: process.env.OPENAI_API_KEY_FREE ?? '', 
});

const openai_together = createOpenAI({
  // custom settings, e.g.
  baseURL: process.env.TOGETHER_API_URL,// Specify the base URL for OpenAI, 
  apiKey: process.env.TOGETHER_API_KEY, 
});

const openai_sambanova = createOpenAI({
  // custom settings, e.g.
  baseURL: process.env.SAMBANOVA_API_URL,// Specify the base URL for OpenAI, 
  apiKey: process.env.SAMBANOVA_API_KEY, 
});

const openai_official = createOpenAI({
  // custom settings, e.g.
  baseURL: process.env.OPENAI_API_URL_OFFICIAL, // Specify the base URL for OpenAI
  apiKey: process.env.OPENAI_API_KEY_OFFICIAL, 
});

const anthropic_official = createAnthropic({
  baseURL: process.env.ANTHROPIC_URL,
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const perplexity_official = createOpenAI({
  baseURL: process.env.PERPLEXITY_URL,
  apiKey: process.env.PERPLEXITY_API_KEY,
});

const fireworks_official = createFireworks({
  baseURL: process.env.FIREWORKS_URL,
  apiKey: process.env.FIREWORKS_API_KEY,
});

export const customModel = (modelId: string) => {

  let providerMark = '';
  if ('deepseek-R1' === modelId) {
    const randomValue = Math.random();
    providerMark = randomValue < 0.1 ? 'nvidia' : randomValue < 0.2 ? 'deepseek' : randomValue < 0.5 ? 'fireworks' : 'together';
  } else if ('deepseek-r1-distill-llama-70b' === modelId) {
    //providerMark = Math.random() < 0.7 ? 'groq' : 'sambanova';
    providerMark = 'groq';
  }

  let model;
  switch (modelId) {
    case 'grok-beta':
    case 'grok-vision-beta':
      model = xai(modelId);
      break;
    case 'gpt-3.5-turbo':
    case 'gpt-4o-mini':
      model = openai_custom(modelId); 
      break;
    case 'gpt-4o':
      model = openai_official('gpt-4o-2024-11-20');
      break;
    //case 'o1':
    case 'o1-mini':
      //o1min不能使用azure 太贵
      model = openai_official('o1-mini-2024-09-12'); 
      break;
    case 'o3-mini':
      model = openrouter_custom('openai/o3-mini'); 
      break;
    case 'gemini-1.5-flash':
    case 'gemini-2.0-flash-exp':
      model = google(modelId); // Using Google SDK for Gemini models
      break;
    case 'gemini-2.0-flash-thinking-exp-01-21': 
      model = google(modelId);
      break;
    case 'deepseek-chat':
      model = deepseek(modelId);
      break;
    case 'deepseek-r1-distill-llama-70b':
      switch (providerMark) {
        case 'sambanova':
          model = openai_sambanova("DeepSeek-R1-Distill-Llama-70B");
          break;
        default:
          model =  wrapLanguageModel({
            model: groq('deepseek-r1-distill-llama-70b'),
            middleware: extractReasoningMiddleware({ tagName: 'think' }),
          });
          break;
      }
      break;
    case 'deepseek-R1':
        switch (providerMark) {
          case 'nvidia':
            model =  wrapLanguageModel({
              model: nvidia_custom("deepseek-ai/deepseek-r1"),
              middleware: extractReasoningMiddleware({ tagName: 'think' }),
              });
            break;
          case 'openrouter_free':
            model =  wrapLanguageModel({
              model: openrouter_custom("deepseek/deepseek-r1:free"),
              middleware: extractReasoningMiddleware({ tagName: 'think' }),
              });
            break;
          case 'deepseek':
            model = deepseek("deepseek-reasoner");
            break;
          case 'openrouter_standard':
            model =  wrapLanguageModel({
                model: openrouter_custom("deepseek/deepseek-r1"),
                middleware: extractReasoningMiddleware({ tagName: 'think' }),
                });
            break;
          case 'openrouter_nitro':
            model =  wrapLanguageModel({
              model: openrouter_custom("deepseek/deepseek-r1:nitro"),
              middleware: extractReasoningMiddleware({ tagName: 'think' }),
              });
            break;
          case 'together':
            model = wrapLanguageModel({
              model: openai_together('deepseek-ai/DeepSeek-R1'),
              middleware: extractReasoningMiddleware({ tagName: 'think' }),
              });
            break;
          case 'fireworks':
            model = wrapLanguageModel({
              model: fireworks_official('accounts/fireworks/models/deepseek-r1'),
              middleware: extractReasoningMiddleware({ tagName: 'think' }),
            });
            break;
          case 'sambanova':
            model =  wrapLanguageModel({
              model: openai_sambanova('DeepSeek-R1'),
              middleware: extractReasoningMiddleware({ tagName: 'think' }),
              });
            break;  
          default:
            model = deepseek("deepseek-reasoner");
            break;  
        }
      break;
    case 'R1-1776':
      model = Math.random() < 0.5 
        ? perplexity_official("r1-1776")
        : openrouter_custom("perplexity/r1-1776");
      break;
    case 'claude-3.5-haiku': 
      //model = openrouter_custom("anthropic/claude-3.5-haiku");
      model = anthropic_official("claude-3-5-haiku-20241022");
      break;
    case 'claude-3.5-sonnet0620': 
      model = Math.random() < 0.5 
        ? openrouter_custom("anthropic/claude-3.5-sonnet-20240620")
        : anthropic_official("claude-3-5-sonnet-20240620");
      break;
    case 'claude-3.5-sonnet': 
      model = anthropic_official("claude-3-5-sonnet-20241022");
      break;
    //case 'claude-3-opu': 
      //TODO
      //break;
    default:
      model = groq(modelId);
      break;
  }

  if (!model) {
    model = groq(modelId);
  }
  return model;
};

