import * as React from "react";
import Svg, { type SvgProps, Path } from "react-native-svg";
interface SVGRProps {
  desc?: string;
  descId?: string;
}
export const ArrowLeft = ({ desc, descId, ...props }: SvgProps & SVGRProps) => (
  <Svg width={18} height={16} fill="none" aria-describedby={descId} {...props}>
    {desc ? <desc id={descId}>{desc}</desc> : null}
    <Path
      fill="#0F141A"
      fillRule="evenodd"
      d="M18 8a.75.75 0 0 1-.75.75H2.56l5.47 5.47a.75.75 0 1 1-1.06 1.06L.22 8.53a.75.75 0 0 1 0-1.06L6.97.72a.75.75 0 0 1 1.06 1.06L2.56 7.25h14.69A.75.75 0 0 1 18 8Z"
      clipRule="evenodd"
    />
  </Svg>
);

ArrowLeft.displayName = "ArrowLeft";
