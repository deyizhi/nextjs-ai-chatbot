import {
  type Message,
  createDataStreamResponse,
  smoothStream,
  streamText,
} from 'ai';

import { auth } from '@/app/(auth)/auth';
import { myProvider, isReasoningModel } from '@/lib/ai/models';
import { systemPrompt } from '@/lib/ai/prompts';
import {
  deleteChatById,
  getChatById,
  saveChat,
  saveMessages,
} from '@/lib/db/queries';
import {
  generateUUID,
  getMostRecentUserMessage,
  sanitizeResponseMessages,
} from '@/lib/utils';

import { generateTitleFromUserMessage } from '../../actions';
import { createDocument } from '@/lib/ai/tools/create-document';
import { updateDocument } from '@/lib/ai/tools/update-document';
import { requestSuggestions } from '@/lib/ai/tools/request-suggestions';
import { getWeather } from '@/lib/ai/tools/get-weather';

export const maxDuration = 60;


export async function POST(request: Request) {
  const {
    id,
    messages,
    selectedChatModel,
  }: { id: string; messages: Array<Message>; selectedChatModel: string } =
    await request.json();

  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return new Response('Unauthorized', { status: 401 });
  }

  const streamStartTimeMs = Date.now();
  const streamStartTimeShow = new Date();
  return createDataStreamResponse({
    execute: (dataStream) => {
      const result = streamText({
        model: myProvider.languageModel(selectedChatModel),
        system: ('o1-mini' === selectedChatModel) ? undefined : systemPrompt({ selectedChatModel }),
        messages,
        maxSteps: 5,
       // experimental_activeTools:  isReasoningModel(selectedChatModel) ? []
       //     : [
       //         'getWeather',
       //         'createDocument',
       //         'updateDocument',
       //         'requestSuggestions',
       //       ],
       // experimental_transform: smoothStream({ chunking: 'word' }),
        experimental_generateMessageId: generateUUID,
       // tools: {
       //   getWeather,
       //   createDocument: createDocument({ session, dataStream }),
       //   updateDocument: updateDocument({ session, dataStream }),
       //   requestSuggestions: requestSuggestions({
       //     session,
        //    dataStream,
       //   }),
       // },
        onFinish: async ({ response, reasoning }) => {

          if (session.user?.id) {
            
            const finishStartTime = new Date();
            const streamStartToFinishDelay = Date.now() - streamStartTimeMs;
            const userMessage = getMostRecentUserMessage(messages);
            if (!userMessage) {
              console.error('No user message found,', {timestamp: new Date().toISOString(), user: session.user?.id});
              return;
            }
            const userMessageLength = userMessage?.content?.length || 0;
            
            const responseMessagesLength = response.messages.reduce((total, message) => {
              const textContent = Array.isArray(message.content) 
                ? message.content.map(part => part.type === 'text' ? part.text : '').join('') 
                : message.content;
              return total + textContent.length;
            }, 0);

            try {
              const sanitizedResponseMessages = sanitizeResponseMessages({
                messages: response.messages,
                reasoning,
              });

              const operationsLog = [];
              
              // Save chat operation
              const getChatStart = Date.now();
              const chat = await getChatById({ id });
              operationsLog.push({
                operation: 'getChatById',
                start: new Date(getChatStart).toISOString(),
                delayMs: Date.now() - getChatStart,
                status: 'success'
              });

              if (!chat) {
                const generateTitleStart = Date.now();
                const title = await generateTitleFromUserMessage({ message: userMessage });
                operationsLog.push({
                  operation: 'generateTitle',
                  start: new Date(generateTitleStart).toISOString(),
                  delayMs: Date.now() - generateTitleStart,
                  status: 'success'
                });

                const saveChatStart = Date.now();
                await saveChat({ id, userId: session.user.id, title });
                operationsLog.push({
                  operation: 'saveChat',
                  start: new Date(saveChatStart).toISOString(),
                  delayMs: Date.now() - saveChatStart,
                  status: 'success'
                });
              }

              // Save user message
              const saveUserMsgStart = Date.now();
              await saveMessages({
                messages: [{ ...userMessage, createdAt: new Date(), chatId: id }],
              });
              operationsLog.push({
                operation: 'saveUserMessage',
                start: new Date(saveUserMsgStart).toISOString(),
                delayMs: Date.now() - saveUserMsgStart,
                status: 'success'
              });

              // Save response messages
              const saveRespMsgStart = Date.now();
              await saveMessages({
                messages: sanitizedResponseMessages.map((message) => ({
                  id: message.id,
                  chatId: id,
                  role: message.role,
                  content: message.content,
                  createdAt: new Date(),
                })),
              });
              operationsLog.push({
                operation: 'saveResponseMessages',
                start: new Date(saveRespMsgStart).toISOString(),
                delayMs: Date.now() - saveRespMsgStart,
                status: 'success'
              });

              // Log all database operations
              const logData = {
                user: session?.user?.id,
                timestamp: new Date().toISOString(),
                streamStartTime: streamStartTimeShow.toISOString(),
                finishStartTime: finishStartTime.toISOString(),
                stream_delay: streamStartToFinishDelay,
                selectedChatModel,
                userMessageLength,
                responseMessagesLength,
                operations: operationsLog
              };
              console.log('[INFO] operations log:', JSON.stringify(logData));

            } catch (error) {
              const userMessage = getMostRecentUserMessage(messages);
              const userMessageLength = userMessage?.content?.length || 0;
              console.error('[ERROR] Failed to save chat, error:"', error, '",',{
                user: session?.user?.id,
                timestamp: new Date().toISOString(),
                streamStartTime: streamStartTimeShow.toISOString(),
                finishStartTime: finishStartTime.toISOString(),
                stream_delay: streamStartToFinishDelay,
                selectedChatModel,
                userMessageLength,
                responseMessagesLength,
              });
            }
          }
        },
        experimental_telemetry: {
          isEnabled: false,
          functionId: 'stream-text',
        },
      });

      result.mergeIntoDataStream(dataStream, {
        sendReasoning: true,
      });
    },
    onError: (error) => {
      const userMessage = getMostRecentUserMessage(messages);
      const userMessageLength = userMessage?.content?.length || 0;
      
      console.error('[ERROR] Chat processing failed, ', error, {
        user: session?.user?.id,
        timestamp: new Date().toISOString(),
        streamStartTime: streamStartTimeShow.toISOString(),
        delay: Date.now() - streamStartTimeMs,
        selectedChatModel,
        userMessageLength,
        error: error instanceof Error ? error.message : error
      });
      return `Chat processing failed, an error occurred: ${error instanceof Error ? error.message : String(error)}`;
    },
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
