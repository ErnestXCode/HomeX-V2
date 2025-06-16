import React from "react";
import { useSelector } from "react-redux";
import { selectSidebarState } from "../features/stylings/styleSlice";

const SideNavLayout = ({onClick, children}) => {
    const sideBarState = useSelector(selectSidebarState);
// onClick={onClick} 
  return (
    <div className={`bg-black/50 fixed inset-0 z-30
    transition-opacity duration-500  ${
    sideBarState ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
    }
    `}>
    <div
      className={`flex flex-col bg-gray-950 items-start fixed right-0 top-0 h-screen min-w-70 
        p-5 transition duration-500
        ${sideBarState ? 'translate-x-0' : 'translate-x-full'}`}
        >
            {children}
        </div>
</div>
  );
};

export default SideNavLayout;
