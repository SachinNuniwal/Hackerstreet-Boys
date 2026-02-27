export const getEvents = () => {
  const data = localStorage.getItem("events");
  return data ? JSON.parse(data) : [];
};

export const saveEvents = (events) => {
  localStorage.setItem("events", JSON.stringify(events));
};