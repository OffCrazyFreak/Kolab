import Button from "@mui/material/Button";

export default function Setup({ setAppIsSetup }) {
  function onClick() {
    // const options = {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/x-www-form-urlencoded",
    //   },
    //   body: userObject.email,
    // };
    // fetch("/users/exists-any", options).then((response) => {
    //   if (response.status === 401) {
    //     // display error msg
    //   } else {
    //     setAppIsSetup(true);
    //   }
    // });

    setAppIsSetup(true);
  }

  return (
    <div className="Setup">
      <h1>Kolab Setup</h1>

      {/* TODO: add form with email field  */}
      <Button variant="contained" size="large" onClick={onClick}>
        This button sets up the app
      </Button>
    </div>
  );
}
