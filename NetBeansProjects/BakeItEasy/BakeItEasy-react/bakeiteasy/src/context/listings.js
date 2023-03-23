// Fetch listings
const fetchListings = async () => {
  const res = await fetch("http://localhost:8080/listings");
  const data = await res.json();

  return data;
};

export default fetchListings;
