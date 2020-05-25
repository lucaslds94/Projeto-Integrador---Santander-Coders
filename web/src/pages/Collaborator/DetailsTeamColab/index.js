import React, { useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";

import { getLocalStorage, setLocalStorage, clearLocalStorage } from "../../../utils/localStorage";
import isLeader from "../../../utils/isLeader";

import api from "../../../services/api";

import "./styles.css";

import { FaHashtag as Hash } from "react-icons/fa";
import { MdArrowBack } from "react-icons/md";

import Header from "../../../components/Header";
import MenuLateral from "../../../components/MenuLateral";
import Container from "../../../components/Container";
import CardInformation from "../../../components/CardInformation";
import ButtonChangeScreen from "../../../components/ButtonChangeScreen";

import RoundGraph from "../../../components/RoundGraph";
import MembersList from "../../../components/MembersList";
import TeamMembersList from '../../../components/TeamMembersList';

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function DetailsTeamColab() {
  const [team, setTeam] = useState({});
  const [graph, setGraph] = useState({});
  const [loading, setLoading] = useState(true);
  const [ownerName, setOwnerName] = useState('');

  const history = useHistory();

  useEffect(() => {
    const user = getLocalStorage("@Scrunner:user");
    const token = getLocalStorage("@Scrunner:token");
    const teamId = history.location.state.teamId;

    const fetchData = async () => {
      try {
        
        const response = await api.get(`teams/details/${teamId}/${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setTeam(response.data.team)
        setGraph(response.data.graph);

        setLocalStorage('@Scrunner:token', response.data.token);

        let owner = response.data.team.users.find((user) => {
          return user.is_owner === true;
        });
        setOwnerName(owner.name);

        setLoading(false);
      }
      catch (error) {
        clearLocalStorage();
        history.push("/", { error: 1 });
      }

    }

    fetchData();

  }, [history.location.state.teamId]);

  const handleCardClick = () => {

    let inputCopy = document.createElement("input");
    inputCopy.value = team.code;
    document.body.appendChild(inputCopy);
    inputCopy.select();
    try {
      document.execCommand('copy');
      toast.info("Código copiado.")
    }
    catch (err) {
      toast.error("Algum erro ocorreu ao tentar copiar o código.")
    }

    document.body.removeChild(inputCopy);

  }

  const removeUserTeam = async (colaboratorId) => {
    const token = getLocalStorage("@Scrunner:token");

    try {
      await api.delete("/teams", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          user_id: colaboratorId,
          team_id: team.id,
        },
      });

      let newUsers = team.users.filter((user) => user.id !== colaboratorId);

      setTeam({ ...team, users: newUsers });
      toast.info("Colaborador removido com sucesso");
    } catch (error) {

      toast.error("Erro ao remover o colaborador");
    }
  }

  return (
    <div className="colaborador-detalhes-time">
      <Header />
      <MenuLateral homeActive={false} />

      <Container>
        <div className="colaborador-container-cards">
          <div className="colaborador-cards-header">
            <h1>{team.name}</h1>
            <div className="colaborador-header-buttons">
              <ButtonChangeScreen
                titleButton={"Dailys"}
                to={`/times/daily/${team.name}`}
              />
              <ButtonChangeScreen
                titleButton={"Tarefas"}
                to={`/times/tarefa/${team.name}`}
              />
            </div>
          </div>
          <div className="divider" />

          <div className="teamInfo-container">

            <Link className="backBtn" to={`/times`} >
              <MdArrowBack size={30} color={"#737FF3"} /> Voltar
            </Link>

            <div className="teamInfo" >
              {ownerName && (
                <p>Time criado por {ownerName}</p>

              )}
            </div>
          </div>


          <div className="colaborador-area-cards">
            <CardInformation
              cardTitle="O código do time"
              subTitle={team.code}
              number={<Hash size={22} />}
              buttonText="Clique para copiar o código"
              copyCode={handleCardClick}
            />
            <CardInformation
              crown
              cardTitle="O time possui"
              subTitle="Membros"
              number={team.users && team.users.length - 1}
              buttonText="Visualize os membros do time abaixo."
            />
            <CardInformation
              cardTitle="A categoria do time é"
              subTitle={team.category}
              buttonText="Clique para configurar o grupo"
            />
          </div>
          <div className="colaborador-graph-area">
            {!loading &&
              isLeader(team.users) ?
              <TeamMembersList colaborators={team.users} removeUserTeam={removeUserTeam} /> :
              <MembersList users={team.users} />
            }

            {!loading &&
              <RoundGraph
                title="Tarefas"
                description="Tarefas foram realizadas no total"
                isPercent={false}
                total={graph.total_tasks}
                complete={graph.total_done_tasks}
              />
            }

          </div>
        </div>
      </Container>
      <ToastContainer />
    </div>
  );
}
