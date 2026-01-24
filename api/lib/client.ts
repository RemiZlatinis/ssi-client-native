import { create } from "apisauce";

import { API_PREFIX, BASE_URL } from "@/config";

const client = create({
  baseURL: BASE_URL + API_PREFIX,
});

export default client;
