export const processCategories = (catagories) => {
  const catagoryArray = catagories.match(/[\w]+/g) || [];
  return catagoryArray.map((name) => ({
    where: { name },
    create: { name },
  }));
};
