import React, { useEffect, useState } from 'react';
import redditRequest from '../../utils';
import Post from '../Post';
import './main.css';
import {
  Box,
  Grid,
  GridItem,
  Spinner,
  IconButton,
  Flex,
  Center,
  Text,
  ListItem
} from '@chakra-ui/react';
import { Route, Switch, useParams } from 'react-router-dom';
import {
  ArrowRightIcon,
  ArrowLeftIcon,
  ViewIcon,
  ViewOffIcon,
} from '@chakra-ui/icons';

export default function Main() {
  let { subreddit } = useParams();

  const [posts, setPosts] = useState([]);
  const [next, setNext] = useState('');
  const [prev, setPrev] = useState('');
  const [page, setPage] = useState('');
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(true);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    // get the Posts
    const getPosts = async () => {
      const { data: response } = await redditRequest(subreddit, page).catch(
        (err) => {
          console.log(err);
        }
      );

      // set loading/error messages if needed

      if (response) {
        setNext(response.after);

        const postKeys = ['id', 'author', 'title', 'created', 'thumbnail'];
        // reduce the data to be sfw
        const posts = response.children.reduce((result, c) => {
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
  }, [subreddit, page]);

  const renderThis = () => {
    return posts.map((p) => (
      <GridItem key={`post-${p.id}`}>
        <Post handleSelect={handleSelect} post={p} selected={selected} />
      </GridItem>
    ));
  };

  const renderThat = () =>{
    // return selected.map((s)=>{
    //   <ListItem></ListItem>
    // })
  }

  const handleSelect = (id) => {
    if (selected.includes(id)) {
      const newSelected = [
        ...selected.slice(0, selected.indexOf(id)),
        ...selected.slice(selected.indexOf(id) + 1),
      ];
      setSelected(newSelected);
    } else {
      setSelected([...selected, id]);
    }
  };

  const handleNext = () => {
    setPrev(page || '');
    setPage(next);
  };

  const handlePrev = () => {
    setPage(prev);
  };

  return (
    <Flex className="main" direction="column" justify="center" alignItems="center">
      <Flex width="100%" justify="space-around">
        <IconButton onClick={handlePrev} icon={<ArrowLeftIcon />} />
        <IconButton
          onClick={() => {
            setVisible(visible ? false : true);
          }}
          icon={visible ? <ViewOffIcon /> : <ViewIcon />}
        />

        <IconButton onClick={handleNext} icon={<ArrowRightIcon />} />
      </Flex>

      {visible ? (
        <Grid templateColumns="repeat(5, 1fr)">
          {loading ? <Spinner /> : renderThis()}
        </Grid>
      ) : (
        <Box>bye</Box>
      )}
      <Flex><Text color="white">Selected</Text>
      </Flex>
    </Flex>
  );
}
