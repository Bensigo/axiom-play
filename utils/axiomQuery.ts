import axios from "axios";

export const queryAxiom = async (apl: string, startTime: any, endTime: any, showBoundary: any, format: string = 'legacy') => {
  const apiKey = process.env.NEXT_PUBLIC_AXIOM_API_KEY;
  const orgId = process.env.NEXT_PUBLIC_AXIOM_ORG_ID;
  const url = `https://api.axiom.co/v1/datasets/_apl?format=${format}`;
  try {
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
  }catch(err: any){
    console.log(err)
    showBoundary(err)
  }
};
