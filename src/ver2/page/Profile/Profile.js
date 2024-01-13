import { useEffect, useId, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

import useLoading from "../../hooks/useLoading";
import useAuth from "../../hooks/useAuth";
import useProfile from "../../hooks/useProfile";
import { uploadImg, changeAvatar } from "../../services/user.service";

import SideBarMobile from "../../components/SideBar/SideBarMobile";
import EditModal from "./components/EditModal";
import sideBarIcon from "../../components/image/sideBar/SideBarIcon.svg";
import sideBarIconActive from "../../components/image/sideBar/SideBarIconActive.svg";
import settingIcon from "../../components/image/profile/SettingIcon.svg";
import settingIconActive from "../../components/image/profile/SettingIconActive.svg";

const MAX_FILE_SIZE = 10485760;

function Profile() {
  const [openSideBarMobile, setOpenSideBarMobile] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [hover, setHover] = useState({
    sideBar: false,
    edit: false,
    setting: false,
  });

  const navigate = useNavigate();
  const labelRef = useRef();
  const inputId = useId();

  const { setIsLoading } = useLoading();
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

  const checkUser = () => {
    if (!user.id_user) {
      toast.warn("Login to view your profile");
      navigate("/");
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  return (
    <div className="relative bg-custom-gray flex flex-col items-center gap-4 rounded-lg overflow-hidden font-[Quicksand] gap-3 pb-6">
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
          onClick={() => labelRef.current?.click()}
        >
          <img
            src={user.link_avatar}
            alt="Avatar"
            className="w-full h-full hover:opacity-50"
          />
          <div className="absolute opacity-50 bottom-0 left-0 flex justify-center items-center w-full bg-neutral-600 text-white">
            Edit
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col px-4">
        <div className="flex justify-between text-white">
          <span className="text-4xl font-semibold">@{user.user_name}</span>
          <div className="flex items-center gap-4">
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
