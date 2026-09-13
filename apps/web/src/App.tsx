import { BrowserRouter, Route, Routes } from "react-router";
import { RequireSession, SignInPage, VerifyPage } from "@/auth";
import { Home } from "./Home.js";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-in/verify" element={<VerifyPage />} />
        <Route
          path="/*"
          element={
            <RequireSession>
              <Home />
            </RequireSession>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
