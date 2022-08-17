import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getUsers } from "../api/apiCalls";
import { useApiProgress } from "../shared/ApiProgress";
import Spinner from "./Spinner";
import UserListItem from "./UserListItem";
const UserList = () => {
  const [page, setPage] = useState({
    content: [],
    size: 3,
    number: 0,
  });

  const [loadFailure, setLoadFailure] = useState(false);
  const pendingApiCall = useApiProgress('get',`/api/1.0/users?page`);

  useEffect(() => {
    loadUsers();
    return () => {
      // console.log("Component End");
    };
  }, []);
  const onClickNext = () => {
    const nextPage = page.number + 1;
    loadUsers(nextPage);
  };

  const onClickPrevious = () => {
    const previousPage = page.number - 1;
    loadUsers(previousPage);
  };

  const loadUsers = async (page) => {
    setLoadFailure(false);
    try {
      const response = await getUsers(page);
      setPage(response.data);
    } catch (error) {
      setLoadFailure(true);
    }
  };
  const { content: users, last, first } = page;
  const { t } = useTranslation();
  let actionDiv = (
    <div>
      {first === false && (
        <button className="btn btn-sm btn-light" onClick={onClickPrevious}>
          {t("Previous")}
        </button>
      )}
      {last === false && (
        <button
          className="btn btn-sm btn-light float-end"
          onClick={onClickNext}
        >
          {t("Next")}
        </button>
      )}
    </div>
  );
  if (pendingApiCall) {
    actionDiv = (
     <Spinner/>
    );
  }

  return (
    <div className="card">
      <h3 className="card-header text-center">{t("Users")}</h3>
      <div className="list-group-flush">
        {users.map((user) => (
          <UserListItem key={user.userName} user={user} />
        ))}
      </div>
      {actionDiv}
      {loadFailure && (
        <div className="text-center text-danger">{t("Load Failure")}</div>
      )}
    </div>
  );
};

export default UserList;