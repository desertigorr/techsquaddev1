import { type FC } from "react";

type ReportsPageProps = {
  logUser: {
    reports: string[];
  };
};

const apiUrl = import.meta.env.VITE_API_URL;

const ReportsPage: FC<ReportsPageProps> = ({ logUser }) => {
  return (
    <div className="reports-page">
      <div className="reports-page-heading">
        Ваши отчеты
      </div>
      <div className="reports-area">
        {logUser.reports && logUser.reports.length > 0 ? (
          (logUser.reports || []).slice().reverse().map((filename, idx) => (
            <div key={idx}>
              <a className="reports-file"
                href={`${apiUrl}/reports/${filename}`}
                target="_blank"
              >
                📄 {filename}
              </a>
            </div>
          ))
        ) : (
          <div>
            У вас нет загруженных отчетов
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
