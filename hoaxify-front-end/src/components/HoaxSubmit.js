import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { postHoax, postHoaxAttachment } from "../api/apiCalls";
import { useApiProgress } from "../shared/ApiProgress";
import ButtonWithProgress from "./ButtonWithProgress";
import ProfileImageWithDefault from "./ProfileImageWithDefault";
import  Input  from "../components/Input.js";
import AutoUploadImage from "./AutoUploadImage";
function HoaxSubmit() {
  const [hoax, setHoax] = useState("");
  const [focused, setFocused] = useState(false);
  const [errors, setErrors] = useState({});
  const [newImage, setNewImage] = useState()
  const [attechmentId, setAttechmentId] = useState()
  const { image } = useSelector((store) => ({
    image: store.image,
  }));

  useEffect(() => {
    setErrors({});
  }, [hoax]);

  useEffect(() => {
    if (!focused) {
      setHoax("");
      setErrors({});
      setNewImage();
      setAttechmentId();
    }
  }, [focused]);

  const onClickHoaxify = async () => {
    const body = {
      content: hoax,
      attachmentId:attechmentId
    };
    try {
      const response = await postHoax(body);
      setFocused(false);
    } catch (error) {
      if (error.response.data.validationErrors) {
        setErrors(error.response.data.validationErrors);
      }
    }
  };

  const onChangeFile =(event)=>{
    if(event.target.files.length<1){
      return;
    }
    const file = event.target.files[0]
    const fileRead = new FileReader();
    fileRead.onloadend =()=>{
      setNewImage(fileRead.result);
      uploadFile(file)
    }
    fileRead.readAsDataURL(file);

  }
  const uploadFile = async (file)=>{
    const attachemnt = new FormData();
    attachemnt.append('file',file);
    const response = await postHoaxAttachment(attachemnt);
    setAttechmentId(response.data.id);
  }

  const { t } = useTranslation();
  const pendingApiCall = useApiProgress("post", "/api/1.0/hoaxes",true);
  const pendingFileUpload = useApiProgress("post", "/api/1.0/hoax-attachments",true);


  let textAreaClass = "form-control";
  if (errors.content) {
    textAreaClass += " is-invalid";
  }
  return (
    <div className="card p-1 flex-row">
      <ProfileImageWithDefault
        className="rounded-circle me-1"
        width="32px"
        height="32px"
        image={image}
      />
      <div className="flex-fill">
        <textarea
          onChange={(event) => {
            setHoax(event.target.value);
          }}
          value={hoax}
          className={textAreaClass}
          onFocus={() => {
            setFocused(true);
          }}
          rows={focused ? "3" : "1"}
        ></textarea>
        <div className="invalid-feedback">{errors.content}</div>
        {focused && (
          <>
          <br/>
          {!newImage && <Input type="file" onChange={onChangeFile}/>}
          {newImage && <AutoUploadImage uploading={pendingFileUpload} newImage={newImage}/>}
          <div className="text-end mt-1">
            <ButtonWithProgress
              disabled={pendingApiCall || pendingFileUpload}
              pendingApiCall={pendingApiCall}
              onClick={onClickHoaxify}
              text="Hoaxify"
              className="btn btn-primary"
            />

            <button
            disabled={pendingApiCall || pendingFileUpload}
              onClick={() => {
                setFocused(false);
              }}
              className="btn btn-light d-inline-flex ms-1"
            >
              <i className="material-icons">close</i>
              {t("Cancel")}
            </button>
          </div>
          </>
        )}
      </div>
    </div>
  );
}

export default HoaxSubmit;
