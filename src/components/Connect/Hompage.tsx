import Feed from "../MainPage/Feed";
import Share from "../MainPage/Share";
import Link from "next/link";

const Homepage = () => {
  return <div className="">
    <div className='px-4 pt-4 flex justify-between text-textGray font-bold border-b-[1px] border-borderGray'>
      <Link className="pb-3 flex items-center border-b-4 border-[#]" href="/">For you</Link>
      <Link className="pb-3 flex items-center " href="/">Following</Link>
    </div>
    <Share/>
    <Feed/>
  </div>;
};

export default Homepage;
