import {BrowserRouter, Routes, Route, } from "react-router-dom";
import ATMWelcome from "./components/ATMWelcome";
import PINKeypad from "./components/PINKeypad";
import MainBank from "./components/mainBank";
import AccountSelection from "./components/AccountSelection";
import ATMWithdrawalScreen from "./components/ATMWithdrawalScreen";
import ATMSuccessScreen from "./components/ATMSuccessScreen";
import BalanceScreen from "./components/BalanceScreen";
import MovementsScreen from "./components/MovementsScreen";
import AmountScreen from "./components/AmountScreen";


import "./index.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<ATMWelcome />}
        />

        <Route
          path="/pin"
          element={<PINKeypad />}
        />

        <Route
          path="/main"
          element={<MainBank />}
        />

        <Route
          path="/account-selection"
          element={<AccountSelection />}
        />

        <Route
          path="/withdrawal"
          element={<ATMWithdrawalScreen />}
        />

        <Route
          path="/success"
          element={<ATMSuccessScreen />}
        />
        <Route path="/balance" element={<BalanceScreen />} 
        />
        <Route path="/movements" element={<MovementsScreen />} 
        />
        <Route
         path="/amount"element={<AmountScreen />}/>
       </Routes>
    </BrowserRouter>
  );
}

export default App;