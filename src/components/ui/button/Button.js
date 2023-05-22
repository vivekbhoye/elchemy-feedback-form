import React from "react";

import styles from "./Button.module.css";

const Button = ({ children, icon, style = {}, onClick }) => {
  return (
    <button className={styles.primary} style={style} onClick={onClick}>
      {children} {icon ? <i className={icon}></i> : ``}
    </button>
  );
};

export default Button;
