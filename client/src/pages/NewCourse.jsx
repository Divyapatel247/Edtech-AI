import VideoLink from "../components/VideoLink";
import VideoUpload from "../components/VideoUpload";

export const NewCourse = () => {
  return (
    <div className="flex justify-start items-start m-4 ">
      <VideoUpload />
      <div className="flex flex-col w-1/4  px-5">
        {" "}
        <VideoLink />{" "}
      </div>
    </div>
  );
};
