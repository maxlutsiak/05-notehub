import { createPortal } from "react-dom";
import css from "./Loader.module.css";

export default function Loader() {
  return createPortal(<p className={css.loader}></p>, document.body);
}