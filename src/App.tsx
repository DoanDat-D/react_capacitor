import React, { useState } from "react";
import { LocalNotifications } from "@capacitor/local-notifications";
import { Share } from "@capacitor/share";
import { Camera, CameraResultType } from "@capacitor/camera";
import "./App.css"; // Import CSS

const BMIApp = () => {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBmi] = useState<number | null>(null);
  const [category, setCategory] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);

  const calculateBMI = () => {
    const h = parseFloat(height) / 100;
    const w = parseFloat(weight);

    if (!h || !w || h <= 0 || w <= 0) {
      alert("Vui lòng nhập chiều cao và cân nặng hợp lệ.");
      return;
    }

    const bmiValue: number = Number((w / (h * h)).toFixed(2));

    let cat = "";
    if (bmiValue < 18.5) cat = "Gầy";
    else if (bmiValue < 24.9) cat = "Bình thường";
    else if (bmiValue < 29.9) cat = "Thừa cân";
    else cat = "Béo phì";

    setBmi(bmiValue);
    setCategory(cat);

    sendNotification(bmiValue, cat);
  };

  const sendNotification = async (bmiValue: number, cat: string) => {
    await LocalNotifications.schedule({
      notifications: [
        {
          title: "Kết quả BMI",
          body: `Chỉ số BMI của bạn: ${bmiValue} - ${cat}`,
          id: new Date().getTime(),
        },
      ],
    });
  };

  const shareResult = async () => {
    if (bmi === null) return;
    await Share.share({
      title: "Chia sẻ kết quả BMI",
      text: `Chỉ số BMI của tôi: ${bmi} - ${category}`,
      dialogTitle: "Chia sẻ BMI",
    });
  };

  const takePhoto = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
      });
      setPhoto(image.dataUrl || null);
    } catch (error) {
      console.error("Lỗi khi chụp ảnh:", error);
    }
  };

  return (
    <div className="container">
      <h1>Tính BMI</h1>
      <input
        type="number"
        placeholder="Chiều cao (cm)"
        value={height}
        onChange={(e) => setHeight(e.target.value)}
      />
      <input
        type="number"
        placeholder="Cân nặng (kg)"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
      />
      <button onClick={calculateBMI}>Tính BMI</button>
      {bmi !== null && (
        <p className="result">
          BMI: {bmi} - {category}
        </p>
      )}
      <button className="share-btn" onClick={shareResult}>Chia sẻ</button>
      <button className="camera-btn" onClick={takePhoto}>Chụp ảnh</button>
      {photo && <img src={photo} alt="Chụp ảnh" className="photo" />}
    </div>
  );
};

export default BMIApp;