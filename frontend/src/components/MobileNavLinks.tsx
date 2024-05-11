import React from "react";

import { Button } from "./ui/button";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";

export default function MobileNavLinks() {
  const { logout } = useAuth0();

  return (
    <>
      <Link
        to="/user-profile"
        className=" flex bg-white items-center font-bold hover: text-orange-500"
      >
        User Profile
      </Link>
      <Button
        onClick={async () => logout()}
        className=" flex items-center px-3 font-bold bg-orange-500"
      >
        Logout
      </Button>
    </>
  );
}
