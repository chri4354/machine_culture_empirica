import axios from "axios";
import { v4 as uuidv4 } from "uuid";

export const fetchMachineSolution = data => {
  return axios({
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    data: { data, requestId: uuidv4() },
    url: Meteor.settings.machineBackendUrl
  });
};
