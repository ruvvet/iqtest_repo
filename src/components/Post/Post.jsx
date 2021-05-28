import React, { useEffect, useState } from 'react';
import './post.css';
import { Flex, Box, Image, Spacer, Text } from '@chakra-ui/react';

export default function Post({ handleSelect, post, selected }) {
  const [showTitle, setShowTitle] = useState(false);

  const handleStyle = () => {
    const selectedStyle = {
      borderColor: '#000000',
      borderWidth: '10px',
    };

    return selectedStyle;
  };

  return (
    <>
      <Box
        className="post"
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
      h="100px"

        m="6"
        objectFit="cover"
        onClick={() => handleSelect(post.id)}
        style={{
          border: `${
            selected.includes(post.id) ? '5px solid green' : '#FFFFFF'
          }`,
        }}
        position="relative"
      >
        <Box
          position="absolute"
          h="100%"
          w="100%"
          objectFit="contain"
          onMouseEnter={() => setShowTitle(true)}
          onMouseLeave={() => setShowTitle(false)}
        >
          {showTitle && (
            <Text color="#FFFFFF" bgColor="#00000050" h="100%" w="100%" p="2">
              {post.title}
            </Text>
          )}
        </Box>
        <Image
          src={post.thumbnail}
          alt={post.title}
          w="100%"
          h="100%"
          objectFit="cover"
          fallbackSrc="https://via.placeholder.com/150"
        />
      </Box>
    </>
  );
}
