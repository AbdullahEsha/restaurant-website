import React, { useState, useRef, useEffect, useContext } from "react";
import { Container } from "reactstrap";
import Link from "next/link";
import { useRouter } from "next/router";
import { Store } from "../helpers/Store";
import {
  DownOutlined,
  SmileOutlined,
  UserOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import {
  Drawer,
  List,
  ListItem,
  Divider,
  Typography,
  Box,
  IconButton,
  ListItemText,
} from "@material-ui/core";
import { Dropdown, Space, Menu } from "antd";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { getError } from "../helpers/error";
import Image from "next/image";

const nav__links = [
  {
    display: "Home",
    path: "/",
  },
  {
    display: "Foods",
    path: "/shop",
  },
  {
    display: "Search",
    path: "/search",
  },
  {
    display: "Cart",
    path: "/cart",
  },
  {
    display: "Contact",
    path: "/contact",
  },
];

const items = [
  {
    key: "1",
    label: (
      <a target="_blank" rel="noopener noreferrer" href="/profile">
        Profile
      </a>
    ),
    icon: <UserOutlined />,
  },
  {
    key: "2",
    label: (
      <a target="_blank" rel="noopener noreferrer" href="/order-history">
        Order History
      </a>
    ),
    icon: <SmileOutlined />,
  },
  {
    key: "3",
    label: (
      <a target="_blank" rel="noopener noreferrer" href="/cart">
        My Cart
      </a>
    ),
    icon: <ShoppingCartOutlined />,
  },
];

function Header(props) {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const [user, setUser] = useState("");
  const [userCart, setUserCart] = useState("");
  const { cart, userInfo } = state;
  const headerRef = useRef(null);
  const menuRef = useRef(null);
  const [sidbarVisible, setSidebarVisible] = useState(false);
  const [categories, setCategories] = useState([]);

  const sidebarOpenHandler = () => {
    setSidebarVisible(true);
  };
  const sidebarCloseHandler = () => {
    setSidebarVisible(false);
  };

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`/api/products/categories`);
      setCategories(data);
    } catch (err) {
      toast.error(`${getError(err)}`);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const toggleMenu = () => menuRef.current.classList.toggle("show__menu");

  const headerFunc = () => {
    if (
      document.body.scrollTop > 80 ||
      document.documentElement.scrollTop > 80
    ) {
      headerRef.current.classList.add("header__shrink");
    } else {
      headerRef.current.classList.remove("header__shrink");
    }
  };

  useEffect(() => {
    setUser(userInfo);
  }, [userInfo]);
  useEffect(() => {
    setUserCart(cart);
  }, [cart]);

  useEffect(() => {
    window.addEventListener("scroll", headerFunc);

    return () => {
      window.removeEventListener("scroll", headerFunc);
    };
  }, []);
  return (
    <header className="header" ref={headerRef}>
      <ToastContainer />
      <Container>
        <div className="nav__wrapper d-flex align-items-center justify-content-between">
          <div className="logo">
            <div className="d-flex align-items-center justify-content-between">
              <span className="menu__btn" onClick={sidebarOpenHandler}>
                <i className="ri-menu-line"></i>
              </span>
              <span className="logo__text">
                <Image
                  src="/images/halal-kabab-logo.svg"
                  alt="halal-kabab-logo"
                  className="halal-logo"
                  height={300}
                  width={300}
                />
              </span>
            </div>
          </div>

          {/** SIDEBAR MENU WITH CATEGORY */}
          <Drawer
            anchor="left"
            open={sidbarVisible}
            onClose={sidebarCloseHandler}
            className="drawer__left"
            style={{ zIndex: "9999" }}
          >
            <List>
              <ListItem>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  className="d-flex align-items-center justify-content-center"
                >
                  <Typography>Shopping by category</Typography>
                  <IconButton aria-label="close" onClick={sidebarCloseHandler}>
                    <i className="ri-close-circle-line"></i>
                  </IconButton>
                </Box>
              </ListItem>
              <Divider light />
              {categories.map((category) => (
                <Link
                  key={category}
                  href={`/search?category=${category}`}
                  passHref
                  legacyBehavior
                >
                  <a>
                    <ListItem
                      button
                      component="a"
                      onClick={sidebarCloseHandler}
                    >
                      <ListItemText primary={category}></ListItemText>
                    </ListItem>
                  </a>
                </Link>
              ))}
            </List>
          </Drawer>
          {/** NAVIGATION BAR */}

          <div className="navigation" ref={menuRef} onClick={toggleMenu}>
            <div className="menu d-flex align-items-center gap-5">
              {nav__links.map((item, index) => (
                <Link href={item.path} key={index} legacyBehavior>
                  <a
                    className={(navClass) =>
                      navClass.isActive
                        ? "active__menu text-decoration-none"
                        : "text-decoration-none"
                    }
                  >
                    {item.display}
                  </a>
                </Link>
              ))}
            </div>
          </div>

          {/** RIGHT ICON MENU */}

          <div className="nav__right d-flex align-items-center gap-4">
            <span
              className="cart__icon"
              onClick={() => {
                router.push("/cart");
              }}
            >
              <i className="ri-shopping-basket-line"></i>
              <span className="cart__badge">
                {userCart.cartItems ? <>{userCart.cartItems.length}</> : <>0</>}
              </span>
            </span>
            {user ? (
              <Dropdown
                menu={{
                  items,
                }}
              >
                <a className="link__color" onClick={(e) => e.preventDefault()}>
                  <Space>
                    {user.name}
                    <DownOutlined />
                  </Space>
                </a>
              </Dropdown>
            ) : (
              <span
                className="user"
                onClick={() => {
                  router.push("/login");
                }}
              >
                <a className="link__color">
                  <i className="ri-user-line"></i>
                </a>
              </span>
            )}

            <span className="mobile__menu" onClick={toggleMenu}>
              <i className="ri-menu-line"></i>
            </span>
          </div>
        </div>
      </Container>
    </header>
  );
}

export default Header;
