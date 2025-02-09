'use server';

import { type CoreUserMessage, generateText } from 'ai';
import { cookies } from 'next/headers';

import { customModel } from '@/lib/ai';

export async function saveModelId(model: string) {
  const cookieStore = await cookies();
  cookieStore.set('model-id', model);
}
export async function generateTitleFromUserMessage({
  message,
}: {
  message: CoreUserMessage;
}) {
  // Extract the text content from the message
  const textContent = Array.isArray(message.content) 
    ? message.content.map(part => part.type === 'text' ? part.text : '').join('') 
    : message.content;

  const truncatedText = textContent.length > 50 ? textContent.substring(0, 50) : textContent;
  let truncatedMessage: CoreUserMessage = { role: 'user', content: truncatedText };

  const { text: title } = await generateText({
    model: customModel( process.env.TITLE_MODEL || 'mixtral-8x7b-32768' ),
    system: `\n
    - you will generate a short title based on the first message a user begins a conversation with
    - ensure it is not more than 30 characters long
    - the title should be a summary of the user's message
    - do not use quotes or colons
    - the output's language should match the input user prompt's language`,
    prompt: JSON.stringify(truncatedMessage),
  });

  return `${title} ${new Date().toISOString()} ${crypto.randomUUID()}`;
}
