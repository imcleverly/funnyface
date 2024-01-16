import { useEffect, useId, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import useLoading from "../../hooks/useLoading";
import useAuth from "../../hooks/useAuth";
import useProfile from "../../hooks/useProfile";
import {
  uploadImg,
  changeAvatar,
  getUserById,
} from "../../services/user.service";
import { getAllEventsByUserId } from "../../services/event.service";
import { getAllCommentsByUserId } from "../../services/comment.service";

import SideBarMobile from "../../components/SideBar/SideBarMobile";
import EditModal from "./components/EditModal";
import EventItem from "../../components/Event/EventItem";
import CommentItem from "../../components/Comment/CommentItem";
import sideBarIcon from "../../components/image/sideBar/SideBarIcon.svg";
import sideBarIconActive from "../../components/image/sideBar/SideBarIconActive.svg";
import settingIcon from "../../components/image/profile/SettingIcon.svg";
import settingIconActive from "../../components/image/profile/SettingIconActive.svg";
import PaginationsButton from "../../components/Paginations/PaginationsButton";

const MAX_FILE_SIZE = 10485760;

function Profile() {
  const [openSideBarMobile, setOpenSideBarMobile] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [hover, setHover] = useState({
    sideBar: false,
    edit: false,
    setting: false,
  });
  const [userView, setUserView] = useState(null);
  const [events, setEvents] = useState([]);
  const [comments, setComments] = useState([]);
  const [currentPage, setCurrentPage] = useState({
    event: 1,
    comment: 1,
  });
  const nums = { event: 2, comment: 4 };
  const pages = {
    event: Math.ceil(events.length / nums.event),
    comment: Math.ceil(comments.length / nums.comment),
  };

  const setEventPage = (item) => {
    setCurrentPage({ ...currentPage, event: item });
  };

  const setCommentPage = (item) => {
    setCurrentPage({ ...currentPage, comment: item });
  };

  const navigate = useNavigate();
  const labelRef = useRef();
  const inputId = useId();

  const { setIsLoading } = useLoading();
  const { id } = useParams();
  const { user } = useAuth();
  const { updateProfileAvatar } = useProfile();

  const setHoverChange = (item) => {
    setHover({ ...hover, ...item });
  };

  const handleAvatarChange = async (e) => {
    setIsLoading(true);
    try {
      const file = e.target.files[0];

      if (!file) throw new Error("Avatar not found");

      if (file.size > MAX_FILE_SIZE) throw new Error("Max file size is 10MB");

      const formData = new FormData();
      formData.append("src_img", file);

      const uploadResponse = await uploadImg(formData);
      const imgUploadSrc = uploadResponse.data;

      if (imgUploadSrc?.message) throw new Error(imgUploadSrc.message);

      formData.append("link_img", imgUploadSrc);
      formData.append("check_img", "upload");

      const response = await changeAvatar(user.id_user, formData);

      if (!response) throw new Error("Change avatar fail");

      const avatarUrl = response.data.link_img;
      updateProfileAvatar(avatarUrl);
      toast.success("Update avatar success");
    } catch (error) {
      toast.error("Error: " + error.message);
    }
    setIsLoading(false);
  };

  const checkUser = async () => {
    if (!user.id_user && !id) {
      toast.warn("Login to view your profile");
      navigate("/");
    }

    if (id) {
      try {
        const responseUser = await getUserById(id);

        const userInfor = responseUser?.data;

        if (!userInfor?.id_user) throw new Error();

        setUserView({
          ...userInfor,
          link_avatar: userInfor.link_avatar.replace(
            "/var/www/build_futurelove/",
            "https://futurelove.online/"
          ),
        });

        await getEventsAndComments(id);
      } catch (err) {
        toast.warn("Not found user with id " + id);
        navigate("/");
      }
    } else {
      await getEventsAndComments(user.id_user);
    }
  };

  const getEventsAndComments = async (id) => {
    setIsLoading(true);
    try {
      const responseEvent = await getAllEventsByUserId(id);
      const responseCmt = await getAllCommentsByUserId(id);

      const userEvents = responseEvent?.data;
      const userComments = responseCmt?.data;

      setEvents(userEvents.list_sukien);
      setComments(userComments.comment_user);
    } catch (err) {
      toast.warn("Error while trying to get events & comments: " + err.message);
      navigate("/");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    checkUser();
  }, [id]);

  return (
    <div className="relative bg-custom-gray flex flex-col items-center rounded-lg overflow-hidden font-[Quicksand] gap-3 pb-6">
      <label htmlFor={inputId} ref={labelRef} className="hidden" />
      <input
        id={inputId}
        className="hidden"
        type="file"
        multiple
        accept="image/*"
        onChange={handleAvatarChange}
      />
      <SideBarMobile
        openMenu={openSideBarMobile}
        setOpenMenu={setOpenSideBarMobile}
      />
      <div
        className="block lg:hidden absolute top-6 left-6 cursor-pointer"
        onClick={() => setOpenSideBarMobile(true)}
        onMouseEnter={() => setHoverChange({ sideBar: true })}
        onMouseLeave={() => setHoverChange({ sideBar: false })}
      >
        <img
          src={hover.sideBar ? sideBarIconActive : sideBarIcon}
          alt="Menu"
          className="w-[32px] h-[32px]"
        />
      </div>

      <div className="w-full h-[35vh] flex justify-center md:justify-start items-end bg-gray-400 ">
        <div
          className="relative w-[100px] h-[100px] rounded-full overflow-hidden hover:bg-neutral-800 cursor-pointer md:ml-12 mb-5"
          onClick={() => (!userView ? labelRef.current?.click() : null)}
        >
          <img
            src={userView?.link_avatar || user.link_avatar}
            alt="Avatar"
            className="w-full h-full hover:opacity-50"
          />
          <div
            className={`${
              userView ? "hidden" : null
            } absolute opacity-50 bottom-0 left-0 flex justify-center items-center w-full bg-neutral-600 text-white`}
          >
            Edit
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col px-4 gap-3">
        <div className="flex justify-between text-white">
          <span className="text-4xl font-semibold">
            @{userView?.user_name || user.user_name}
          </span>
          <div
            className={`${userView ? "hidden" : null} flex items-center gap-4`}
          >
            <button
              className={`py-3 px-6 text-2xl font-semibold rounded-xl ${
                hover.edit ? "bg-green-400 text-white" : "bg-white text-black"
              }`}
              onClick={() => setOpenEditModal(true)}
              onMouseEnter={() => setHoverChange({ edit: true })}
              onMouseLeave={() => setHoverChange({ edit: false })}
            >
              Edit profile
            </button>
            <div
              className="w-12 h-12 cursor-pointer"
              onMouseEnter={() => setHoverChange({ setting: true })}
              onMouseLeave={() => setHoverChange({ setting: false })}
            >
              <img
                src={hover.setting ? settingIconActive : settingIcon}
                alt="Setting"
                className="w-full g-full bg-cover"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 py-4">
          <div className="flex gap-10 text-white font-semibold text-2xl">
            <span>{userView?.count_sukien || user.count_sukien} events</span>

            <span>{userView?.count_view || user.count_view} views</span>
            <span>
              {userView?.count_comment || user.count_comment} comments
            </span>
          </div>
          <div className="w-full h-[2px] bg-gray-400 opacity-20" />
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-11 max-w-full gap-20 lg:gap-10 text-white">
            <div className="grid grid-cols-subgrid grid-cols-1 lg:col-span-7 gap-10">
              <h3 className="uppercase text-2xl md:text-4xl font-semibold">
                Events
              </h3>
              {!!!events?.length ? (
                <span className="text-xl">You don't have any events yet.</span>
              ) : (
                events
                  .slice(
                    nums.event * (currentPage.event - 1),
                    nums.event * currentPage.event
                  )
                  .map((item, index) => (
                    <EventItem key={index} {...item.sukien[0]} />
                  ))
              )}
              {events?.length > 2 && (
                <PaginationsButton
                  page={currentPage.event}
                  totalPages={pages.event}
                  setPage={setEventPage}
                />
              )}
            </div>

            <div className="flex flex-col lg:col-span-4 gap-4">
              <h3 className="text-white uppercase text-2xl md:text-4xl font-semibold">
                Comments
              </h3>
              {!!!comments?.length ? (
                <span className="text-xl">
                  You don't have any comments yet.
                </span>
              ) : (
                comments
                  .slice(
                    nums.comment * (currentPage.comment - 1),
                    nums.comment * currentPage.comment
                  )
                  .map((item, index) => <CommentItem key={index} {...item} />)
              )}
              {comments?.length > 4 && (
                <PaginationsButton
                  page={currentPage.comment}
                  totalPages={pages.comment}
                  setPage={setCommentPage}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <EditModal
        openEditModal={openEditModal}
        setOpenEditModal={setOpenEditModal}
        user={user}
        labelRef={labelRef}
      />
    </div>
  );
}

export default Profile;
