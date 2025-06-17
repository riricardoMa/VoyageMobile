import * as React from "react";
import Svg, { type SvgProps, Path } from "react-native-svg";
interface SVGRProps {
  desc?: string;
  descId?: string;
}
export const Close = ({ desc, descId, ...props }: SvgProps & SVGRProps) => (
  <Svg width={16} height={16} fill="none" aria-describedby={descId} {...props}>
    {desc ? <desc id={descId}>{desc}</desc> : null}
    <Path
      fill="#0F141A"
      fillRule="evenodd"
      d="M15.28 14.22a.75.75 0 1 1-1.06 1.06L8 9.06l-6.22 6.22a.75.75 0 1 1-1.06-1.06L6.94 8 .72 1.78A.75.75 0 1 1 1.78.72L8 6.94 14.22.72a.75.75 0 1 1 1.06 1.06L9.06 8l6.22 6.22Z"
      clipRule="evenodd"
    />
  </Svg>
);

Close.displayName = "Close";
