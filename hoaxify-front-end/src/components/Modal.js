import React from "react";
import { useTranslation } from "react-i18next";
import ButtonWithProgress from "../components/ButtonWithProgress";
function Modal(props) {
  const {okButton,title, visible, setModalVisible, message, onClickOk, pendingApiCall } =
    props;
  const { t } = useTranslation();
  let className = "modal fade";
  if (visible) {
    className += " show d-block";
  }
  return (
    <div className={className} style={{ backgroundColor: "#000000b0" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
          </div>
          <div className="modal-body">{message}</div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setModalVisible(false);
              }}
              disabled={pendingApiCall}
            >
              {t("Cancel")}
            </button>
            <ButtonWithProgress
              disabled={pendingApiCall}
              pendingApiCall={pendingApiCall}
              text={okButton}
              onClick={onClickOk}
              className="btn btn-danger"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;
