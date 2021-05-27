export default async function redditRequest(subreddit='pics') {
  const response = await fetch(`https://www.reddit.com/r/${subreddit}.json`,
    // {  method: 'GET',
    //   headers: { 'Content-Type': 'application/json' },
    // mode: 'no-cors',
    // credentials: "include"
    // }
  );


  return await response.json()
}
