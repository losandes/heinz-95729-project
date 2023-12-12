import type { Sender } from './Sender';

export type Message= Readonly<{
  sender: Sender;
  text: String;
}>
