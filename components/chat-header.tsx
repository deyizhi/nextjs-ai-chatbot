'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useWindowSize } from 'usehooks-ts';

import { ModelSelector } from '@/components/model-selector';
import { SidebarToggle } from '@/components/sidebar-toggle';
import { Button } from '@/components/ui/button';
import { PlusIcon, VercelIcon } from './icons';
import { useSidebar } from './ui/sidebar';
import { memo } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { VisibilityType, VisibilitySelector } from './visibility-selector';
import { updateChatVisibility } from '@/app/(chat)/actions';

function PureChatHeader({
  chatId,
  selectedModelId,
  selectedVisibilityType,
  isReadonly,
}: {
  chatId: string;
  selectedModelId: string;
  selectedVisibilityType: VisibilityType;
  isReadonly: boolean;
}) {
  const router = useRouter();
  const { open } = useSidebar();
  const { width: windowWidth } = useWindowSize();
  const handleShareClick = async () => {
    if (chatId && chatId !== '') {
      // Update visibility to public when sharing
      await updateChatVisibility({
        chatId: chatId,
        visibility: 'public',
      });
      // Copy current link to clipboard
      await navigator.clipboard.writeText(window.location.href);
      
      // Create a notification element
      const notification = document.createElement('div');
      notification.innerText = 'Shared and copied to clipboard';
      notification.className = 'notification'; // Add a class for styling
      notification.style.position = 'fixed';
      notification.style.top = '20px'; // Changed to top for upper right corner
      notification.style.right = '20px';
      notification.style.backgroundColor = '#333';
      notification.style.color = '#fff';
      notification.style.padding = '10px';
      notification.style.borderRadius = '5px';
      notification.style.zIndex = '1000';
      document.body.appendChild(notification);
      
      // Remove the notification after 3 seconds
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 1000);
    }
  };

  return (
    <header className="flex sticky top-0 bg-background py-1.5 items-center px-2 md:px-2 gap-2">
      <SidebarToggle />

      {(!open || windowWidth < 768) && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              className="order-2 md:order-1 md:px-2 px-2 md:h-fit ml-auto md:ml-0"
              onClick={() => {
                router.push('/');
                router.refresh();
              }}
            >
              <PlusIcon />
              <span className="md:sr-only">New Chat</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>New Chat</TooltipContent>
        </Tooltip>
      )}

      {!isReadonly && (
        <ModelSelector
          selectedModelId={selectedModelId}
          className="order-1 md:order-2"
        />
      )}

      {!isReadonly && chatId && (
        <Button
          className="bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-zinc-50 dark:text-zinc-900 hidden md:flex py-1.5 px-2 h-fit md:h-[34px] order-3 md:ml-auto"
          onClick={handleShareClick}
        >
          Share
        </Button>
      )}

    </header>
  );
}

export const ChatHeader = memo(PureChatHeader, (prevProps, nextProps) => {
  return prevProps.selectedModelId === nextProps.selectedModelId;
});
