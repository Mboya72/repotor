import Image from "/next/image";
import Signup from "./signup/page.js";
import Signin from "./signin/page.js"

export default function Home() {
  return (
    <div className="grid">
      <Signup/>
    </div>
  );
}
