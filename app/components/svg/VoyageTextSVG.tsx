import * as React from "react";
import Svg, { type SvgProps, Path } from "react-native-svg";

const VoyageTextSVG = (props: SvgProps) => (
  <Svg width={200} height={60} {...props}>
    <Path fill="#063855" fillRule="evenodd" d="M0 0h48v1H0z" />
  </Svg>
);
export default VoyageTextSVG;
