export const containsMyDomain = (url) => {
  const MyDomainHost = window.location.host;
  const MyDomainName = window.location.hostname;
  const banedDomains = [MyDomainName, MyDomainHost];
  const regexp = new RegExp(
    `^(https?:\/\/)?(www\.)?(${banedDomains.join("|")})(\/|$)`,
    "i"
  );
  return regexp.test(url);
};
