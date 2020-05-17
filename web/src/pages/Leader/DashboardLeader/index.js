import React, { useState, useEffect } from "react";

import "./styles.css";

import { getLocalStorage } from '../../../utils/localStorage';

import Header from "../../../components/Header";
import MenuLateral from "../../../components/MenuLateral";
import Container from "../../../components/Container";
import CardInformation from "../../../components/CardInformation";

import SelectReport from "../../../components/SelectReport";
import BurndownGraph from "../../../components/BurndownGraph";

import UsersList from "../../../components/UsersList";
import RoundGraph from "../../../components/RoundGraph";

export default function DashboardLeader() {
  const [MonthReport, setMonthReport] = useState(0);
  const [TimeReport, setTimeReport] = useState(0);
  const [ReportDate, setReportDate] = useState([]);
  const [ReportPlanned, setReportPlanned] = useState([]);
  const [ReportComplete, setReportComplete] = useState([]);
  const [userName, setUserName] = useState("");

  useEffect( () => {
    const user = getLocalStorage('@Scrunner:user');

    setUserName(user.name);

  }, [])

  const handleSelectTime = (time) => {
    setTimeReport(time);
    console.log(TimeReport);
  };

  const handleSelectMonth = (month) => {
    setMonthReport(month, generateReportDate(month));
    console.log(MonthReport);
  };

  const generateReportDate = (month) => {
    let monthCorrect = month > 10 ? month : `0${month}`;

    const dateRange = [
      `06/${monthCorrect}`,
      `13/${monthCorrect}`,
      `20/${monthCorrect}`,
      `27/${monthCorrect}`,
    ];

    const planned = [
      `${Math.floor(Math.random() * (100 - 20) + 20)}`,
      `${Math.floor(Math.random() * (100 - 20) + 20)}`,
      `${Math.floor(Math.random() * (100 - 20) + 20)}`,
      `${Math.floor(Math.random() * (100 - 20) + 20)}`,
    ];

    const complete = [
      `${Math.floor(Math.random() * (100 - 20) + 20)}`,
      `${Math.floor(Math.random() * (100 - 20) + 20)}`,
      `${Math.floor(Math.random() * (100 - 20) + 20)}`,
      `${Math.floor(Math.random() * (100 - 20) + 20)}`,
    ];

    setReportDate(dateRange);
    setReportPlanned(planned);
    setReportComplete(complete);
  };

  return (
    <div className="dashboardLider">
      <Header />
      <MenuLateral />
      <Container>
        <div className="container-cards">
        <h1>Olá, {userName}.</h1>
          <div className="divider" />
          <div className="cards-area">
            <CardInformation
              cardTitle="Foram Criados"
              subTitle="Times"
              number={3}
              buttonText="Clique para visulizar os times"
            />
            <CardInformation
              crown
              cardTitle="Possuem"
              subTitle="Colaboradores"
              number={16}
              buttonText="Cadastrados na plataforma"
            />
            <CardInformation
              cardTitle="Foram completadas"
              subTitle="Tarefas"
              number={21}
              buttonText="Somando todos os times"
            />
          </div>
        </div>
        <div className="container-report">
          <SelectReport
            handleMonth={handleSelectMonth}
            handleTime={handleSelectTime}
            times={[
              { name: "Alfa", value: 1 },
              { name: "Beta", value: 2 },
            ]}
          />
          <BurndownGraph
            DateRange={ReportDate}
            planned={ReportPlanned}
            complete={ReportComplete}
          />
        </div>
        <div className="colab-area">
          <UsersList />
          <RoundGraph
            title="Dailys"
            description="dos colaboradores estão registrando suas Dailys"
            complete={67}
          />
        </div>
      </Container>
    </div>
  );
}
