export function createSubscritpionRequest(data) {
  return {
    type: '@subscription/CREATE_REQUEST',
    payload: { data },
  };
}
export function cancelSubscritpionRequest(data) {
  return {
    type: '@subscription/CANCEL_REQUEST',
    payload: { data },
  };
}
