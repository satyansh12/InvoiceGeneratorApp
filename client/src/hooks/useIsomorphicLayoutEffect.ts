// src/hooks/useIsomorphicLayoutEffect.ts
import { useEffect, useLayoutEffect } from 'react';

const canUseDOM: boolean = !!(
    typeof window !== 'undefined' &&
    window.document &&
    window.document.createElement
);

export const useIsomorphicLayoutEffect = canUseDOM ? useLayoutEffect : useEffect;
