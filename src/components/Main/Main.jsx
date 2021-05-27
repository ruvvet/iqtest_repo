import React, { useEffect, useState } from 'react';
import redditRequest from '../../utils';
import Post from '../Post';
import './main.css';
import { Box, Grid, GridItem } from '@chakra-ui/react';
import { Route, Switch, useParams } from 'react-router-dom';

export default function Main() {
  let { subreddit } = useParams();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // get the Posts
    const getPosts = async () => {
      console.log('sub', subreddit);
      const { data: response } = await redditRequest(subreddit).catch((err) => {
        console.log(err);
      });

      // set loading/error messages if needed

      if (response) {
        const postKeys = ['id', 'author', 'created', 'url'];
        // reduce the data to be sfw
        const posts = response.children.reduce((result, c) => {
          console.log(c);
          // parse out unnecessary data
          const postObj = {};

          if (c.data.over_18 !== 'image') {
            for (const key of postKeys) {
              postObj[key] = c.data[key];
            }
            result.push(postObj);
          }
          return result;
        }, []);

        setPosts(posts);
        setLoading(false);
      }
    };

    // call the function
    getPosts();
  }, []);

  //   const handleClick = () => {
  //     console.log('CLICKED');
  //     setVisible(visible ? false : true);
  //     console.log(visible);
  //   };

  const renderThis = () => {
    return posts.map((p) => (
      <GridItem key={`post-${p.id}`}>
        <Post post={p} />
      </GridItem>
    ));
  };

  return (
    <Box className="main">
      {/* <button onClick={handleClick}>HIDE</button> */}
      <button
        onClick={() => {
          setVisible(visible ? false : true);
        }}
      >
        HIDE
      </button>
      {visible ? (
        <Grid templateColumns="repeat(5, 1fr)">{loading || renderThis()}</Grid>
      ) : (
        <div>bye</div>
      )}
    </Box>
  );
}
