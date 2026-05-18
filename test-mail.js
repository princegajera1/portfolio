const test = async () => {
  const response = await fetch("https://formsubmit.co/ajax/princegajera944@gmail.com", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      name: "Test Name",
      email: "test@example.com",
      message: "Test Message",
    })
  });
  const data = await response.json();
  console.log("Status:", response.status);
  console.log("Data:", data);
};
test();
