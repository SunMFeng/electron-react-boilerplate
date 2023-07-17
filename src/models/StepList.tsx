export type EventType = 'click' | 'input';
export interface StepItem {
  type: EventType;
  folderName?: string;
  folderNameKey?: string;
  targetSelector?: string;
  targetSelectorKey?: string;
  variable?: any;
  locator?: string;
  screenshot?: string;
}
