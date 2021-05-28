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
  List,
  ListItem,
  Image,
  Tooltip,
  Input,
  Heading,
} from '@chakra-ui/react';
import { Route, Switch, Link, useParams, useHistory } from 'react-router-dom';
import {
  ArrowRightIcon,
  ArrowLeftIcon,
  ViewIcon,
  ViewOffIcon,
  StarIcon,
  DeleteIcon,
} from '@chakra-ui/icons';

export default function Main() {
  let { subreddit } = useParams();
  const history = useHistory();

  const [posts, setPosts] = useState([]);
  const [next, setNext] = useState('');
  const [prev, setPrev] = useState('');
  const [page, setPage] = useState('');
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(true);
  const [selected, setSelected] = useState({});

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

  const renderThat = () => {
    return Object.keys(selected).map((s) => (
      <ListItem display="inline-block" key={`selected-${s}`}>
        <Post
          handleSelect={handleSelect}
          post={selected[s]}
          selected={selected}
          h="70px"
          w="70px"
        />
      </ListItem>
    ));
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      history.push(`/${e.target.value}`);
    }
  };

  const handleSelect = (post) => {
    if (selected[post.id]) {
      const newSelected = { ...selected };
      delete newSelected[post.id];
      setSelected(newSelected);
    } else {
      setSelected({ ...selected, [post.id]: post });
      console.log(selected);
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
    <Flex className="main" direction="row" justify="center" alignItems="center">
      <Flex
        className="main"
        width="70%"
        direction="column"
        justify="center"
        alignItems="center"
      >
        <Flex justify="space-around">
          <Tooltip label="Home">
            <Link to="/">
              <IconButton icon={<StarIcon />} />
            </Link>
          </Tooltip>

          <Input
            color="white"
            placeholder="Enter Subreddit Name"
            variant="filled"
            onKeyDown={(e) => {
              handleSearch(e);
            }}
          />
          <Tooltip label="Previous">
            <IconButton onClick={handlePrev} icon={<ArrowLeftIcon />} />
          </Tooltip>
          <Tooltip label="Next">
            <IconButton onClick={handleNext} icon={<ArrowRightIcon />} />
          </Tooltip>
        </Flex>

        <Grid templateColumns="repeat(5, 1fr)">
          {loading ? <Spinner /> : renderThis()}
        </Grid>
      </Flex>
      <Flex
        direction="column"
        justify="center"
        alignItems="center"
        width="30%"

      >
        <Flex justify="center" alignItems="center">
          <Heading as="h2" color="white" px={6}>
            Selected
          </Heading>
          <Tooltip label={visible ? 'Hide' : 'Unhide'}>
            <IconButton
              onClick={() => {
                setVisible(visible ? false : true);
              }}
              icon={visible ? <ViewOffIcon /> : <ViewIcon />}
            />
          </Tooltip>
          <Tooltip label="Clear">
            <IconButton
              onClick={() => {
                setSelected({});
              }}
              icon={<DeleteIcon />}
            />
          </Tooltip>
        </Flex>
        {visible && (
          <Flex w="1fr" h="auto" align="center" justify="center">
            <List bgColor={visible ? '#121212' : ''}>{renderThat()}</List>
          </Flex>
        )}
      </Flex>
    </Flex>
  );
}
