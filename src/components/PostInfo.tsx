import Image from "next/image";

const PostInfo = () => {
  return (
    <div className="cursor-pointer w-4 h-4 relative">
      <Image src="icons/infoMore.svg" alt="" width={16} height={16} />
    </div>
  );
};

export default PostInfo;
