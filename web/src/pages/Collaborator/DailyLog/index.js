import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import "./styles.css";

import Header from "../../../components/Header";
import MenuLateral from "../../../components/MenuLateral";
import Container from "../../../components/Container";
import ButtonChangeScreen from "../../../components/ButtonChangeScreen";
import CardDailyLog from "../../../components/CardDailyLog";
import ModalCriarDaily from "../../../components/ModalCriarDaily";
import Loading from "../../../components/Loading";

import { MdArrowBack } from "react-icons/md";
import { FaPlus } from "react-icons/fa";

import { getLocalStorage, setLocalStorage } from "../../../utils/localStorage";

import isLeader from "../../../utils/isLeader";

import api from "../../../services/api";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import "moment/locale/pt-br";
import { v4 as uuid } from "uuid";

export default function DailyLog() {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dailyCount, setDailyCount] = useState(0);
  const [leaderContent, setLeaderContent] = useState({});
  const [collaboratorContent, setCollaboratorContent] = useState([]);
  const [registeredDaily, setRegisteredDaily] = useState(false);

  const user = getLocalStorage("@Scrunner:user");
  const history = useHistory();
  const {
    teamId,
    teamName,
    boardId,
    boardDate,
    users,
  } = history.location.state;

  useEffect(() => {
    const token = getLocalStorage("@Scrunner:token");

    const fetchContent = async () => {
      const response = await api.get(
        `/dailys/boards/contents/${teamId}/${boardId}/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const [leaderContent] = response.data.dailyContents.filter(
        (daily) => daily.user.is_leader
      );

      const collaboratorContent = response.data.dailyContents.filter(
        (daily) => !daily.user.is_leader
      );

      const registeredDaily = response.data.dailyContents.find(
        (daily) => daily.user.id === user.id
      );

      setLeaderContent(leaderContent);
      setRegisteredDaily(!!registeredDaily);
      setCollaboratorContent(collaboratorContent);
      setDailyCount(response.data.dailyContents.length);
      setLocalStorage("@Scrunner:token", response.data.token);
      setLoading(false);
    };

    fetchContent();
  }, [users, boardId, teamId, user.id]);

  const toTeamDailysPage = () => {
    history.push(`/times/daily/${teamName}`, { teamId, teamName, users });
  };

  const createDailyContent = async ({ did_yesterday, do_today, problems }) => {
    const token = getLocalStorage("@Scrunner:token");
    setLoading(true);
    try {
      const response = await api.post(
        `/dailys/boards/contents/${teamId}/${boardId}/${user.id}`,
        { did_yesterday, do_today, problems },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newContent = {
        ...response.data.content,
        user: {
          name: user.name,
        },
      };

      const isLeader = users.find(
        (colab) => colab.id === user.id && colab.is_leader
      );

      !isLeader
        ? setCollaboratorContent([...collaboratorContent, newContent])
        : setLeaderContent(newContent);

      setLocalStorage("@Scrunner:token", response.data.token);
      setDailyCount(dailyCount + 1);
      setRegisteredDaily(true);

      toast.success("Daily criada com sucesso.");
    } catch (error) {
      toast.error("Ocorreu um erro ao criar a daily.");
    }
    setLoading(false);
  };

  const deleteDailyLog = async (contentId, isLeader) => {
    const token = getLocalStorage("@Scrunner:token");
    try {
      await api.delete(
        `/dailys/boards/contents/${teamId}/${boardId}/${contentId}/${user.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (isLeader) {
        setLeaderContent({});
      } else {
        const newContents = collaboratorContent.filter(
          (content) => content.id !== contentId
        );

        setCollaboratorContent(newContents);
      }

      setRegisteredDaily(false);
      setDailyCount(dailyCount - 1);

      toast.info(" Daily excluída com sucesso.");
    } catch (error) {
      toast.error("Ocorreu um erro inesperado.");
    }
  };

  return (
    <div className="dailyLog">
      {showModal && (
        <ModalCriarDaily
          handleModalCreateDaily={() => setShowModal(false)}
          createDailyContent={createDailyContent}
        />
      )}
      <Header />
      <MenuLateral homeActive={false} />
      {loading ? (
        <Loading />
      ) : (
        <Container>
          <div className="infos-daily">
            <div className="header-times-daily">
              <div className="header-titles">
                <h2>Dailys</h2>
                <span onClick={toTeamDailysPage}>{teamName}</span>
              </div>
              <div className="header-buttons">
                <ButtonChangeScreen
                  titleButton={"Dailys"}
                  to={`/times/daily/${teamName}`}
                  active
                />
                <ButtonChangeScreen
                  titleButton={"Tarefas"}
                  to={`/times/tarefa/${teamName}`}
                />
              </div>
            </div>
            <div className="divider" />

            <div className="dailyLogInfo-container">
              <div onClick={toTeamDailysPage} className="backBtn">
                <MdArrowBack size={30} color={"#737FF3"} /> Voltar
              </div>

              <div className="dailyLogInfo">
                <h2>{moment(boardDate).format("DD/MM/YYYY")}</h2>
                <h4>{dailyCount} registros foram realizados</h4>
              </div>
            </div>
          </div>

          <div className="dailyLog-content">
            <div className="dailyLog-leadText">
              {!registeredDaily && isLeader(users) && (
                <button
                  onClick={() => setShowModal(true)}
                  className="buttonAddDaily"
                >
                  <FaPlus size={20} color={"#B2B2B2"} />
                  <span> Adicionar registro daily </span>
                </button>
              )}

              {leaderContent?.user && (
                <CardDailyLog
                  leader={true}
                  didYesterday={leaderContent.did_yesterday}
                  doToday={leaderContent.do_today}
                  problems={leaderContent.problems}
                  name={leaderContent.user.name}
                  deleteDailyLog={() => deleteDailyLog(leaderContent.id, true)}
                  isMyDaily={leaderContent.user_id === user.id}
                />
              )}
            </div>

            <div className="dailyLog-colabText">
              {!registeredDaily && !isLeader(users) && (
                <button
                  onClick={() => setShowModal(true)}
                  className="buttonAddDaily"
                >
                  <FaPlus size={20} color={"#B2B2B2"} />
                  <span> Adicionar registro daily </span>
                </button>
              )}
              {collaboratorContent.map((content) => (
                <CardDailyLog
                  key={uuid()}
                  didYesterday={content.did_yesterday}
                  doToday={content.do_today}
                  problems={content.problems}
                  name={content.user.name}
                  deleteDailyLog={() => deleteDailyLog(content.id, false)}
                  isMyDaily={content.user_id === user.id}
                />
              ))}
            </div>
          </div>
          <ToastContainer />
        </Container>
      )}
    </div>
  );
}
