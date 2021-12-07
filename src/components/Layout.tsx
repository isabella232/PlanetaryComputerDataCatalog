import { ReactNode } from "react";
import { ScrollToTopOnMount } from "./ScrollToTopOnMount";

interface Props {
  bannerHeader?: ReactNode;
  bannerFooter?: ReactNode;
  isShort?: boolean;
  onGrid?: boolean;
  allowAnnouncement?: boolean;
}

const Layout: React.FC<Props> = ({
  bannerHeader = null,
  bannerFooter = null,
  isShort = false,
  onGrid = true,
  children,
  allowAnnouncement = true,
}) => {
  return (
    <>
      <ScrollToTopOnMount />
      <main className={isShort ? "short" : undefined}>{children}</main>
      {bannerFooter}
    </>
  );
};

export default Layout;
