import dayjs from "dayjs";
export const formatDate = (isoDate) => {
  return dayjs(isoDate).format("DD.MM.YYYY");
};
