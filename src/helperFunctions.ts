export function frameSortByName(arr: SceneNode[]): SceneNode[] {
  function customSort(a: SceneNode, b: SceneNode) {
    const isNumber = (v: String): boolean => (+v).toString() === v;

    const aPart = a.name.match(/\d+|\D+/g) || [];
    const bPart = b.name.match(/\d+|\D+/g) || [];

    let i = 0;
    let len = Math.min(aPart.length, bPart.length);

    while (i < len && aPart[i] === bPart[i]) {
      i++;
    }

    if (i === len) {
      return aPart.length - bPart.length;
    }

    if (isNumber(aPart[i]) && isNumber(bPart[i])) {
      return parseInt(aPart[i]) - parseInt(bPart[i]);
    }

    return aPart[i].localeCompare(bPart[i]);
  }

  const sortedArray = arr.slice().sort(customSort);

  return sortedArray;
}

export function frameSortByXCoordinate(arr: SceneNode[]): SceneNode[] {
  function sortOnXAxis(a: SceneNode, b: SceneNode) {
    return a.x - b.x;
  }

  const sortedArray = arr.slice().sort(sortOnXAxis);

  sortedArray.forEach((node, i) => {
    node.name = (i + 1).toString();
  });

  return sortedArray;
}
