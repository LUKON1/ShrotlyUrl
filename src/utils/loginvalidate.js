export const validateLogin = (user) => {
  const loginRegex = /^[a-zA-Z0-9]{1,15}$/;
  return loginRegex.test(user);
};
