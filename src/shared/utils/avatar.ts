export const getAvatarInitial = (name?: string, email?: string) => {
  const source = name?.trim() || email?.trim() || 'U';
  const [firstWord] = source.split(/\s+/);

  return firstWord.charAt(0).toUpperCase();
};
