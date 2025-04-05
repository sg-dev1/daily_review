//
// To fix hydration errors, see
// https://stackoverflow.com/a/75411758
//
'use client';

import { useEffect, useState } from 'react';

export const Dynamic = ({ children }: { children: React.ReactNode }) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return <>{children}</>;
};
