import Link from "next/link";
// import PopularTags from "./PopularTags";
import Recommendations from "./Recommendations";
import Search from "./Search";
import { User } from "../types";

const RightBar = ({ recommendations, user }: {recommendations:User[], user:User}) => {
  return (
    <div className="pt-4 flex flex-col gap-4 sticky top-0 h-max">
      <Search />
      {/* <PopularTags /> */}
      <Recommendations  recommendations={recommendations} user={user} />
      <div className="text-textGray text-sm flex gap-x-4 flex-wrap">
        <Link href="/">Terms of Service</Link>
        <Link href="/">Privacy Policy</Link>
        <Link href="/">Cookie Policy</Link>
        <Link href="/">Accessibility</Link>
        <Link href="/">Ads Info</Link>
        <span>© 2025 L Corp.</span>
      </div>
    </div>
  );
};

export default RightBar;
