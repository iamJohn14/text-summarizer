import React from "react";
import { CgSpinner } from "react-icons/cg";

interface SpinnerProps {
  size?: string;
  color?: string;
}

const Spinner: React.FC<SpinnerProps> = ({
  size = "text-xl",
  color = "text-gray-500",
}) => {
  return <CgSpinner className={`animate-spin ${size} ${color}`} />;
};

export default Spinner;
