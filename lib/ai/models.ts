import { openai, createOpenAI } from '@ai-sdk/openai';
import { fireworks } from '@ai-sdk/fireworks';
import { customModel } from "./index"
import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from 'ai';

const openai_custom = createOpenAI({
  // custom settings, e.g.
  baseURL: process.env.OPENAI_URL_CUSTOM, // Specify the base URL for OpenAI
  apiKey: process.env.OPENAI_API_KEY_CUSTOM, 
});

export const DEFAULT_CHAT_MODEL: string = 'gemini-2.0-flash-exp';

export const isReasoningModel = (selectedChatModel: string): boolean => {
  return selectedChatModel === 'deepseek-R1' || selectedChatModel === 'deepseek-r1-distill-llama-70b';
};

export const myProvider = customProvider({
  languageModels: {
    'gemini-2.0-flash-exp': customModel('gemini-2.0-flash-exp'),
    'gemini-2.0-flash-thinking-exp-01-21': customModel('gemini-2.0-flash-thinking-exp-01-21'),
    'gpt-4o-mini': customModel('gpt-4o-mini'),
    'gpt-4o': customModel('gpt-4o'),
    'o1-mini': customModel('o1-mini'),
    'deepseek-chat': customModel('deepseek-chat'),
    'deepseek-R1':  customModel('deepseek-R1'),
    'deepseek-r1-distill-llama-70b': customModel('deepseek-r1-distill-llama-70b'),
    'claude-3.5-haiku': customModel('claude-3.5-haiku'),
    'claude-3-sonnet': customModel('claude-3-sonnet'),
    'title-model': openai_custom('gpt-4o-mini'),
    'block-model': openai_custom('gpt-4o-mini'),
  },
  imageModels: {
    'small-model': openai_custom.image('dall-e-2'),
    'large-model': openai_custom.image('dall-e-3'),
  },
});

interface ChatModel {
  id: string;
  name: string;
  description: string;
}

export const chatModels: Array<ChatModel> = [
  {
    id: 'gemini-2.0-flash-exp',
    name: 'Google Gemini 2.0 Flash Exp',
    description: 'The latest advanced model from Google, offering enhanced capabilities and speed',
  },
  {
    id: 'gpt-4o-mini',
    name: 'OpenAI GPT 4o mini',
    description: 'Small model for fast, lightweight tasks',
  },
  {
    id: 'gpt-4o',
    name: 'OpenAI GPT 4o',
    description: 'A powerful model for conversational tasks',
  },
  {
    id: 'o1-mini',
    name: 'OpenAI o1-mini',
    description: 'optimized for math, science, programming, and other STEM-related tasks.',
  },
  {
    id: 'deepseek-chat',
    name: 'Deepseek-V3',
    description: 'A powerful model for conversational tasks',
  },
  {
    id: 'deepseek-R1',
    name: 'Deepseek R1 Full',
    description: 'An advanced reasoning model for complex tasks',
  },
  {
    id: 'deepseek-r1-distill-llama-70b',
    name: 'Deepseek R1 Distill Llama 70B',
    description: 'A distilled version of the Deepseek R1 model, optimized for efficiency and performance',
  },
  {
    id: 'claude-3.5-haiku',
    name: 'Claude 3.5 Haiku',
    description: 'A fast and affordable model from Anthropic',
  },
  {
    id: 'claude-3-sonnet',
    name: 'Claude 3 sonnet',
    description: 'A efficiency model from Anthropic',
  },
  {
    id: 'gemini-2.0-flash-thinking-exp-01-21',
    name: 'Google Gemini 2.0 Flash Thinking Exp',
    description: 'Google’s advanced reasoning model for complex and thoughtful tasks',
  },
] as const;
