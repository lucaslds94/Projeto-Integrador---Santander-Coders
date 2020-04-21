import React from "react";
import { Link } from "react-router-dom";

import { FaHome } from "react-icons/fa";
import { TiGroup } from "react-icons/ti";

import "./styles.css";

export default function MenuLateral({ isLeader = true, homeActive = true }) {
  return (
    <aside className="menuLateral">
      <Link
        to={`${isLeader ? "/dashboard" : "/dashboard/colaborador"}`}
        className={`btnMenuLateral ${homeActive && 'active'}`}
      >
        <FaHome className= "iconMenuLateral" size={22} /> Início
      </Link>
      <Link
        to={`${isLeader ? "/times" : "/times/colaborador"}`}
        className={`btnMenuLateral ${!homeActive && 'active'}`}
      >
        <TiGroup className="iconMenuLateral" size={22} />
        Times
      </Link>
    </aside>
  );
}
