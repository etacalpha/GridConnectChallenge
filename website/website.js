/**
 * Call Apigateway to update page view and return new values
 */
const getViews = () => {
  fetch("  https://fqe3hwn9p2.execute-api.us-east-1.amazonaws.com/Prod", {
    method: "PUT",
  })
    .then((response) => response.json())
    .then((json) => {
      const views = document.getElementById("views");
      views.innerHTML = json.accessedValue;
    })
    .catch((err) => console.log(err));
};

getViews();
