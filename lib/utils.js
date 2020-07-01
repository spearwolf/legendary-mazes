
export function sample(arr) {
  if (arr.length) {
    return arr[(Math.random() * arr.length) | 0];
  }
}
