import { useState, useRef } from 'react';

import { Layout } from '../Layout/Layout';
import { ProductInput } from '../ProductInput/ProductInput';
import { ProductButton } from '../ProductButton/ProductButton';

import styles from './RegistrationForm.module.css';

export const RegistrationForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const buttonRef = useRef();
    const usernameRef = useRef();
    const passwordRef = useRef();

    const registrationForm = (event) => {
        event.preventDefault();

        const profiles = JSON.parse(
            localStorage.getItem('profiles')
        ) || [];

        const existingProfile = profiles.find(
            (profile) => profile.username === username
        );

        if (existingProfile) {
            alert('Такой пользователь уже зарегистрирован');
            return;
        }

        profiles.push({
            username,
            password,
            isLogined: false
        });

        localStorage.setItem(
            'profiles',
            JSON.stringify(profiles)
        );

        setUsername('');
        setPassword('');

        alert('Регистрация прошла успешно');
    };

    return (
        <form
            className={styles['registrationForm']}
            onSubmit={registrationForm}
        >
            <Layout />

            <h1 className={styles['registrationHeading']}>
                Регистрация
            </h1>

            <ProductInput
                type="text"
                ref={usernameRef}
                value={username}
                placeholder="Логин"
                onChange={(e) => setUsername(e.target.value)}
                required
            />

            <ProductInput
                type="password"
                ref={passwordRef}
                value={password}
                placeholder="Пароль"
                onChange={(e) => setPassword(e.target.value)}
                required
            />

            <ProductButton
                type="submit"
                ref={buttonRef}
            >
                Регистрация
            </ProductButton>
        </form>
    );
};