import authService from "../components/api-authorization/AuthorizeService";

export const get = async (url) => {
  const token = await authService.getAccessToken();
  const response = await fetch(url, {
    headers: !token ? {} : { Authorization: `Bearer ${token}` },
  });

  return await response.json();
};

export const getBlob = async (url) => {
  const token = await authService.getAccessToken();
  const response = await fetch(url, {
    headers: !token ? {} : { Authorization: `Bearer ${token}` },
  });

  return await response.blob();
};

export const send = async (url, payload, method) => {
  const token = await authService.getAccessToken();
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(!token ? {} : { Authorization: `Bearer ${token}` }),
    },
    method,
    body: JSON.stringify(payload),
  });

  return await response.json();
};
