import { FaGithub } from "react-icons/fa";
const Evie = () => {
  return (
    <a href="https://github.com/eviecamila" target="_blank">
      <div className="w-full text-center">
        No olvides seguirme en Github: &nbsp;
        <button className="mt-2 text-purple-700 hover:text-green-700 text-xl">
          <FaGithub />
        </button>{" "}
        EvieCamila
      </div>
    </a>
  );
};
export default Evie;
