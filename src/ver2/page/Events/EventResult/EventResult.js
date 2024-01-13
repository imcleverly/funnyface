import React, { useEffect, useState } from "react";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

import { NavLink } from "react-router-dom";

import axios from "axios";
import { useParams } from "react-router";
import no_avatar from "../../../components/image/no-avatar.png";
import CommonEvent from "../../app/CommonEvent";
import EmptyTemplate from "../../app/template/EmptyTemplate";

import AddCircleIcon from "@mui/icons-material/AddCircle";
import headerbg from "../../../../ver2/components/image/bg-header.png";
import Header from "../../../components/Header/Header";
import "./EventResult.css";

export default function EventResult() {
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const params = useParams();
  const id = params.id;
  const stt_su_kien = params.stt;

  const [dataUser1, setDataUser1] = useState(null);

  const [isActive, setIsActive] = useState(1);
  const [isOpenSidebar, setIsOpenSidebar] = useState(false);

  const [dataComment, setDataComment] = useState([]);

  // Show cmt
  const [showMoreStates, setShowMoreStates] = useState({});
  const showCmt = (id) => {
    setShowMoreStates((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const userInfo = JSON.parse(window.localStorage.getItem("user-info"));
  const id_user = userInfo?.id_user;

  const fetchDataUser = async () => {
    try {
      const response = await axios.get(
        `https://metatechvn.store/lovehistory/${id}`
      );
      setDataUser1(response.data.sukien);
      console.log(response.data.sukien);
    } catch (err) {
      console.log(err);
    }
  };

  const redirect = (e) => {
    setIsActive(e);
    setIsOpenSidebar(false);
  };

  useEffect(() => {
    fetchDataUser();
    const currentTab = parseInt(stt_su_kien);
    setIsActive(currentTab);
  }, []);

  const handleOpenImagePopup = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsImagePopupOpen(true);
  };

  return (
    <>
      <Header
        data={{
          background: `center/cover no-repeat url(${headerbg})`,
          title: "events",
          download: true,
          events: true,
          myEvent: true,
        }}
      />
      <div className="min-h-screen overflow-hidden events">
        <div className="events-main">
          <div
            className={`lg:w-1/4 z-[10] lg:block ${
              isOpenSidebar
                ? "col-span-8 sm:col-span-6 transition-all transform duration-300 ease-linear block opacity-100 absolute top-0 left-0 bottom-0 h-full overflow-auto"
                : "transition-all transform hidden duration-300 ease-out "
            }`}
            style={{
              overflowY: "auto",
            }}
          >
            <ul className="events-menu">
              <li className="events-menu-item events-menu-add">
                <NavLink to={`/events/add`} onClick={() => redirect(0)}>
                  <AddCircleIcon /> Add new event
                </NavLink>
              </li>

              {dataUser1 &&
                dataUser1.map((item, index) => (
                  <li className="events-menu-item" key={index}>
                    <NavLink
                      to={`/events/${id}/${item.so_thu_tu_su_kien}`}
                      onClick={() => redirect(item.so_thu_tu_su_kien)}
                    >
                      {item.ten_su_kien}
                    </NavLink>
                  </li>
                ))}
            </ul>
          </div>
          <div className="w-full min-h-screen lg:w-3/4">
            <aside className="events-content">
              {isActive === 0 ? (
                <EmptyTemplate />
              ) : (
                dataUser1 &&
                dataUser1.map(
                  (item, index) =>
                    isActive === item.so_thu_tu_su_kien && (
                      <CommonEvent key={index} stt={item.so_thu_tu_su_kien} />
                    )
                )
              )}
            </aside>
            <div className="flex items-center justify-between overflow-auto lg:hidden">
              {dataUser1 &&
                dataUser1.map((item, index) => (
                  <li
                    key={index}
                    className={`cursor-pointer flex  text-center justify-center items-center hover:bg-[#782353] rounded-3xl lg:py-10 lg:px-36 py-6 px-2 ${
                      isActive === item.so_thu_tu_su_kien
                        ? "bg-[#782353] text-white"
                        : ""
                    }`}
                    onClick={() => redirect(item.so_thu_tu_su_kien)}
                  >
                    {item.ten_su_kien}
                  </li>
                ))}
            </div>

            <div className="flex flex-col pt-10 mb-16 w-full font-[Montserrat] ">
              {dataComment.map((item, index) => {
                const isShowingFullText = showMoreStates[item.id_comment];
                if (index < 1) {
                  return (
                    <div className="flex flex-col px-4 py-3 mx-4 border border-gray-400 rounded-md shadow-md gap-y-4 hover:bg-gray-100">
                      <div className="flex items-center gap-x-4">
                        {item.avatar_user &&
                        item.avatar_user.startsWith("http") ? (
                          <img
                            src={item.avatar_user}
                            alt=""
                            className="w-16 h-16 rounded-full"
                          />
                        ) : (
                          <img
                            src={no_avatar}
                            alt=""
                            className="w-16 h-16 rounded-full"
                          />
                        )}
                        <div className="flex-grow">
                          <h3 className="text-3xl font-semibold">
                            {item.user_name ? item.user_name : "Guest"}
                          </h3>
                          <div className="text-2xl font-normal break-words">
                            <span
                              className={
                                isShowingFullText ? "text-base" : "text-xl"
                              }
                            >
                              {isShowingFullText
                                ? item.noi_dung_cmt
                                : `${item.noi_dung_cmt.substring(0, 260)}`}
                            </span>
                            {item.noi_dung_cmt.length > 256 && (
                              <span
                                className="text-base cursor-pointer hover:underline"
                                onClick={() => showCmt(item.id_comment)}
                                style={{ color: "blue" }}
                              >
                                {isShowingFullText ? "UnLess" : "Show more"}
                              </span>
                            )}
                          </div>
                          {item.imageattach && (
                            <img
                              src={item.imageattach}
                              className="w-[150px] h-[120px] mt-[10px] cursor-pointer"
                              alt="avt"
                              onClick={() =>
                                handleOpenImagePopup(item.imageattach)
                              }
                            />
                          )}
                        </div>
                      </div>
                      <div className="flex flex-row justify-end gap-x-4">
                        <div className="text-lg text-gray-600">
                          {item.device_cmt}
                        </div>
                        <div className="text-lg text-gray-600">
                          {item.thoi_gian_release}
                        </div>
                        <div className="text-lg text-gray-600">
                          <p>{item.dia_chi_ip}</p>
                          <p>{item.location}</p>
                        </div>
                      </div>
                    </div>
                  );
                }
              })}
              {dataComment.length > 10 && (
                <div className="flex items-center justify-center mt-4 text-lg">
                  <span className="text-blue-700 cursor-pointer">
                    View all comments
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isImagePopupOpen && (
        <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-75">
          <div className="max-w-screen-xl w-80% p-4 bg-white rounded-lg shadow-lg text-center relative">
            <button
              onClick={() => setIsImagePopupOpen(false)}
              className="absolute top-0 right-0 px-2 py-1 mt-2 mr-2 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600"
            >
              Close
            </button>
            <img
              src={selectedImage}
              alt="Ảnh lớn"
              className="h-auto mx-auto w-100 z-99999"
              style={{ maxHeight: "80vh" }}
            />
          </div>
        </div>
      )}
    </>
  );
}
