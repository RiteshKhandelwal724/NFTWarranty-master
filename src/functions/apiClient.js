// import { result } from "lodash";
import moment from "moment";
import { SERVER_BASE_URL } from "../config";

export function postData(url, data, authKey) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  if (authKey) {
    myHeaders.append("app-config-token", authKey);
  }
  const raw = JSON.stringify(data);
  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };
  return fetch(`${SERVER_BASE_URL}${url}`, requestOptions)
    .then((response) => response.json())
    .then((result) => result)
    .catch((error) => error);
}

export function getData(url) {
  const myHeaders = new Headers();
  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  return fetch(`${SERVER_BASE_URL}${url}`, requestOptions)
    .then((response) => response.json())
    .then((result) => result)
    .catch((error) => error);
}

export const getRequestLoggedIn = (url, isAbsolute) => {
  const token = localStorage.getItem("token");
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append(
    "app-config-token",
    "eyJpZCI6ICIxIiwiYmxvY2tjaGFpbiI6ICJFdGhlcmV1bSIsIm5ldHdvcmtfaWQiOiAiNSIsIm5ldHdvcmtfbmFtZSI6ICJnb2VybGkiLCJjdXJyZW5jeV9zeW1ib2wiOiAiRVRIIiwibmV0d29ya191cmwiOiAiaHR0cHM6Ly9nb2VybGkuZXRoZXJzY2FuLmlvIiwiV2FsbGV0UHJpdmF0ZUtleSI6ICI4ZjcxN2U4MmIyZTdjYjg3M2QzMWMzMjM3MTk4NGMwYzlkNWVjYzVlMGFiMTgxMWI4MmJlNjhiMjQ2YjE0NjRjIiwiSW5mdXJhUHJvamVjdElkIjogIjk3NWZlYzRlMWJkZjRkNzY5NGFhN2RmMDdkMzczN2ZjIiwgIkluZnVyYU5vZGVVUkwiOiAiaHR0cHM6Ly9nb2VybGkuaW5mdXJhLmlvL3YzLzk3NWZlYzRlMWJkZjRkNzY5NGFhN2RmMDdkMzczN2ZjIn0"
  );
  if (token) {
    myHeaders.append("auth-token", token);
  }
  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  return fetch(isAbsolute ? url : `${SERVER_BASE_URL}${url}`, requestOptions)
    .then((response) => response.json())
    .then((result) => result)
    .catch((error) => error);
};

export const postRequestLoggedIn = (url, data) => {
  const token = localStorage.getItem("token");
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  if (token) {
    myHeaders.append("auth-token", token);
  }
  const raw = JSON.stringify(data);
  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };
  return fetch(`${SERVER_BASE_URL}${url}`, requestOptions)
    .then((response) => response.json())
    .then((result) => result)
    .catch((error) => error);
};
export const dateFormat = (date) =>
  moment(date, "YYYY-MM-DD hh:mm:ss").format("DD-MM-YYYY");
