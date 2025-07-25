// app/user/layout.js
import UserHeader from "../Components/UserHeader";

export default function UserLayout({ children }) {
  return (
    <>
      <UserHeader />
      {children}
    </>
  );
}
