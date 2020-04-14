import React from "react";

import Header from "../../components/Header";
import MenuLaretal from "../../components/MenuLateral";
import Container from "../../components/Container";
import CardTeam from "../../components/CardTeam";

import { FaPlus } from 'react-icons/fa'

import "./styles.css";

export default function TimesLider() {

    return (
        <div className="teamsLider">
            <Header />
            <MenuLaretal />
            <Container>
                <div className="container-title">
                    <h1> Times </h1>
                    <button className="action-button"> <FaPlus/> Criar Time </button>
                </div>
                <div className="teams-divider"></div>


                <div className="container-teams">
                    <CardTeam 
                        teamName="Alpha"
                        teamCategory="Desenvolvimento"
                        teamCode="E98H36"
                        teamMembers={ ["Ana Fonseca", "José Afonso", "Mais alguem3", "Mais alguem4", "Mais alguem5"] }
                    />
                    <CardTeam />
                    
                    
                </div>


            </Container>


        </div>
    )
}