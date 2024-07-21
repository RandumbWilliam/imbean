import Google from "./google";

export interface IconProps {
  className?: string;
}

export const Icons = {
  google: (props: IconProps) => <Google className={props?.className} />,
};
