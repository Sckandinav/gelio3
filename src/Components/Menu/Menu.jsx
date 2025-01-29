import React, { useState } from 'react';
import { Offcanvas, Button } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { RiMenuSearchLine } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import { AnimatePresence, motion } from 'motion/react';

import { utilsSelector } from '../../store/selectors/utilsSelector.js';

import { menuToggle } from '../../store/slices/utils.js';

const initialMenuList = [
  {
    title: 'Главная',
    id: 'main',
    type: 'link',
    img: '/icons/home.svg',
    isActive: false,
    linkSRC: '/',
  },

  {
    title: 'ЭДО',
    id: 'edo',
    type: 'blogTitle',
    img: '/icons/files.svg',
    isActive: false,
    linkSRC: '/',
    subMenuLists: [],
  },

  {
    title: 'Документооборот',
    id: 'documents',
    type: 'subMenu',
    img: '/icons/documents.svg',
    isActive: false,
    linkSRC: '/',
    subMenuLists: [
      { title: 'Обмен документами', to: 'edo' },
      { title: 'Заявки', to: 'applications/incoming' },
    ],
  },
];

export const Menu = () => {
  const [activeDropDown, setActiveDropDown] = useState('');
  const { isOpenMainMenu } = useSelector(utilsSelector);

  const dispatch = useDispatch();

  const dropDownToggle = value => {
    if (value === activeDropDown) {
      setActiveDropDown('');
    } else {
      setActiveDropDown(value);
    }
  };

  return (
    <>
      <Button variant="outline-primary" onClick={() => dispatch(menuToggle())} className="me-2">
        Меню
        <RiMenuSearchLine size={25} />
      </Button>
      <Offcanvas show={isOpenMainMenu} onHide={() => dispatch(menuToggle())} style={{ width: '300px' }}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Меню</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <nav className="nav flex-column">
            {initialMenuList.map((el, id) => {
              if (el.type === 'link') {
                return (
                  <NavLink
                    className="btn btn-outline-success d-flex align-items-center"
                    to={el.linkSRC}
                    key={el.id + id}
                    onClick={() => dispatch(menuToggle())}
                  >
                    <img className="me-1" src={el.img} alt={el.title} />
                    {el.title}
                  </NavLink>
                );
              }

              if (el.type === 'subMenu') {
                return (
                  <React.Fragment key={el.id}>
                    <button className="btn btn-outline-success d-flex align-items-center mt-3" onClick={() => dropDownToggle(el.id)}>
                      <img className="me-1" src={el.img} alt={el.title} />
                      {el.title}
                    </button>
                    <AnimatePresence>
                      {activeDropDown === el.id &&
                        el.subMenuLists.map((subItem, index) => (
                          <motion.span
                            key={el.id + subItem.to + index}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            style={{ overflow: 'hidden' }}
                          >
                            <NavLink
                              className="btn btn-outline-success d-flex align-items-center mx-3 mt-1"
                              to={subItem.to}
                              onClick={() => dispatch(menuToggle())}
                            >
                              {subItem.title}
                            </NavLink>
                          </motion.span>
                        ))}
                    </AnimatePresence>
                  </React.Fragment>
                );
              }

              return null;
            })}
          </nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};
