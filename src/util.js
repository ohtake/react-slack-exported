import React from 'react';

export function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}
export function parseJSON(response) {
  return response.json();
}

export const propTypesRoute = {
  children: React.PropTypes.object,
  route: React.PropTypes.object,
  params: React.PropTypes.object,
};
