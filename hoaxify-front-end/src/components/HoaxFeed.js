import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { getHoaxes, getNewHoaxes, getNewHoaxesCount, getOldHoaxes } from "../api/apiCalls";
import { useApiProgress } from "../shared/ApiProgress";
import HoaxView from "./HoaxView";
import Spinner from "./Spinner";
function HoaxFeed() {
  const [hoaxPage, setHoaxPage] = useState({
    content: [],
    last: true,
    number: 0,
  });
  const [newHoaxCount, setNewHoaxCount] = useState(0);
  const { username } = useParams();
  let lastHoaxId = 0;
  let firstHoaxId = 0;
  if (hoaxPage.content.length > 0) {
    firstHoaxId = hoaxPage.content[0].id;
    const lastHoaxIndex = hoaxPage.content.length - 1;
    lastHoaxId = hoaxPage.content[lastHoaxIndex].id;
  }
  const oldHoaxesPath = username
    ? `/api/1.0/hoaxes/${lastHoaxId}`
    : `/api/1.0/hoaxes/${lastHoaxId}`;

  const loadOldHoaxesProgress = useApiProgress("get", oldHoaxesPath, true);
  const path = username
    ? `/api/1.0/users/${username}/hoaxes?page=`
    : `/api/1.0/hoaxes?page=`;

  const newPath = username ? `/api/1.0/users/${username}/hoaxes/${firstHoaxId}/?direction=after`:`/api/1.0/hoaxes/${firstHoaxId}/?direction=after`

  const initialHoaxLoadProgress = useApiProgress("get", path);
  const loadNewHoaxesProgress = useApiProgress("get", newPath, true);

  useEffect(() => {
    const getCount = async () => {
      const response = await getNewHoaxesCount(firstHoaxId,username);
      setNewHoaxCount(response.data.count);
    };
    let looper =setInterval(() => {
      getCount();
    }, 10000);

    return ()=>{
      clearInterval(looper);
    }
  },[firstHoaxId,username]);

  useEffect(() => {
    const loadHoaxes = async (page) => {
      try {
        const response = await getHoaxes(username, page);
        setHoaxPage((previousHaox) => ({
          ...response.data,
          content: [...previousHaox.content, ...response.data.content],
        }));
      } catch (error) {}
    };
    loadHoaxes();
  }, [username]);
  const loadNewHoaxes = async () => {
    const response = await getNewHoaxes(firstHoaxId,username);
    setHoaxPage((previousHaox) => ({
      ...previousHaox,
      content: [...response.data,...previousHaox.content],
    }));
    setNewHoaxCount(0)

  }
  const loadOldHoaxes = async () => {
    const response = await getOldHoaxes(lastHoaxId,username);
    setHoaxPage((previousHaox) => ({
      ...response.data,
      content: [...previousHaox.content, ...response.data.content],
    }));
  };

  const onDeleteHoaxSuccess = id=>{
    setHoaxPage(previousHaoxPage =>({
      ...previousHaoxPage,
      content: previousHaoxPage.content.filter((hoax)=>{
        if(hoax.id !== id){
          return true;
        }
        return false;
      })
    }))
  }
  const { content, last } = hoaxPage;
  const { t } = useTranslation();
  if (content.length === 0) {
    return (
      <div className="alert alert-secondary">
        {initialHoaxLoadProgress ? <Spinner /> : t("There are no Hoaxes")}
      </div>
    );
  }
  return (
    <div>
      {newHoaxCount > 0 && 
        <div
        style={{ cursor: loadOldHoaxesProgress ? "not-allowed" : "pointer" }}
        onClick={
          loadNewHoaxesProgress
            ? () => {}
            : () => {
                loadNewHoaxes();
              }
        }
        className="alert alert-secondary mb-1">
        {loadNewHoaxesProgress? <Spinner /> :t("There are new Hoaxes")}
      </div>
      }
      {content.map((hoax) => {
        return <HoaxView onDeleteHoax={onDeleteHoaxSuccess} key={hoax.id} hoax={hoax} />;
      })}
      {!last && (
        <div
          style={{ cursor: loadOldHoaxesProgress ? "not-allowed" : "pointer" }}
          onClick={
            loadOldHoaxesProgress
              ? () => {}
              : () => {
                  loadOldHoaxes();
                }
          }
          className="alert alert-secondary"
        >
          {loadOldHoaxesProgress ? <Spinner /> : t("Load Old Hoaxes")}
        </div>
      )}
    </div>
  );
}

export default HoaxFeed;
