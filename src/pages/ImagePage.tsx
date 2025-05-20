import { useState, type FC } from "react";
import type { UserType } from "../App";
import EditorPage from "../components/EditorPage";

type ImagePageProps = {
  logUser: UserType
  setLogUser: (user: UserType) => void,
  fetchUsers: () => void,
}


const ImagePage: FC<ImagePageProps> = ({logUser, setLogUser, fetchUsers}) => {
  const [file, setFile] = useState<File | null>(null);
  const [inputKey, setInputKey] = useState<number>(Date.now());
  const [uploadError, setUploadError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedImagePath, setUploadedImagePath] = useState<string | null>(() => {
    return localStorage.getItem("uploadedImagePath");
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected || selected.type !== "image/png") {
      setFile(null);
    } else {
      setFile(selected);
    }
  };

  const handleUploadedImagePath = (path: string | null) => {
    setUploadedImagePath(path);
    if (path) {
      localStorage.setItem("uploadedImagePath", path);
    } else {
      localStorage.removeItem("uploadedImagePath");
    }
  };

  const toAnalyse = async () => {
    if (!file) return;
    setIsProcessing(true);
    setUploadError("")

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", logUser.id.toString());
  
    const apiUrl = import.meta.env.VITE_API_URL
    console.log('ImagePage apiUrl:', apiUrl)
    try {
      const response = await fetch(`${apiUrl}/upload`, {
        method: "POST",
        body: formData,
      });
  
      if (response.ok) {
        const data = await response.json();
        const newImagePath = `${apiUrl}/images/${data.filename}`;
        setUploadedImagePath(newImagePath);
        handleUploadedImagePath(newImagePath);

        const updatedUser = {
          ...logUser,
          images: [...logUser.images, data.filename],
        };

        setLogUser(updatedUser);
        localStorage.setItem("logUser", JSON.stringify(updatedUser));
        fetchUsers();
        setIsProcessing(false);
        setFile(null);
        setInputKey(Date.now());
      } else {
        setUploadError("Ошибка при загрузке изображения");
      };
    } catch (err) {
      console.log(err)
      setUploadError("Ошибка при загрузке изображения");
    } finally {
      setIsProcessing(false);
    }
  };

  if (uploadedImagePath) {
    return (
      <EditorPage
        uploadedImagePath={uploadedImagePath}
        logUser={logUser}
        setUploadedImagePath={setUploadedImagePath}
        handleUploadedImagePath={handleUploadedImagePath}
        setLogUser={setLogUser}
      />
    );
  }

  return (
    <div className="upload-page">
      <div className="upload-page-heading">
        Загрузите изображение для анализа
      </div>

      <div className="upload-area">
        <img className="upload-area-img" 
          src="src/images/upload-img.png"
        />

        {!file && !isProcessing && (
          <div className="upload-container">
            <div className="upload-ask">
              Загрузите файл на платформу
            </div>
            <label className="upload-btn">
              Выбрать файл
              <input
                key={inputKey}
                type="file"
                accept="image/png"
                onChange={handleFileChange}
                hidden
              />
            </label>
            <ul className="upload-limit">
              <li>
                Доступна загрузка изображения формата .png
              </li>
              <li>
                Максимальный размер файла 100 Мб
              </li>
            </ul>
          </div>
        )}
        
        {file && !isProcessing && (
          <div className="uploaded-img">
            <div className="uploaded-img-info">
              <div className="uploaded-img-name">
                {file.name}
              </div>

              <div className="upload-img-success">
                <img className="uploaded-img-icon" 
                  src="src/images/done.png"
                />
                <div className="uploaded-img-text">
                  Загрузка завершена
                </div>
                <img className="uploaded-img-delete" 
                  src="src/images/delete.png"
                  onClick={() => setFile(null)}
                />
              </div>
            </div>

            <div className="analysis-text">
              Убедитесь, что файл выбран верно, и начните анализ
            </div>            

            <div className="analysis-btn" 
              onClick={toAnalyse}
            >
              Начать анализ
            </div>
          </div>
        )}

        {isProcessing && (
          <div className="process">
            <div className="process-text">
              Ожидайте: выполняется анализ
            </div>

            <img className="process-img" 
              src="src/images/loading.png"
            />
          </div>
        )}

        {uploadError && (
          <div className="upload-error">
            {uploadError}
          </div>
        )}
      </div>
    </div>
  );
};
  
export default ImagePage;