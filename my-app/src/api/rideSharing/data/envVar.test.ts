import { dummyGoogleJsonData } from "../../../data/googleResultSample"



export default async function responseGoogleApiCall(request: Request<unknown, CfProperties<unknown>>) {
  const url = new URL(request.url)
  if (url.pathname === '/api/score') {
    console.log("this is a mock response");
    
    const mockResponse = {
      success: true,
      data: dummyGoogleJsonData
    }

    return new Response(JSON.stringify(mockResponse), {
      headers: { 'Content-Type': 'application/json' }
    })
  }

  return fetch(request);
}