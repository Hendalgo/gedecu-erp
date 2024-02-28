import { useLocation } from "react-router-dom";
import breadCrumbMap from "../../../consts/breadcrumb";
import "./BreadCrumb.css";

export default function BreadCrumb() {
  const location = useLocation();
  const paths = location.pathname.split("/").filter((path) => path && isNaN(path));
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