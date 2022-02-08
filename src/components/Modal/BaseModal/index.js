/**
 * 基础弹窗
 */
import css from "./index.module.less";

const WithBaseModal = (WrappedComponent) => {
  return function BaseModal(props) {
    return (
      <div
        className={css.baseModalBG}
        onClick={() => {
          props.closeModal();
        }}
      >
        <div
          className={css.baseModalBox}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <WrappedComponent {...props} />
        </div>
      </div>
    );
  };
};
export default WithBaseModal;
