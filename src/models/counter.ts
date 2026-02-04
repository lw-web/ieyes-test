import { useState } from 'react';

export default () => {
  const [num, setNum] = useState(0);

  return {
    num,
    setNum,
  };
};
