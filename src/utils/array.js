export function divideInGroups(list = [], divider = 2) {
  const group = [];

  const segments = Math.floor(list.length / divider);

  for (let index = 0; index <= segments; index++) {
    const divideIndex = index * divider;
    group.push(list.slice(divideIndex, divideIndex + divider));
  }

  return group;
}
