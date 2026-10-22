import { useState, useRef } from 'react';

import { useUser } from '../../UserContext/UserContext';
import { Layout } from '../Layout/Layout';
import { ProductInput } from '../ProductInput/ProductInput';
import { ProductButton } from '../ProductButton/ProductButton';

import styles from './LoginForm.module.css';

const LoginForm = () => {
    const { setCurrentUser } = useUser();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const buttonRef = useRef();
    const usernameRef = useRef();
    const passwordRef = useRef();

    const loginForm = (event) => {
        event.preventDefault();

        const profiles = JSON.parse(
            localStorage.getItem('profiles')
        ) || [];

        const existingProfile = profiles.find(
            (profile) => profile.username === username
        );

        if (!existingProfile) {
            alert('Пользователь не зарегистрирован');
            return;
        }

        if (existingProfile.password !== password) {
            alert('Неверный пароль');
            return;
        }

        const updatedProfiles = profiles.map((profile) => ({
            ...profile,
            isLogined: profile.username === username
        }));

        localStorage.setItem(
            'profiles',
            JSON.stringify(updatedProfiles)
        );

        setUsername('');
        setPassword('');

        setCurrentUser(username);
    };

    return (
        <form className={styles['loginForm']} onSubmit={loginForm}>
            <Layout />

            <h1 className={styles['loginHeading']}>
                Вход
            </h1>

            <ProductInput
                type="text"
                ref={usernameRef}
                value={username}
                placeholder="Имя пользователя..."
                onChange={(e) => setUsername(e.target.value)}
                required
            />

            <ProductInput
                type="password"
                ref={passwordRef}
                value={password}
                placeholder="Пароль..."
                onChange={(e) => setPassword(e.target.value)}
                required
            />

            <ProductButton
                type="submit"
                ref={buttonRef}
            >
                Войти в профиль
            </ProductButton>
        </form>
    );
};

export { LoginForm };