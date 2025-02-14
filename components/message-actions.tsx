import type { Message } from 'ai';
import { toast } from 'sonner';
import { useSWRConfig } from 'swr';
import { useCopyToClipboard } from 'usehooks-ts';

import type { Vote } from '@/lib/db/schema';

import { CopyIcon, ThumbDownIcon, ThumbUpIcon } from './icons';
import { Button } from './ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import { memo, useCallback } from 'react';
import equal from 'fast-deep-equal';

export function PureMessageActions({
  chatId,
  message,
  vote,
  isLoading,
}: {
  chatId: string;
  message: Message;
  vote: Vote | undefined;
  isLoading: boolean;
}) {
  const { mutate } = useSWRConfig();
  const [_, copyToClipboard] = useCopyToClipboard();

  if (isLoading) return null;
  if (message.role === 'user') return null;
  if (message.toolInvocations && message.toolInvocations.length > 0)
    return null;

  const handleVote = useCallback(async (type: 'up' | 'down') => {
    const response = await fetch('/api/vote', {
      method: 'PATCH',
      body: JSON.stringify({
        chatId,
        messageId: message.id,
        type,
      }),
    });

    if (response.ok) {
      mutate<Array<Vote>>(
        `/api/vote?chatId=${chatId}`,
        (currentVotes) => {
          if (!currentVotes) return [];

          const votesWithoutCurrent = currentVotes.filter(
            (vote) => vote.messageId !== message.id,
          );

          return [
            ...votesWithoutCurrent,
            {
              chatId,
              messageId: message.id,
              isUpvoted: type === 'up',
            },
          ];
        },
        { revalidate: false },
      );

      toast.success(`${type === 'up' ? 'Upvoted' : 'Downvoted'} Response!`);
    } else {
      toast.error(`Failed to ${type === 'up' ? 'upvote' : 'downvote'} response.`);
    }
  }, [chatId, message.id, mutate]);

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex flex-row gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="py-1 px-2 h-fit text-muted-foreground"
              variant="outline"
              onClick={async () => {
                await copyToClipboard(message.content as string);
                toast.success('Copied to clipboard!');
              }}
            >
              <CopyIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Copy</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="py-1 px-2 h-fit text-muted-foreground !pointer-events-auto"
              disabled={vote?.isUpvoted}
              variant="outline"
              onClick={() => handleVote('up')}
            >
              <ThumbUpIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Upvote Response</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="py-1 px-2 h-fit text-muted-foreground !pointer-events-auto"
              variant="outline"
              disabled={vote && !vote.isUpvoted}
              onClick={() => handleVote('down')}
            >
              <ThumbDownIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Downvote Response</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}

export const MessageActions = memo(
  PureMessageActions,
  (prevProps, nextProps) => {
    if (!equal(prevProps.vote, nextProps.vote)) return false;
    if (prevProps.isLoading !== nextProps.isLoading) return false;

    return true;
  },
);
