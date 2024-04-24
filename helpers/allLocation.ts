import axios from "axios";

const components = "country:VN";
const use_case = "shopee.account";
const use_case_C: string = `use_case=${use_case}&`;
const sessiontoken_C: string = `sessiontoken=8209fec7-36275-4cd3-a371-a1abae218b2&`;
const v_C: string = `v=3`;

export async function areaDetails(input: string): Promise<any> {
  try {
    const { data } = await axios.post(process.env.DIVISION_AUTOCOMPLETE, {
      components,
      input: [{ text: input }],
      use_case,
      return_max_division_only: false,
    });

    return data?.data?.[0] || [];
  } catch (error) {
    console.error("Error in API:", error);
    return [];
  }
}
export async function detailedAddress(
  ward: string,
  district: string,
  city: string,
  input: string
): Promise<any> {
  try {
    const district_C: string = `city=${district}&`;
    const component_C: string = `components=${components}&`;
    const ward_C: string = `district=${ward}&`;
    const input_C: string = `input=${input}&`;
    const state_C: string = `state=${city}&`;

    const url: string =
      process.env.AUTOCOMPLETE +
      district_C +
      component_C +
      ward_C +
      input_C +
      sessiontoken_C +
      state_C +
      use_case_C +
      v_C;

    const { data } = await axios.get(url);

    return data || [];
  } catch (error) {
    console.error("Error in API:", error);
    return [];
  }
}
export async function Coordinate(placeid: string): Promise<any> {
  try {
    const component_C: string = `components=${components}&`;
    const fields_C: string = `fields=geometry&`;
    const group_C: string = `group=DS&`;
    const placeid_C: string = `placeid=${placeid}&`;

    const url: string =
      process.env.DETAILS_LOCATION +
      component_C +
      fields_C +
      group_C +
      placeid_C +
      sessiontoken_C +
      use_case_C +
      v_C;

    const { data } = await axios.get(url);
    return data || [];
  } catch (error) {
    console.error("Error in API:", error);
    return [];
  }
}
export async function fullAddress(input: string): Promise<any> {
  try {
    const response = await axios.post(process.env.FULL_ADDRESS, {
      input: input,
      session_token: "1f7b30eb-6bdf-4af5-ac88-d2daaedfd1a5",
      components: components,
      use_case: process.env.USE_CASE,
      city: "",
      user_lat: 0,
      user_lng: 0,
      location: "",
      radius: 15000,
      language: "vi"
    });

    return response.data || [];
  } catch (error) {
    console.error("Error in API:", error);
    return [];
  }
}