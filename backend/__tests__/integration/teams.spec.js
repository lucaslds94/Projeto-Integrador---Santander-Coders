const request = require("supertest");
const app = require("../../src/app");

let USER_DB = {
  id: 1,
  email: "johndoe@test.com",
  password: "12345678",
  token: null,
};

const MOCK_TEAM_TO_DELETE = {
  id: null,
  user_id: USER_DB.id,
  name: "Test team",
  category: "Test",
};


describe("Teams Routes", () => {
  beforeAll(async () => {
    const response = await request(app).post("/login").send(USER_DB);

    USER_DB.token = response.body.token;

    const responseTeam = await request(app)
      .post(`/teams/create`)
      .set("Authorization", `Bearer ${USER_DB.token}`)
      .send(MOCK_TEAM_TO_DELETE);

    MOCK_TEAM_TO_DELETE.id = responseTeam.body.team.id;
  });

  it("Should be able to remove a user from a team", async () => {
    const MOCK_REMOVE_USER_TEAM = {
      user_id: 10,
      team_id: 2,
    };

    const response = await request(app)
      .delete("/teams")
      .set("Authorization", `Bearer ${USER_DB.token}`)
      .send(MOCK_REMOVE_USER_TEAM);

    expect(response.status).toEqual(204);
  });

  it("Should not be able to remove a user with an invalid id from a team ", async () => {
    const MOCK_REMOVE_USER_TEAM = {
      user_id: 4561556132131,
      team_id: 2,
    };

    const response = await request(app)
      .delete("/teams")
      .set("Authorization", `Bearer ${USER_DB.token}`)
      .send(MOCK_REMOVE_USER_TEAM);

    expect(response.status).toEqual(400);
  });

  it("Should not be able to remove a user from a team with an invalid id", async () => {
    const MOCK_REMOVE_USER_TEAM = {
      user_id: 10,
      team_id: 273817389217,
    };

    const response = await request(app)
      .delete("/teams")
      .set("Authorization", `Bearer ${USER_DB.token}`)
      .send(MOCK_REMOVE_USER_TEAM);

    expect(response.status).toEqual(400);
  });

  it("Should not be able to remove a user from a team when there's no association between them", async () => {
    const MOCK_REMOVE_USER_TEAM = {
      user_id: 10,
      team_id: 1,
    };

    const response = await request(app)
      .delete("/teams")
      .set("Authorization", `Bearer ${USER_DB.token}`)
      .send(MOCK_REMOVE_USER_TEAM);

    expect(response.status).toEqual(403);
  });

  it("Should be able to return the teams from a user", async () => {
    const response = await request(app)
      .get(`/teams/${USER_DB.id}`)
      .set("Authorization", `Bearer ${USER_DB.token}`);

    expect(response.status).toEqual(200);
    expect(Array.isArray(response.body.teams)).toEqual(true);
    expect(response.body).toHaveProperty("token");
  });

  it("Should not be able to return the teams from a invalid user", async () => {
    const INVALID_USER_ID = "12312312";

    const response = await request(app)
      .get(`/teams/${INVALID_USER_ID}`)
      .set("Authorization", `Bearer ${USER_DB.token}`);

    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty("err");
  });

  it("Should be able to create a team", async () => {
    const MOCK_TEAM = {
      user_id: USER_DB.id,
      name: "Test team",
      category: "Test",
    };

    const response = await request(app)
      .post(`/teams/create`)
      .set("Authorization", `Bearer ${USER_DB.token}`)
      .send(MOCK_TEAM);

    
    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty("team");
    expect(response.body).toHaveProperty("token");
  });

  it("Should not be able to create a team using an invalid user id", async () => {
    const MOCK_TEAM = {
      user_id: 5522145,
      name: "Test team",
      category: "Test",
    };

    const response = await request(app)
      .post(`/teams/create`)
      .set("Authorization", `Bearer ${USER_DB.token}`)
      .send(MOCK_TEAM);

    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty("err");
  });

  it("Should be able to return team details", async () => {
    const TEAM_ID = 1;
    const USER_ID = 1;

    const response = await request(app)
      .get(`/teams/details/${TEAM_ID}/${USER_ID}`)
      .set("Authorization", `Bearer ${USER_DB.token}`);

    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty("team");
    expect(response.body).toHaveProperty("token");
  });

  it("Should not be able to return details from an nonexistent team", async () => {
    const INVALID_TEAM_ID = 18547895;
    const USER_ID = 1;

    const response = await request(app)
      .get(`/teams/details/${INVALID_TEAM_ID}/${USER_ID}`)
      .set("Authorization", `Bearer ${USER_DB.token}`);

    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty("err");
  });

  it("Should not be able to return team details from an nonexistent user", async () => {
    const TEAM_ID = 1;
    const INVALID_USER_ID = 156454651456;

    const response = await request(app)
      .get(`/teams/details/${TEAM_ID}/${INVALID_USER_ID}`)
      .set("Authorization", `Bearer ${USER_DB.token}`);

    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty("err");
  });

  it("Should not be able to return the details from a team the user is not member ", async () => {
    const TEAM_ID = 1;
    const NOT_MEMBER_ID = 10;

    const response = await request(app)
      .get(`/teams/details/${TEAM_ID}/${NOT_MEMBER_ID}`)
      .set("Authorization", `Bearer ${USER_DB.token}`);

    expect(response.status).toEqual(403);
    expect(response.body).toHaveProperty("err");
  });

  it("Should be able to update the team data", async () => {
    const TEAM_ID = 1;
    const USER_ID = 1;

    const NEW_DATA_TEAM = {
      name: "Updated name",
      category: "Updated category",
      leader_id: 3,
    };

    const response = await request(app)
      .put(`/teams/update/${TEAM_ID}/${USER_ID}`)
      .set("Authorization", `Bearer ${USER_DB.token}`)
      .send(NEW_DATA_TEAM);

    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty("team");
    expect(response.body.team.name).toEqual(NEW_DATA_TEAM.name);
    expect(response.body).toHaveProperty("token");
  });

  it("Should not be able to update the data from a nonexistent team", async () => {
    const TEAM_ID = 1646464;
    const USER_ID = 1;

    const NEW_DATA_TEAM = {
      name: "Updated name",
      category: "Updated category",
      leader_id: 3,
    };

    const response = await request(app)
      .put(`/teams/update/${TEAM_ID}/${USER_ID}`)
      .set("Authorization", `Bearer ${USER_DB.token}`)
      .send(NEW_DATA_TEAM);

    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty("err");
  });

  it("Should not be able to update the team data of a nonexistent user", async () => {
    const TEAM_ID = 1;
    const USER_ID = 1654564;

    const NEW_DATA_TEAM = {
      name: "Updated name",
      category: "Updated category",
      leader_id: 3,
    };

    const response = await request(app)
      .put(`/teams/update/${TEAM_ID}/${USER_ID}`)
      .set("Authorization", `Bearer ${USER_DB.token}`)
      .send(NEW_DATA_TEAM);

    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty("err");
  });

  it("Should not be able to update the data from a team that you're not member", async () => {
    const TEAM_ID = 1;
    const USER_ID = 1;

    const NEW_DATA_TEAM = {
      name: "Updated name",
      category: "Updated category",
      leader_id: 10,
    };

    const response = await request(app)
      .put(`/teams/update/${TEAM_ID}/${USER_ID}`)
      .set("Authorization", `Bearer ${USER_DB.token}`)
      .send(NEW_DATA_TEAM);

    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty("err");
  });

  it("Should be able to delete the team ", async () => {
    const TEAM_ID = MOCK_TEAM_TO_DELETE.id;
    const USER_ID = 1;

    const response = await request(app)
      .delete(`/teams/delete/${TEAM_ID}/${USER_ID}`)
      .set("Authorization", `Bearer ${USER_DB.token}`)

    expect(response.status).toEqual(204);
  });

  it("Should not be able to delete a nonexistent team", async () => {
    const TEAM_ID = 64654545;
    const USER_ID = 1;

    const response = await request(app)
      .delete(`/teams/delete/${TEAM_ID}/${USER_ID}`)
      .set("Authorization", `Bearer ${USER_DB.token}`)

    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty("err");
  });

  it("Should not be able to delete the team of a nonexistent user", async () => {
    const TEAM_ID = MOCK_TEAM_TO_DELETE.id;
    const USER_ID = 16546546548;

    const response = await request(app)
      .delete(`/teams/delete/${TEAM_ID}/${USER_ID}`)
      .set("Authorization", `Bearer ${USER_DB.token}`)

    expect(response.status).toEqual(403);
    expect(response.body).toHaveProperty("err");
  });

  it("Should not be able to delete a team that you're not the owner", async () => {
    const TEAM_ID = 2;
    const USER_ID = 1;

    const response = await request(app)
      .delete(`/teams/delete/${TEAM_ID}/${USER_ID}`)
      .set("Authorization", `Bearer ${USER_DB.token}`)

    expect(response.status).toEqual(403);
    expect(response.body).toHaveProperty("err");
  });

  it("Should be able to enter in a team", async () => {
    const USER_TEAM_DATA = {
      user_id: 2,
      code: '9F4A6G5H'
    }

    const response = await request(app)
      .post(`/teams/entry`)
      .set("Authorization", `Bearer ${USER_DB.token}`)
      .send(USER_TEAM_DATA)

    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty("team");
    expect(response.body).toHaveProperty("token");
  });

  it("Should not be able to enter in a team with an invalid user", async () => {
    const TEAM_INVALID_USER = {
      user_id: 16546546548,
      code: '84F9A219'
    };

    const response = await request(app)
      .post(`/teams/entry`)
      .set("Authorization", `Bearer ${USER_DB.token}`)
      .send(TEAM_INVALID_USER);

    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty("err");
  });

  it("Should not be able to enter in a team with an invalid code", async () => {
    const TEAM_INVALID_CODE = {
      user_id: 2,
      code: '54561981'
    };

    const response = await request(app)
      .post(`/teams/entry`)
      .set("Authorization", `Bearer ${USER_DB.token}`)
      .send(TEAM_INVALID_CODE);

    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty("err");
  });

  it("Should not be able to enter in a team with an owner account", async () => {
    const TEAM_INVALID_OWNER = {
      user_id: USER_DB.id,
      code: '9F4A6G5H'
    };

    const response = await request(app)
      .post(`/teams/entry`)
      .set("Authorization", `Bearer ${USER_DB.token}`)
      .send(TEAM_INVALID_OWNER);

    expect(response.status).toEqual(403);
    expect(response.body).toHaveProperty("err");
  });

  it("Should not be able to enter in a team you're already in", async () => {
    const TEAM_ALREADY_IN = {
      user_id: 7,
      code: '9F4A6G5H'
    };

    const response = await request(app)
      .post(`/teams/entry`)
      .set("Authorization", `Bearer ${USER_DB.token}`)
      .send(TEAM_ALREADY_IN);

    expect(response.status).toEqual(409);
    expect(response.body).toHaveProperty("err");
  });
});
