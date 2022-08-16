import { Auth, getUser } from "./auth";
import {
  getUserFragments,
  postUserFragments,
  getUserFragmentsById,
  getUserFragmentsExpand,
  getUserFragmentsByIdInfo,
  updateUserFragment,
  deleteUserFragment,
} from "./api";

async function init() {
  // Get our UI elements
  const userSection = document.querySelector("#user");
  const loginBtn = document.querySelector("#login");
  const logoutBtn = document.querySelector("#logout");
  const addButton = document.querySelector("#add-fragment");
  const getButton = document.querySelector("#get-fragment");
  const getbyidButton = document.querySelector("#get-fragment-byid");
  const getbyidInfo = document.querySelector("#get-fragment-byidinfo");
  const updateBtn = document.querySelector("#update-fragment");
  const uploadImage = document.querySelector("#upload-image");
  const updateImage = document.querySelector("#update-image");
  const deleteFragment = document.querySelector("#delete-fragment");

  // Wire up event handlers to deal with login and logout.
  loginBtn.onclick = () => {
    // Sign-in via the Amazon Cognito Hosted UI (requires redirects), see:
    // https://docs.amplify.aws/lib/auth/advanced/q/platform/js/#identity-pool-federation
    Auth.federatedSignIn();
  };
  logoutBtn.onclick = () => {
    // Sign-out of the Amazon Cognito Hosted UI (requires redirects), see:
    // https://docs.amplify.aws/lib/auth/emailpassword/q/platform/js/#sign-out
    Auth.signOut();
  };

  const user = await getUser();
  if (!user) {
    // Disable the Logout button
    logoutBtn.disabled = true;
    return;
  }

  // Log the user info for debugging purposes
  console.log({ user });

  // Update the UI to welcome the user
  userSection.hidden = false;

  // Show the user's username
  userSection.querySelector(".username").innerText = user.username;

  // Disable the Login button
  loginBtn.disabled = true;

  // Do an authenticated request to the fragments API server and log the result
  getUserFragments(user);

  addButton.onclick = () => {
    var data = document.querySelector("#data").value;
    var type = document.querySelector("#fragment-types").value;
    postUserFragments(user, data, type);
  };

  getButton.onclick = () => {
    console.log(getUserFragmentsExpand(user, (expand = 1)));
  };

  getbyidButton.onclick = () => {
    var id = document.querySelector("#databyid").value;
    console.log(getUserFragmentsById(user, id));
  };

  getbyidInfo.onclick = () => {
    var id = document.querySelector("#databyid").value;
    console.log(getUserFragmentsByIdInfo(user, id));
  };

  updateBtn.onclick = () => {
    var id = document.querySelector("#databyid").value;
    var data = document.querySelector("#data").value;
    var type = document.querySelector("#fragment-types").value;
    console.log(updateUserFragment(user, data, type, id));
  };

  uploadImage.onclick = () => {
    var data = document.getElementById("file").files[0];
    postUserFragments(user, data, data.type);
  };

  updateImage.onclick = () => {
    var data = document.getElementById("file").files[0];
    var id = document.querySelector("#databyid").value;
    updateUserFragments(user, data, data.type, id);
  };

  deleteFragment.onclick = () => {
    var id = document.querySelector("#databyid").value;
    deleteUserFragment(user, id);
  };
}

// Wait for the DOM to be ready, then start the app
addEventListener("DOMContentLoaded", init);
