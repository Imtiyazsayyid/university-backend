const { getIntOrNull } = require("@/@core/helpers/commonHelpers");

export default function getPrismaPagination(currentPage, itemsPerPage) {
  let pagination = {};

  itemsPerPage = getIntOrNull(itemsPerPage);
  currentPage = getIntOrNull(currentPage);

  if (itemsPerPage) {
    pagination = {
      ...pagination,
      take: itemsPerPage,
    };
  }
  if (itemsPerPage && currentPage) {
    pagination = {
      ...pagination,
      skip: (currentPage - 1) * itemsPerPage,
    };
  }

  return pagination;
}
