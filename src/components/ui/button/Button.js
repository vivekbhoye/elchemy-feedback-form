import React from "react";

import styles from "./Button.module.css";

const Button = ({ children, icon, style = {} }) => {
  return (
    <button className={styles.primary} style={style}>
      {children} {icon ? <i className={icon}></i> : ``}
    </button>
  );
};

export default Button;
