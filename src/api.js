// src/api.js

// fragments microservice API, defaults to localhost:8080
//const apiUrl = process.env.API_URL;
const apiUrl =
  "http://Fragments-env.eba-jgqek6rk.us-east-1.elasticbeanstalk.com";
//const apiUrl = "http://localhost:8080";

/**
 * Given an authenticated user, request all fragments for this user from the
 * fragments microservice (currently only running locally). We expect a user
 * to have an `idToken` attached, so we can send that along with the request.
 */
export async function getUserFragments(user) {
  console.log("Requesting user fragments data...");
  try {
    const res = await fetch(`${apiUrl}/v1/fragments`, {
      // Generate headers with the proper Authorization bearer token to pass
      headers: user.authorizationHeaders(),
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log("Got user fragments data", { data });
  } catch (err) {
    console.error("Unable to call GET /v1/fragment", { err });
  }
}

export async function getUserFragmentsExpand(user, expand = 0) {
  console.log("Requesting fragments...");
  try {
    const res = await fetch(`${apiUrl}/v1/fragments?expand=${expand}`, {
      // Generate headers with the proper Authorization bearer token to pass
      headers: user.authorizationHeaders(),
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log("Got user fragments:", { data });
    //return { data };
  } catch (err) {
    console.error("Unable to call GET /v1/fragment", { err });
  }
}

export async function getUserFragmentsById(user, id) {
  console.log("Requesting user fragments data...");
  try {
    const res = await fetch(`${apiUrl}/v1/fragments/${id}`, {
      // Generate headers with the proper Authorization bearer token to pass
      headers: user.authorizationHeaders(),
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.text();
    console.log(`Got user fragments data id: ${id}:`, { data });
    console.log(res.headers.get("content-type"));
  } catch (err) {
    console.error(`Unable to call GET /v1/fragment/${id}`, { err });
  }
}

export async function getUserFragmentsByIdInfo(user, id) {
  console.log("Requesting user fragments data...");
  try {
    const res = await fetch(`${apiUrl}/v1/fragments/${id}/info`, {
      // Generate headers with the proper Authorization bearer token to pass
      headers: user.authorizationHeaders(),
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log({ data });
    //console.log(res.headers.get("content-type"));
  } catch (err) {
    console.error(`Unable to call GET /v1/fragment/${id}`, { err });
  }
}

export async function postUserFragments(user, data, type) {
  try {
    const res = await fetch(`${apiUrl}/v1/fragments`, {
      method: "post",
      headers: {
        Authorization: `Bearer ${user.idToken}`,
        "Content-type": type,
      },
      body: data,
    });

    const info = await res.json();
    console.log("Following data has been posted: ", data);
    console.log(info);
  } catch (error) {
    console.error("Issue with post", { error });
  }
}

export async function updateUserFragment(user, data, type, id) {
  try {
    if (type == "application/json") data = JSON.parse(JSON.stringify(data));

    const res = await fetch(`${apiUrl}/v1/fragments/${id}`, {
      method: "put",
      headers: {
        Authorization: `Bearer ${user.idToken}`,
        "Content-type": type,
      },
      body: data,
    });

    const info = await res.json();
    console.log("Following data has been updated: ", data);
    console.log(info);
  } catch (error) {
    console.error("Issue with update", { error });
  }
}

export async function deleteUserFragment(user, id) {
  try {
    const res = await fetch(`${apiUrl}/v1/fragments/${id}`, {
      method: "delete",
      headers: {
        Authorization: `Bearer ${user.idToken}`,
      },
    });

    const info = await res.json();
    console.log("Fragment has been deleted:");
    console.log(info);
  } catch (error) {
    console.error("Issue with delete", { error });
  }
}
