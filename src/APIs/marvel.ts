async function networkRequest(url: RequestInfo | URL, init?: RequestInit) {
  const urlToRequest = new URL(url.toString());
  urlToRequest.searchParams.append("apikey", process.env.REACT_APP_API_KEY!);
  urlToRequest.searchParams.append("ts", process.env.REACT_APP_TS!);
  urlToRequest.searchParams.append("hash", process.env.REACT_APP_HASH!);

  try {
    const response = await fetch(urlToRequest.toString(), init);
    if (response.ok) {
      const data = await response.json();
      return { error: false, message: "", data };
    }
    throw { status: response.status, message: response.statusText };
  } catch (error: any) {
    return { error: true, message: error.message, data: null };
  }
}

export async function getMarvelCharacters(
  limit: number = 3,
  offset: number = 0,
  searchText:string=''
) {
  const url = new URL("/v1/public/characters", process.env.REACT_APP_BASE_URL);
  url.searchParams.append("limit", String(limit));
  url.searchParams.append("offset", String(offset));
  if(searchText){
    url.searchParams.append('nameStartsWith', searchText)
  }

  const response = await networkRequest(url);
  response.data = response.data.data;
  return response;
}
