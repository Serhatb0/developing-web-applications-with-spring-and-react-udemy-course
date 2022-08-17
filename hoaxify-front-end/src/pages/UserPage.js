import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { getUser } from "../api/apiCalls";
import ProfileCard from "../components/ProfileCard";
import Spinner from "../components/Spinner";
import { useApiProgress } from "../shared/ApiProgress";
import HoaxFeed from "../components/HoaxFeed";
export default function UserPage(props) {
  const [user, setUser] = useState({});
  const [notFound, setNotFound] = useState(false);
  let routeParams = useParams();
  const pendingApiCall = useApiProgress(
    'get', "/api/1.0/users/" + routeParams.username,true
  );
  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await getUser(routeParams.username);
        setUser(response.data);
        setNotFound(false);
      } catch (error) {
        setNotFound(true);
      }
    };
    loadUser();
  }, [routeParams.username]);

  const { t } = useTranslation();
  if (notFound) {
    return (
      <div className="container">
        <div className="alert alert-danger text-center">
          <div>
            <i className="material-icons" style={{ fontSize: "48px" }}>
              error
            </i>
          </div>
          {t("User Not Found")}
        </div>
      </div>
    );
  }
 
  if (pendingApiCall || user.userName !== routeParams.username) {
    return <Spinner />;
  }

  

  return (
    <div className="container">
      <div className="row">
    <div className="col">
    <ProfileCard user={user}></ProfileCard>

    </div>
    <div className="col">
      <HoaxFeed/>
    </div>

      </div>
    </div>
  );
}
