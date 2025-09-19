export const containsMyDomain = (url) => {
  const MyDomainHost = window.location.host;
  const MyDomainName = window.location.hostname;
  const banedDomains = ["localhost:7206", MyDomainName, MyDomainHost];
  const regexp = new RegExp(
    `^(https?:\/\/)?(www\.)?(${banedDomains.join("|")})(\/|$)`,
    "i"
  );
  return regexp.test(url);
};
