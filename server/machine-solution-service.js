import axios from "axios";

export const fetchMachineSolution = data => {
  return axios({
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    data,
    url: Meteor.settings.machineBackendUrl
  });
};
