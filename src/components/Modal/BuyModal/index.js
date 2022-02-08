/**
 * 购买按钮
 *
 */
import css from "./index.module.less";
import BaseModal from "../BaseModal";
import { Fragment } from "react";
import Button from "@components/Button";
import classNames from "classnames";

function ConfirmModal(
  props = {
    title: "",
    content: "",
    onInpower: () => {},
    noInpower: false,
    impower: "",
    onConfirm: () => {},
    comfimdisabled: false,
    confirmText: "",
  }
) {
  function handle(item) {
    if (item === "cancel") {
      props.closeModal();
    } else if (item === "confim") {
      console.log("确定");
    }
  }
  return (
    <Fragment>
      <div className={css.cloak}></div>
      <div className={css.contain}>
        <div className={css.title}>{props.title}</div>
        <div className={css.modal_up}></div>
        <div className={css.content}>{props.content}</div>
        <div className={css.modal_down}></div>
        <div className={css.button}>
          <Button
            onClick={props.onInpower}
            size={props.size || ""}
            className={classNames(css.impower, props.noInpower && css.noNeed)}
            disabled={props.impowerdisabled}
          >
            {props.impower}
          </Button>
          <Button
            onClick={props.onConfirm}
            size={props.size || ""}
            disabled={props.comfimdisabled}
            className={css.comfim}
          >
            {props.confirmText}
          </Button>
        </div>
      </div>
    </Fragment>
  );
}

export default BaseModal(ConfirmModal);
