import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { format } from "timeago.js";
import { useApiProgress } from "../shared/ApiProgress";
import { deleteHoax } from "../api/apiCalls";
import Modal from "./Modal";
import ProfileImageWithDefault from "../components/ProfileImageWithDefault";
function HoaxView(props) {
  const loggedInUser = useSelector((store) => store.userName);
  const { hoax, onDeleteHoax } = props;
  const { user, content, timestamp, fileAttachment, id } = hoax;
  const { userName, displayName, image } = user;
  const [modalVisible, setModalVisible] = useState(false);
  const { i18n, t } = useTranslation();
  const formatted = format(timestamp, i18n.language);

  const ownedByLoggedInUser = loggedInUser === userName;

  const onClickDelete = async () => {
    await deleteHoax(id);
    onDeleteHoax(id);
    setModalVisible(false);
  };
  const pendingApiCall = useApiProgress(
    "delete",
    `/api/1.0/hoaxes/${id}`,
    true
  );

  return (
    <>
      <div className="card p-1">
        <div className="d-flex">
          <ProfileImageWithDefault
            image={image}
            width="32"
            height="32"
            className="rounded-circle"
          />
          <div></div>
          <Link className="text-dark" to={`/users/${userName}`}>
            <div className="flex-fill m-auto ps-2 m-1">
              <h6 className="d-inline">
                {displayName}@{userName}
              </h6>
              <span> -</span>
              <span>{formatted}</span>
            </div>
          </Link>
          {ownedByLoggedInUser && (
            <button
              onClick={() => {
                setModalVisible(true);
              }}
              className="btn btn-delete-link btn-sm"
            >
              <i className="material-icons">delete_outline</i>
            </button>
          )}
        </div>

        <div className="ps-5">{content}</div>
        {fileAttachment && (
          <div className="pl-5">
            {fileAttachment.fileType.startsWith("image") && (
              <img
                className="img-fluid"
                src={"images/attachments/" + fileAttachment.name}
                alt={content}
              />
            )}
            {!fileAttachment.fileType.startsWith("image") && (
              <strong>Hoax has unknow attachment</strong>
            )}
          </div>
        )}
      </div>
      <Modal
        title={t("Delete Hoax")}
        okButton={t("Delete Hoax")}
        pendingApiCall={pendingApiCall}
        onClickOk={onClickDelete}
        message={
          <div>
            <div>
              <strong>{t("Are you sure to delete hoax?")}</strong>
              <br />
              <span>{content}</span>
            </div>
          </div>
        }
        setModalVisible={setModalVisible}
        visible={modalVisible}
      />
    </>
  );
}

export default HoaxView;
