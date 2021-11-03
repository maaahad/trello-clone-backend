const fetch = require("isomorphic-fetch");

// base url
const baseUrl = "http://localhost:3033";

const _fetch = async (method, path, body) => {
  body = typeof body === "string" ? body : JSON.stringify(body);
  const headers = { "Content-Type": "application/json" };
  const res = await fetch(baseUrl + path, { method, body, headers });
  if (res.status < 200 || res.status > 299) {
    throw new Error(
      `[UNSUCCESSFUL_REQUEST] : Server returned with status ${res.status}`
    );
  }

  return await res.json();
};

describe("/account endpoint tests", () => {
  test("GET /account/user/:email", async () => {
    const email = "ahad@yahoo.com";
    const user = await _fetch("get", `/account/user/${email}`);
    expect(user.email).toBe(email);
  });

  test("POST /account/user/create-workspace", async () => {
    // first we login in
    const email = "ahad@yahoo.com";
    const password = "test";
    const body = { email, password };
    const { user } = await _fetch("put", "/auth/login/inhouse", body);
    expect(user.email).toBe("ahad@yahoo.com");
    // then we create workspace
    const wpBody = {
      userId: user._id,
      title: "Workspace from testing suite",
      descr: "This is for testing purpose",
    };

    const workspace = await _fetch(
      "post",
      "/account/user/create-workspace",
      wpBody
    );
    // then get all workspaces for the user and check whether the
    const workspaces = await _fetch(
      "get",
      `/account/user/workspaces/${user._id}`
    );
    // newly create workspace in within the workspace list
    expect(workspaces.find((wp) => wp._id === workspace._id)?._id).toBe(
      workspace._id
    );
  });
});
