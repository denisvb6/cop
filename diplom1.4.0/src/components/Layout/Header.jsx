import { NavLink } from 'react-router-dom';
import cn from 'classnames';
import { useUser } from '../../UserContext/UserContext';
import productStoreIcon from '../../assets/productStoreIcon.png';
// import entryIcon from '../../assets/entryIcon.png';
import exitIcon from '../../assets/exitIcon.png';

import styles from './Header.module.css';

export const Header = () => {
    const { currentUser, setCurrentUser } = useUser();

    const handleLogout = (event) => {
        event.preventDefault();

        if (currentUser) {
            const profiles = JSON.parse(localStorage.getItem('profiles')) || [];

            const updatedProfiles = profiles.map((profile) =>
                profile.username === currentUser
                    ? { ...profile, isLogined: false }
                    : profile
            );

            localStorage.setItem('profiles', JSON.stringify(updatedProfiles));
        }

        setCurrentUser(null);
    };

    return (
        <nav className={cn(styles['layout'])}>
            <div>
                <img
                    src={productStoreIcon}
                    alt="Значок магазина еды"
                    className={cn(styles['productStoreIcon'])}
                />
            </div>

            <ul className={cn(styles['list'])}>
                {currentUser && (
                    <li className={cn(styles['username'])}>{currentUser}</li>
                )}

                <li>
                    {currentUser ? (
                        <NavLink
                            to="/"
                            onClick={handleLogout}
                            className={({ isActive }) =>
                                cn(styles['navlink'], {
                                    [styles['active']]: isActive
                                })
                            }
                        >
                            Выйти
                        </NavLink>
                    ) : (
                        <NavLink
                            to="/login"
                            className={({ isActive }) =>
                                cn(styles['navlink'], {
                                    [styles['active']]: isActive
                                })
                            }
                        >
                            Войти
                        </NavLink>
                    )}

                    <span>/</span>

                    <NavLink
                        to="/registration"
                        className={({ isActive }) =>
                            cn(styles['navlink'], {
                                [styles['active']]: isActive
                            })
                        }
                    >
                        Регистрация
                    </NavLink>
                </li> 

                <NavLink to="/">
                    <img
                        src={exitIcon}
                        alt="Значок Выйти на главную страницу"
                        className={cn(styles['exitIcon'])}
                    />
                </NavLink>
            </ul>
        </nav>
    );
};
