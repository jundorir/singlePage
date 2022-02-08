import React from "react";
import css from "./index.module.less";
import classNames from "classnames";

export default function Button(props) {
  const {
    onClick,
    children,
    className,
    size,
    disabled = false,
    ...reset
  } = props;
  return (
    <button
      disabled={disabled}
      className={classNames(css.button, className, {
        [css.small]: size === "small",
        [css.middle]: size === "middle",
      })}
      onClick={onClick}
      {...reset}
    >
      {props.children}
    </button>
  );
}

Button.defaultProps = {
  onClick: () => {},
};
