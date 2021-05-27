import React from 'react';
import './post.css';
import { Flex, Box, Image, Spacer } from "@chakra-ui/react"

export default function Post({post}) {

  return <Box className="post"borderWidth="1px" borderRadius="lg" overflow="hidden" m="6">
    <Image src={post.url} alt={post.title} />

    </Box>;
}
