import React  from 'react';
import { Box, Heading, Text, Button, VStack, useColorModeValue } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import AstronautSVG from '../components/AstronautSvg';

const NotFoundPage: React.FC = () => {
  const textColor = useColorModeValue("gray.600", "gray.300");
  const headingColor = useColorModeValue("#1F51FF", "#00BFFF");

  return (
    <Box
      minHeight="80vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <VStack spacing={2} textAlign="center">
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Box width={{ base: "200px", md: "300px", lg: "400px" }} height={{ base: "200px", md: "300px", lg: "400px" }}>
            <AstronautSVG color={useColorModeValue("black", "white")} />
          </Box>
        </motion.div>
        <Heading size="lg" color={headingColor}>
          404: User not found
        </Heading>
        <Text fontSize="md" color={textColor}>
          Oops! It seems like you've drifted into uncharted territory.
        </Text>
        <Button
          as={RouterLink}
          to="/"
          color={useColorModeValue("white", "black")}
          bg={useColorModeValue("black", "white")}
          size="lg"
          _hover={{ bg: useColorModeValue("gray.300", "#71797E"), color: useColorModeValue("black", "white") }}
        >
          Go Home
        </Button>
      </VStack>
    </Box>
  );
};

export default NotFoundPage;