import React from "react";
import { useRouter } from "next/router";
import { cn } from "@/lib/tailwindcss";
import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { Menu } from "@/config/allAppPath";
import Image from "next/image";
import { Key } from "react";

interface NavbarProps {
  menuList: Menu[];
}

interface SubMenu {
  path: string;
  title: string;
  routePath: string;
  icon?: {
    src: string;
  };
}

export const CustomNavbar: React.FC<NavbarProps> = ({ menuList }) => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center font-gliker">
      <Image
        width={139}
        height={66}
        alt="hanging rope"
        className="mb-[-20px]"
        src="/images/header/hanging-rope.svg"
      />
      <div className="bg-[#FFCD4D] rounded-xl flex flex-col py-4 px-3 border-[1.5px] border-[#010101] shadow-[2px_4px_0px_0px_#FFF]">
        <div className="flex gap-2 py-1">
          {menuList.map((menu) =>
            Array.isArray(menu.path) ? (
              <Dropdown 
                key={menu.title} 
                placement="bottom-start"
                classNames={{
                  content: "bg-transparent p-0"
                }}>
                <DropdownTrigger>
                  <Button
                    className={cn(
                      "min-h-[32px] h-8 py-0 font-bold bg-transparent text-black hover:bg-[#202020] hover:text-white",
                      (menu.path as SubMenu[]).some(item => item.routePath === router.pathname)
                        ? "bg-[#202020] text-white"
                        : ""
                    )}
                  >
                    {menu.title}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label={menu.title}
                  className="bg-[#FFCD4D] rounded-lg p-2"
                  onAction={(key: Key) => {
                    const subMenu = (menu.path as SubMenu[]).find(
                      (item: SubMenu) => item.routePath === key
                    );
                    if (subMenu) {
                      router.push(subMenu.path);
                    }
                  }}
                >
                  {(menu.path as SubMenu[]).map((subMenu: SubMenu) => (
                    <DropdownItem
                      key={subMenu.routePath}
                      className={cn(
                        "font-bold data-[hover=true]:bg-[#202020] data-[hover=true]:text-white p-2",
                        router.pathname === subMenu.routePath
                          ? "bg-[#202020] text-white"
                          : "text-[#202020]"
                      )}
                      startContent={
                        subMenu.icon && (
                          <Image
                            src={subMenu.icon.src}
                            alt={subMenu.title}
                            width={16}
                            height={16}
                            className="w-4 h-4"
                          />
                        )
                      }
                    >
                      {subMenu.title}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            ) : (
              <Button
                key={menu.title}
                className={cn(
                  "min-h-[32px] h-8 py-0 font-bold bg-transparent text-black hover:bg-[#202020]/70 hover:text-white",
                  menu.routePath === router.pathname ? "bg-[#202020] text-white" : ""
                )}
                onPress={() => {
                  if (typeof menu.path === "string") {
                    router.push(menu.path);
                  }
                }}
              >
                {menu.title}
              </Button>
            )
          )}
        </div>
      </div>
    </div>
  );
};
