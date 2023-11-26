// src/domains/chat/src/_templates/Conversation.tsx
// here we are importing the UserInput and Dialog components from the _molecules folder
import React from 'react';
import { UserInput } from '../_molecules/UserInput';
import { Dialog } from '../_molecules/Dialog';
import { useUserInteractionStore } from '/Users/dgarciabtte/Documents/PcVILIV_Local/DEV/Fork_CUI_heinz-95729-project/src/domains/chat/src/state/user-interaction-store';


export function Conversation() {
  const { conversation, addUserMessage } = useUserInteractionStore();

  return (
    <div>
      <Dialog conversation={conversation} />
      <UserInput onSubmit={addUserMessage} />
    </div>
  );
}
