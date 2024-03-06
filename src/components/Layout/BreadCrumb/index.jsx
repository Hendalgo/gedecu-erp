import { useLocation } from "react-router-dom";
import breadCrumbMap from "../../../consts/breadcrumb";
import "./BreadCrumb.css";
import BackButton from "../BackButton";

export default function BreadCrumb() {
  const location = useLocation();
  let paths = location.pathname.split("/").filter((path) => path);
  const enable = paths.length > 2;
  paths = paths.filter((path) => isNaN(path));
  const breadCrumb = paths.reduce((acc, path, index, arr) => {
        
    if (breadCrumbMap.has(path)) {
      if ((index + 1) == arr.length) {
        acc.push(
          breadCrumbMap.get(path),
        );    
      } else {
        acc.push(
          breadCrumbMap.get(path),
          " / "
        );
      }
    }

    return acc;
  }, [])

  return (
    <div className="">
      {
        enable &&
        <BackButton />
      }
      {
        breadCrumb.map((path, index, arr) => {
          if (index + 1 == arr.length) {
            return <span key={index} className="BreadCrumb current">{path}</span>
          } else {
            return <span key={index} className="BreadCrumb">{path}</span>
          }
        })
      }
    </div>
  );
}