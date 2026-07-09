const objectsIdMap = new Map<object, number>();
let objectCount = 0;

export function objectId(object: object) {
  let id = objectsIdMap.get(object);
  if (!id) objectsIdMap.set(object, (id = ++objectCount));
  return id;
}
