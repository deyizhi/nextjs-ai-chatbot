import {
  type Message,
  StreamData,
  convertToCoreMessages,
  streamObject,
  streamText,
} from 'ai';
import { z } from 'zod';

import { auth } from '@/app/(auth)/auth';
import { customModel } from '@/lib/ai';
import { models } from '@/lib/ai/models';
import { systemPrompt } from '@/lib/ai/prompts';
import yahooFinance from 'yahoo-finance2';

import {
  deleteChatById,
  getChatById,
  getDocumentById,
  saveChat,
  saveDocument,
  saveMessages,
  saveSuggestions,
} from '@/lib/db/queries';
import type { Suggestion } from '@/lib/db/schema';
import {
  generateUUID,
  getMostRecentUserMessage,
  sanitizeResponseMessages,
} from '@/lib/utils';

import { generateTitleFromUserMessage } from '../../actions';

export const maxDuration = 60;

type AllowedTools =
  | 'createDocument'
  | 'updateDocument'
  | 'requestSuggestions'
  | 'getWeather';

const blocksTools: AllowedTools[] = [
  'createDocument',
  'updateDocument',
  'requestSuggestions',
];

const weatherTools: AllowedTools[] = ['getWeather'];

const allTools: AllowedTools[] = [...blocksTools, ...weatherTools];

export async function POST(request: Request) {
  const {
    id,
    messages,
    modelId,
  }: { id: string; messages: Array<Message>; modelId: string } =
    await request.json();

  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return new Response('Unauthorized', { status: 401 });
  }

  const model = models.find((model) => model.id === modelId);

  if (!model) {
    return new Response('Model not found', { status: 404 });
  }

  const coreMessages = convertToCoreMessages(messages);
  const userMessage = getMostRecentUserMessage(coreMessages);

  if (!userMessage) {
    return new Response('No user message found', { status: 400 });
  }

  //For R1
  let providerMark;
  if ('deepseek-R1' === model.apiIdentifier) {
    const randomValue = Math.random();
    if (randomValue < 0.05) {
      providerMark = 'nvidia';
    } else if (randomValue < 0.25) {
      providerMark = 'deepseek';
    } else if (randomValue < 0.30) { // together probability changed to 5%
      providerMark = 'together';
    } else if (randomValue < 0.85) {
      providerMark = 'openrouter_standard';
    } else {
      providerMark = 'openrouter_nitro';
    }
  }

  const streamingData = new StreamData();
  const streamStartTime = Date.now();
  const result = await streamText({
    model: customModel(model.apiIdentifier, providerMark),
    system: systemPrompt,
    messages: coreMessages,
    maxSteps: 5,
    onFinish: async ({ responseMessages }) => {
      if (session.user?.id) {
        try {
          
          const responseMessagesWithoutIncompleteToolCalls =
            sanitizeResponseMessages(responseMessages);


          const chatStartTime = Date.now();
          const chat = await getChatById({ id });
          console.debug(`[DEBUG] Fetching chat by ID took ${Date.now() - chatStartTime}ms`);
        
          if (!chat) {
            const titleStartTime = Date.now();
            const title = await generateTitleFromUserMessage({ message: userMessage });
            console.debug(`[DEBUG] Title generation took ${Date.now() - titleStartTime}ms`);
        
            const saveChatStartTime = Date.now();
            await saveChat({ id, userId: session.user.id, title });
            console.debug(`[DEBUG] Saving new chat took ${Date.now() - saveChatStartTime}ms`);
          }
        
          const saveMessagesStartTime = Date.now();
          await saveMessages({
            messages: [
              { ...userMessage, id: generateUUID(), createdAt: new Date(), chatId: id },
            ],
          });
          console.debug(`[DEBUG] Saving user message took ${Date.now() - saveMessagesStartTime}ms`);
          
          console.debug(`[DEBUG] ${model.apiIdentifier} Streaming response took ${Date.now() - streamStartTime}ms`);  
          const saveResponseMessagesStartTime = Date.now();
          await saveMessages({
            messages: responseMessagesWithoutIncompleteToolCalls.map(
              (message) => {
                const messageId = generateUUID();

                if (message.role === 'assistant') {
                  streamingData.appendMessageAnnotation({
                    messageIdFromServer: messageId,
                  });
                }

                return {
                  id: messageId,
                  chatId: id,
                  role: message.role,
                  content: message.content,
                  createdAt: new Date(),
                };
              },
            ),
          });
          console.debug(`[DEBUG] Saving assistant response messages took ${Date.now() - saveResponseMessagesStartTime}ms`);
        } catch (error) {
          console.error('Failed to save chat', error);
        }
      }

      streamingData.close();
    },
    experimental_telemetry: {
      isEnabled: false,
      functionId: 'stream-text',
    },
  });

  return result.toDataStreamResponse({
    data: streamingData,
  });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return new Response('Not Found', { status: 404 });
  }

  const session = await auth();

  if (!session || !session.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const chat = await getChatById({ id });

    if (chat.userId !== session.user.id) {
      return new Response('Unauthorized', { status: 401 });
    }

    await deleteChatById({ id });

    return new Response('Chat deleted', { status: 200 });
  } catch (error) {
    return new Response('An error occurred while processing your request', {
      status: 500,
    });
  }
}
