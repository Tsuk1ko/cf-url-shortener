export const copyText = async (txt: string) => {
  try {
    await navigator.clipboard.writeText(txt);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
