import React, { useState } from "react";

import { FaCrown } from "react-icons/fa";
import { BsTrash } from "react-icons/bs";
import "./styles.css";

import ModalConfirmAction from "../ModalConfirmAction";

export default function CardDailyLog({
  leader = false,
  didYesterday = "",
  doToday = "",
  problems = "",
  name = "",
  deleteDailyLog,
  isMyDaily = false,
}) {
  const [modalConfirmAction, setModalConfirmAction] = useState(false);

  const handleConfirmAction = () => {
    deleteDailyLog();
    setModalConfirmAction(false);
  };

  return (
    <>
      {modalConfirmAction && (
        <ModalConfirmAction
          handleConfirmAction={handleConfirmAction}
          handleCloseModalConfirmAction={() => setModalConfirmAction(false)}
        />
      )}
      <div className="cardDailyLog-container">
        <div className="dailyLog-header">
          <div className="userAvatar avatarLog"></div>
          <p> {name} </p>
          {leader && (
            <span className="LeaderCrown">
              <FaCrown size={20} color={"#B2B2B2"} />
            </span>
          )}
        </div>

        <div className="dailyLog-body">
          <div className="answer-container">
            <div className="answer-blocks">
              <span> • O que você fez ontem? </span>
              {didYesterday.trim().length > 1 ? (
                <p> {didYesterday} </p>
              ) : (
                <span className="default-daily-text">Registro não realizado.</span>
              )}
            </div>

            <div className="answer-blocks">
              <span> • O que você irá fazer hoje? </span>
              {doToday.trim().length > 1 ? (
                <p> {doToday} </p>
              ) : (
                <span className="default-daily-text">Registro não realizado.</span>
              )}
            </div>

            <div className="answer-blocks">
              <span> • Existe/existiu algum impedimento no seu caminho? </span>
              {problems.trim().length > 1 ? (
                <p> {problems} </p>
              ) : (
                <span className="default-daily-text">Registro não realizado.</span>
              )}
            </div>
          </div>
          {isMyDaily && (
            <div
              onClick={() => setModalConfirmAction(true)}
              className="dailylog-trash-button"
            >
              <BsTrash size={25} color={"#BBB"} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
