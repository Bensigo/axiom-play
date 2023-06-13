import axios from "axios";

export const queryAxiom = async (apl: string, startTime: any, endTime: any) => {
  const apiKey = process.env.NEXT_PUBLIC_AXIOM_API_KEY;
  const orgId = process.env.NEXT_PUBLIC_AXIOM_ORG_ID;
  const url = `https://api.axiom.co/v1/datasets/_apl?format=legacy`;
  const { data } = await axios.post(
    url,
    {
      apl,
      startTime,
      endTime,
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "X-Axiom-Org-ID": orgId,
      },
    }
  );
  return data;
};
