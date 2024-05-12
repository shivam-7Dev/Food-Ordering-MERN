import { Auth0Provider } from "@auth0/auth0-react";
import React from "react";
import { useNavigate } from "react-router-dom";

type PropsType = {
  children: React.ReactNode;
};

export default function Auth0ProviderWithNavigate({ children }: PropsType) {
  const navigate = useNavigate();
  const domain = import.meta.env.VITE_AUTH0_DOMAIN;
  const clientID = import.meta.env.VITE_AUTH0_CLIENT_ID;
  const redirectURI = import.meta.env.VITE_AUTH0_CALLBACK;
  const audience = import.meta.env.VITE_AUTH0_AUDIENCE;

  if (!domain || !clientID || !redirectURI || !audience) {
    throw new Error("unable to reach the Auth0");
  }
  const onRedirectCallback = () => {
    navigate("/auth-callback");
  };
  return (
    <Auth0Provider
      domain={domain}
      clientId={clientID}
      authorizationParams={{
        redirect_uri: redirectURI,
        audience,
      }}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
}
