export type WhiteboardActionType =
  | 'clear'
  | 'title'
  | 'text'
  | 'box'
  | 'circle'
  | 'arrow'
  | 'line'
  | 'array'
  | 'equation'
  | 'badge'
  | 'icon'
  | 'highlight';

export interface ArrayPointer {
  index: number;
  label: string;
  color?: string;
  position?: 'top' | 'bottom';
}

export interface WhiteboardAction {
  id?: string;
  type: WhiteboardActionType;
  /** Seconds from the start of the scene when this action appears */
  timeOffset: number;
  /** Duration of draw / fade animation in seconds */
  animDuration?: number;
  
  // Coordinates & Dimensions
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  radius?: number;
  fromX?: number;
  fromY?: number;
  toX?: number;
  toY?: number;

  // Text & Labels
  text?: string;
  label?: string;
  subtext?: string;
  fontSize?: number;
  bold?: boolean;

  // Styling
  color?: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  bgColor?: string;
  textColor?: string;
  dashed?: boolean;

  // Array / Data structure specific
  arrayValues?: (string | number)[];
  activeIndices?: number[];
  pointers?: ArrayPointer[];

  // Icon / Status
  iconType?: 'check' | 'cross' | 'bulb' | 'sparkle' | 'question' | 'pointer' | 'sun';
}

export interface LessonScene {
  id: number;
  title: string;
  narration: string;
  /** Estimated duration in seconds */
  duration: number;
  actions: WhiteboardAction[];
  keyConcept?: string;
}

export interface Lesson {
  id: string;
  topic: string;
  title: string;
  overview: string;
  totalDuration: number;
  scenes: LessonScene[];
  suggestedQuestions: string[];
  createdAt?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'tutor';
  text: string;
  timestamp: string;
  sceneRef?: number;
}
