import React, { useState, useEffect } from 'react';
import { Text, HStack, Icon } from '@chakra-ui/react';
import { FiClock } from 'react-icons/fi';

const CountdownTimer = ({ targetDate }) => {
  const calculateTimeRemaining = () => {
    const currentDate = new Date();
    const timeRemaining = Math.max(targetDate - currentDate, 0);

    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  };

  const [time, setTime] = useState(calculateTimeRemaining());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(calculateTimeRemaining());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <HStack spacing={2} color="teal.500">
      <Icon as={FiClock} boxSize={6} />
      <Text fontSize="xl" fontWeight="bold">
        {time.days}d {time.hours}h {time.minutes}m {time.seconds}s
      </Text>
    </HStack>
  );
};

export default CountdownTimer;

