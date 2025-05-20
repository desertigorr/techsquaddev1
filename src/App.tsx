import {Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import AccountPage from "./pages/AccountPage";
import ReportsPage from "./pages/ReportsPage";
import ImagePage from "./pages/ImagePage";
import { useState, useEffect } from "react";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";

export type UserType = {
  id: number,
  fullName: string,
  status: string,
  email: string,
  password: string,
  images: string[],
  reports: string[]
}

const App = () => {
  // Пользователи из базы данных
  const [users, setUsers] = useState<UserType[]>([]);
  // Сохраненный в локальном хранилище пользователь
  const savedUser = localStorage.getItem('logUser'); 
  const nullUser = {
    id: 0,
    fullName: "",
    status: "",
    email: "",
    password: "",
    images: [],
    reports: [],
  }

  const [logUser, setLogUser] = useState<UserType>(savedUser ? JSON.parse(savedUser) : nullUser);
  const [isEntered, setIsEntered] = useState(localStorage.getItem('isEntered') === 'true');
  const [isRegistered, setIsRegistered] = useState(true);
  const apiUrl = import.meta.env.VITE_API_URL
  console.log('App apiUrl:', apiUrl)
  const fetchUsers = async () => {
    try {
      const response = await fetch(`${apiUrl}/users/`);
      const data: UserType[] = await response.json();
      setUsers(data);
    } catch {
      console.log("Ошибка при загрузке данных!");
    };
  };

  useEffect(() => {  
    fetchUsers();
  }, []);

  if (!isRegistered) {
    return (
      <div className="wrapper">
        <RegisterForm
          fetchUsers={fetchUsers}
          setIsRegistered={setIsRegistered}
          users={users}
        />
      </div>
    );
  }

  if (!isEntered) {
    return (
      <div className="wrapper">
        <LoginForm
          users={users}
          logUser={logUser}
          setLogUser={setLogUser}
          nullUser={nullUser}
          setIsEntered={setIsEntered}
          setIsRegistered={setIsRegistered}
        />
      </div>
    );
  }

  return (
    <div className="wrapper">
      <div className="account">
        <Header />
        <Routes>
          <Route path="/"
            element={
              <ImagePage
                logUser={logUser}
                setLogUser={setLogUser}
                fetchUsers={fetchUsers}
              />
            }
          />
          <Route path="/reports"
            element={
              <ReportsPage
                logUser={logUser}
              />
            }
          />
          <Route path="/profile"
            element={
              <AccountPage
                logUser={logUser}
                setLogUser={setLogUser}
                setIsEntered={setIsEntered}
                nullUser={nullUser}
                fetchUsers={fetchUsers}
              />
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;