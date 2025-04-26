import { CardProps } from "tamagui";

export type CardComponentProps = {
  children: React.ReactNode;
  onPress?: () => void;
  props: CardProps;
};
