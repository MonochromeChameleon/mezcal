export const zip = (a1, a2) =>
  Array.from({ length: Math.max(a1.length, a2.length) }).map((_, i) => ({
    first: a1[i],
    second: a2[i],
  }));
