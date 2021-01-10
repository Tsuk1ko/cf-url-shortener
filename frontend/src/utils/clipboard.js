const requestPermission = async name => {
  if (!(navigator && 'permissions' in navigator && 'clipboard' in navigator)) return false;
  const permission = (await navigator.permissions.query({ name })).state;
  if (!(permission === 'granted' || permission === 'prompt')) return false;
  return true;
};

export default async txt => {
  if (await requestPermission('clipboard-write')) {
    navigator.clipboard.writeText(txt);
    return true;
  }
  return false;
};
