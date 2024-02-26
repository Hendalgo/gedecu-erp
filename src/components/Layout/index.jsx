import BreadCrumb from "./BreadCrumb";
import UserProfileButton from "./UserProfileButton";

export default function Layout({
    children = null
}) {
    return (
        <>
            <header className="d-flex justify-content-between align-items-center bg-white py-3 px-4 border-bottom">
                <div className="col-6">
                    <BreadCrumb />
                </div>
                <div className="col-4">
                    <UserProfileButton />
                </div>
            </header>
            {
                children
            }
        </>
    );
}