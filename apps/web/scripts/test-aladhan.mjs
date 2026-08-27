const test = async () => {
  const res = await fetch("http://api.aladhan.com/v1/gToHCalendar/07/2026");
  const data = await res.json();
  console.log(JSON.stringify(data.data[0], null, 2));
}
test();
