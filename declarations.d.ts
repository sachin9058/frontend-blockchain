import { CSSProperties } from "react";

declare module '@/fonts/calsans' {
  const font: {
    className: string;
    variable: string;
    style?: CSSProperties;
  };
  export default font;
}
