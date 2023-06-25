export type EventType = 'click' | 'input';
export interface StepItem {
  type: EventType;
  folderName?: string;
  targetSelector?: any;
  variable?: any;
}
