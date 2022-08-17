import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { deleteUser, updateUsers } from "../api/apiCalls";
import Input from "../components/Input";
import { useApiProgress } from "../shared/ApiProgress";
import ButtonWithProgress from "../components/ButtonWithProgress";
import ProfileImageWithDefault from "./ProfileImageWithDefault";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutSuccess, updateSuccess } from "../redux/authActions";
import Modal from "./Modal";
import { useHistory } from "react-router-dom";
function ProfileCard(props) {
  // const { user } = props;
  const [user, setUser] = useState({});
  const [inEditMode, setInEditMode] = useState(false);
  const [updatedDisplayName, setUpdatedDisplayName] = useState();
  const [editable, setEditable] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [newImage, setNewImage] = useState()
  const [modalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch();
  const { userName, displayName, image } = user;
  const { t } = useTranslation();
  const history = useHistory();
  const { username: loggedInUsername } = useSelector((store) => ({
    username: store.username,
  }));
  const { username } = useParams();
  const pathUsername = username;

  useEffect(() => {
    // delete validationErrors.displayName
    setValidationErrors((previousValidationErrors)=>{
      return {
        ...previousValidationErrors,
        displayName:undefined
      }
    });
  }, [updatedDisplayName])

  
  useEffect(() => {
    setValidationErrors((previousValidationErrors)=>{
      return {
        ...previousValidationErrors,
        image:undefined
      }
    });
  }, [newImage])
  
  const pendingApiCallDeleteUser = useApiProgress('delete',`/api/1.0/users/${loggedInUsername}`,true)
  useEffect(() => {
    setEditable(pathUsername === loggedInUsername);
  }, [pathUsername, loggedInUsername]);

  useEffect(() => {
    setUser(props.user);
  }, [props.user]);

  useEffect(() => {
    if (!inEditMode) {
      setUpdatedDisplayName(undefined);
      setNewImage(undefined)
    }
    setUpdatedDisplayName(displayName);
  }, [inEditMode, displayName]);

  const onClickSave = async () => {
    let image;
    if(newImage){
      image=newImage.split(',')[1]
    }
    const body = {
      displayName: updatedDisplayName,
      image
    };
    try {
      const response = await updateUsers(userName, body);
      setUser(response.data);
      setInEditMode(false);
      dispatch(updateSuccess(response.data))
    } catch (error) {
      setValidationErrors(error.response.data.validationErrors)
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
    }
    fileRead.readAsDataURL(file);

  }
  const onClickDeleteUser = async()=>{
    await deleteUser(loggedInUsername);
    setModalVisible(false);
    dispatch(logoutSuccess());
    history.push('/')
  }

  const pendingApiCall = useApiProgress("put", "/api/1.0/users/" + userName);
  const {displayName: displayNameError,image:imageError} = validationErrors;
  return (
    <div className="card text-center">
      <div className="card-header">
        <ProfileImageWithDefault
          width="200x"
          height="200px"
          className="rounded-circle shadow"
          alt={`${user.userName} profile`}
          image={image}
          tempimage={newImage}
        />
      </div>
      <div className="card-body">
        {!inEditMode && (
          <>
            <h3>
              {displayName}@{userName}
            </h3>
            {editable && (
              <>
              <button
                onClick={() => {
                  setInEditMode(true);
                }}
                className="btn btn-success d-inline-flex"
              >
                <i className="material-icons">edit</i>
                {t("Edit")}
              </button>
              <div className="pt-2">
                <button
                onClick={() => {
                 setModalVisible(true)
                }}
                className="btn btn-danger d-inline-flex"
              >
                <i className="material-icons">directions_run</i>
                {t("Delete My Account")}
              </button></div>
              </>

            )}
          </>
        )}
        {inEditMode && (
          <div>
            <Input
              onChange={(event) => {
                setUpdatedDisplayName(event.target.value);
              }}
              error={displayNameError}
              defaultValue={displayName}
              label={t("Change Display Name")}
            />
            <br/>
            <Input 
            onChange={onChangeFile} 
            error ={imageError}
            type="file"/>
            <div>
              <br />
              <ButtonWithProgress
                pendingApiCall={pendingApiCall}
                onClick={onClickSave}
                className="btn btn-primary d-inline-flex"
                text={
                  <>
                    <i className="material-icons">save</i>
                    {t("Save")}
                  </>
                } 
              ></ButtonWithProgress>
              <button
                disabled={pendingApiCall}
                onClick={() => setInEditMode(false)}
                className="btn btn-light d-inline-flex ms-1"
              >
                <i className="material-icons">close</i>
                {t("Cancel")}
              </button>
            </div>
          </div>
        )}
      </div>
      <Modal
       title={t("Delete My Account")}
       okButton={t("Delete Account")}
        pendingApiCall={pendingApiCallDeleteUser}
        onClickOk={onClickDeleteUser}
        message={t('Are you sure to delete your account?')}
        setModalVisible={setModalVisible}
        visible={modalVisible}
      />
    </div>
  );
}

export default ProfileCard;
