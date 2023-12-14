import React from "react";

const UserContext = React.createContext({
    token: null,
    userId: null
  });

export default UserContext;