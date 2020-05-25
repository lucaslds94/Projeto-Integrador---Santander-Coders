import React from "react";

import { v4 as uuid } from "uuid";
import "./styles.css";

export default function MembersList({ users = [] }) {

  const removeOwnerFromUsers = () => {
    return users.filter((user) => !user.is_owner);
  };

  return (
    <div className="table-members-container">
      <div className="table-members-header">
        <h1>Membros</h1>
      </div>
      <div className="table-title-members">
        <p>Nome</p>
        <p>Posição</p>
      </div>
      <div className="table-list">
        <div className="table-row">
          <ul>
            {removeOwnerFromUsers().map((user) => (
              <div key={uuid()} className="list-item">
                <li>
                  <div className="user-image" />
                  {user.name}
                </li>
                <li>{user.is_leader ? "Líder" : "Membro"}</li>
              </div>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
