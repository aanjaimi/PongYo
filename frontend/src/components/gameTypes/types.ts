import type  { User } from '../../types/user';
export type RadioButtonProps = {
  value: string;
  label: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};
export type PopUpProps = {
  setIsPopupOpen: (value: boolean) => void;
  selectedOption: string;
};

export type GameCardProps = {
  setGameStarted: (value: boolean) => void;
	setOppData : (value: User) => void;
};

export type CustomModalProps = {
  onClose: () => void;
};

export type GameCanvasProps = {
  setIsGameOver: (value: boolean) => void;
  setMyScore: (value: number) => void;
  setOppScore: (value: number) => void;
};
export type itemPosition = {
  x: number;
  y: number;
};
export type GameProps = {
  oppData:User
};
