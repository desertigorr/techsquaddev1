import { type FC} from "react";
import type { UserType } from "../App";
import { useNavigate } from "react-router-dom";

type AccountPageProps = {
  logUser: UserType,
  setLogUser: (user: UserType) => void,
  setIsEntered: (bool: boolean) => void,
  nullUser: UserType,
  fetchUsers: () => void
}
const apiUrl = import.meta.env.VITE_API_URL;
const AccountPage: FC<AccountPageProps> = ({logUser, setLogUser, setIsEntered, nullUser, fetchUsers}) => {
  const navigate = useNavigate();

  const handleLogOut = () => {
    setIsEntered(false);
    setLogUser(nullUser);
    localStorage.setItem('isEntered', 'false');
    localStorage.removeItem('logUser');
    localStorage.removeItem('uploadedImagePath');
    fetchUsers()
    navigate('/');
  };
  
  const handleDelete = async () => {
    try {
      const response = await fetch(`${apiUrl}/users/${logUser.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
    
      if (response.ok) {
        setLogUser(nullUser);
        setIsEntered(false);
        localStorage.setItem("isEntered", "false");
        localStorage.removeItem("logUser");
        localStorage.removeItem("uploadedImagePath");
        navigate('/');
        fetchUsers(); 
      } else {
        console.error("Ошибка при удалении пользователя");
      }
    } catch (error) {
      console.error("Ошибка при удалении пользователя:", error);
    };
  };

  return (
      <div className="profile-page">
        <div className="profile-page-heading">
          Мой профиль
        </div>

        <div className="profile">
          <img className="profile-img" 
            src="/images/big-avatar.png"
          />

          <div className="profile-info">
            <div className="profile-info-text">
              <div className="profile-info-name">
                ФИО
              </div>

              <div className="profile-info-plot">
                {logUser.fullName}
              </div>
            </div>
            
            <div className="profile-info-text">
              <div className="profile-info-name">
                Должность
              </div>

              <div className="profile-info-plot">
                {logUser.status}
              </div>
            </div>

            <div className="profile-info-text">
              <div className="profile-info-name">
                Почта
              </div>

              <div className="profile-info-plot">
                {logUser.email}
              </div>
            </div>
          </div>
        </div>

        <div className="profile-page-buttons">
          <div className="profile-btn" 
            onClick={handleLogOut}
          >
            Выйти из аккаунта
          </div>
          <div className="profile-btn" 
            onClick={handleDelete}
          >
            Удалить аккаунт
          </div>
        </div>
      </div>
    );
  };
  
  export default AccountPage;