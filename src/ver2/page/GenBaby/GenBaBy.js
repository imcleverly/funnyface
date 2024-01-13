import { useEffect, useRef, useState } from "react";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import "./GenBaby.css";
import useLoading from "../../hooks/useLoading";

import { loadModels, uploadImage, validImage } from "../../../library/faceapi";
import { createEvent, getMyDetailUser } from "../../../utils/getDataCommon";

import Header from "../../components/Header/Header";

import add from "../../components/image/add.png";
import boysmall from "../../components/image/boy-small.png";
import girlsmall from "../../components/image/girl-small.png";
import iconGenBaby from "../../components/image/icon-genbaby.png";
import imgBg from "../../components/image/love-bg.png";

const GenBaby = () => {
  const [imageBaby, setImageBaby] = useState(null);
  const [isBaby, setIsBaby] = useState(false);

  const { setIsLoading } = useLoading();

  const [showImg, setShowImg] = useState({ imgNam: null, imgNu: null });
  const [sameFace, setSameFace] = useState({
    sameNam: null,
    sameNu: null,
  });
  const [srcImage, setSrcImage] = useState({
    srcNam: null,
    srcNu: null,
  });

  const [name, setName] = useState({ male: "", female: "" });

  const inputNuRef = useRef();
  const inputNamRef = useRef();

  const [filled, setFilled] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (filled < 100 && isRunning) {
      setTimeout(() => setFilled((prev) => (prev += 2)), 100);
    }
  }, [filled, isRunning]);

  useEffect(() => {
    loadModels();
  }, []);

  const handleChangeName = (e) => {
    setName({ ...name, [`${e.target.name}`]: e.target.value });
  };

  const handleChangeImage = async (e, typeImg = "Nam") => {
    let file = e.target.files[0];
    const imageUrl = URL.createObjectURL(file);
    if (!file) return;

    setIsLoading(true);

    try {
      const res = await validImage(URL.createObjectURL(file));

      if (res.length == 0) {
        resetInput();
        return Swal.fire(
          "Oops...",
          "No faces can be recognized in the photo!!",
          "warning"
        );
      }
      if (res.length > 1) {
        resetInput();
        return Swal.fire(
          "Oops...",
          "Photos must contain only one face!!",
          "warning"
        );
      }

      if (
        sameFace.sameNam === res[0]?.detection?._score ||
        sameFace.sameNu === res[0]?.detection?._score
      ) {
        resetInput();
        return Swal.fire("Oops...", "Photos cannot be the same!!", "warning");
      } else
        setSameFace((prevState) => ({
          ...prevState,
          [`same${typeImg}`]: res[0]?.detection?._score,
        }));

      setIsLoading(false);

      setShowImg({ ...showImg, [`img${typeImg}`]: imageUrl });

      const imageUpload = await uploadImage(file, typeImg);
      if (!imageUpload) return;

      setSrcImage((prev) => ({ ...prev, [`src${typeImg}`]: imageUpload }));
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const handleDownloadImage = async () => {
    setIsLoading(true);
    try {
      const fileName = imageBaby.split("/").pop();

      await saveAs(imageBaby, fileName);
    } catch (error) {
      toast.error("Error: " + error.message);
      console.log({ err: error.message });
    }
    setIsLoading(false);
  };

  const resetInput = () => {
    setIsLoading(false);
    setSrcImage({ srcNam: null, srcNu: null });

    inputNuRef.current.value = "";
    inputNamRef.current.value = "";
    return;
  };

  //   fetch genbaby

  const fetchData = async () => {
    const { srcNam, srcNu } = srcImage;
    const { male, female } = name;

    if (srcNam == null || srcNu == null)
      return Swal.fire("Oops...", "Please choose the image!!", "warning");

    if (male.trim() === "" || female.trim() === "")
      return Swal.fire("Oops...", "Please choose name completed!!", "warning");

    setIsLoading(true);
    setIsRunning(true);

    try {
      const device = await getMyDetailUser();
      const res3 = await createEvent(srcNam, srcNu, device.browser, device.ip);

      if (res3 && res3.error) {
        setIsLoading(false);
        return Swal.fire("Oops...", res3.error, "warning");
      }

      setIsLoading(false);
      toast.success("Upload and save data completed successfully!!");

      const imageBaby = res3.success.sukien_baby[0].link_da_swap;
      setImageBaby(imageBaby);
      setIsBaby(true);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };

  return (
    <>
      <Header
        data={{
          title: "baby generator",
        }}
      />
      <div
        style={{ backgroundImage: `url(${imgBg})`, minHeight: "100vh" }}
        className="relative bg-no-repeat bg-cover genbaby"
      >
        {isRunning && !isBaby && (
          <div className="absolute z-50 progressbar -translate-x-2/4 left-2/4 top-5">
            <div
              style={{
                height: "100%",
                width: `${filled}%`,
                backgroundColor: "#a66cff",
                transition: "width 0.5s",
              }}
            ></div>
            <span className="progressPercent">{filled}%</span>
          </div>
        )}

        <div className="flex justify-between genbaby-content">
          <div className="genbaby-item">
            <div className="genbaby-small">
              <img src={boysmall} alt="" />
            </div>

            <div className="genbaby-main">
              <div className="genbaby-upload-image genbaby-boy">
                <img className="genbaby-icon-add" src={add} alt="" />

                <div
                  className="genbaby-img"
                  style={
                    showImg.imgNam
                      ? { backgroundImage: `url(${showImg.imgNam})` }
                      : null
                  }
                ></div>

                <input
                  onChange={(e) => {
                    handleChangeImage(e, "Nam");
                  }}
                  type="file"
                  accept="image/*"
                  ref={inputNamRef}
                />
              </div>

              <div className="genbaby-name genbaby-boy">
                <input
                  name="male"
                  onChange={handleChangeName}
                  type="text"
                  placeholder="His name"
                />
              </div>
            </div>
          </div>

          <button
            onClick={() => fetchData()}
            className="transition-transform duration-300 hover:scale-125"
          >
            <img
              src={iconGenBaby}
              alt=""
              className="cursor-pointer genbaby-heart"
            />
          </button>

          <div className="genbaby-item">
            <div className="genbaby-small">
              <img src={girlsmall} alt="" />
            </div>

            <div className="genbaby-main">
              <div className="genbaby-upload-image genbaby-girl">
                <img className="genbaby-icon-add" src={add} alt="" />

                <div
                  className="genbaby-img"
                  style={
                    showImg.imgNu
                      ? { backgroundImage: `url(${showImg.imgNu})` }
                      : null
                  }
                ></div>

                <input
                  onChange={(e) => {
                    handleChangeImage(e, "Nu");
                  }}
                  type="file"
                  accept="image/*"
                  ref={inputNuRef}
                />
              </div>

              <div className="genbaby-name genbaby-girl">
                <input
                  name="female"
                  onChange={handleChangeName}
                  type="text"
                  placeholder="Her name"
                />
              </div>
            </div>
          </div>
        </div>

        {isBaby && (
          <div className={`genbaby-canvas`}>
            <div className="genbaby-square">
              <div className="genbaby-square-left" />
              <div className="genbaby-square-right" />
            </div>

            <div className="genbaby-down">
              <span className="genbaby-down-left" />
              <span className="genbaby-down-right" />
            </div>

            <div className="genbaby-canvas-image">
              <img src={imageBaby} alt="image baby" />
            </div>
          </div>
        )}

        <div className="transition-transform duration-300 genbaby-btn hover:scale-125 ">
          {!isBaby ? (
            <button onClick={fetchData} className="text-4xl genbaby-btn-start">
              Start
            </button>
          ) : (
            <button
              className="text-4xl genbaby-btn-download"
              onClick={handleDownloadImage}
            >
              Download image
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default GenBaby;
