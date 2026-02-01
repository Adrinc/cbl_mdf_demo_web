import React, { useState } from 'react';
import { isEnglish } from '../../data/variables.js';
import { useStore } from '@nanostores/react';
import styles from './css/loginScreen.module.css';

const LoginScreen = ({ onLogin }) => {
  const ingles = useStore(isEnglish);
  const [email, setEmail] = useState('demo@cbluna.com');
  const [password, setPassword] = useState('demo2025');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const content = {
    es: {
      welcome: "Bienvenido a la",
      title: "Demo de Gestión MDF/IDF",
      subtitle: "Plataforma de Gestión de Infraestructura",
      description: "Accede al sistema de gestión MDF/IDF",
      email: "Correo Electrónico",
      password: "Contraseña",
      login: "Iniciar Sesión",
      backToPortal: "Volver al Portal",
      showPassword: "Mostrar contraseña",
      loading: "Iniciando sesión...",
      error: "Credenciales incorrectas. Use: demo@cbluna.com / demo2025",
      demo: "Demo Interactiva",
      security: "🔒 Conexión segura",
      features: [
        "Gestión completa de infraestructura",
        "Monitoreo en tiempo real",
        "Reportes avanzados",
        "Dashboard intuitivo"
      ]
    },
    en: {
      welcome: "Welcome to the",
      title: "MDF/IDF Management Demo",
      subtitle: "Infrastructure Management Platform",
      description: "Access the MDF/IDF management system",
      email: "Email Address",
      password: "Password",
      login: "Sign In",
      backToPortal: "Back to Portal",
      showPassword: "Show password",
      loading: "Signing in...",
      error: "Invalid credentials. Use: demo@cbluna.com / demo2025",
      demo: "Interactive Demo",
      security: "🔒 Secure connection",
      features: [
        "Complete infrastructure management",
        "Real-time monitoring",
        "Advanced reporting",
        "Intuitive dashboard"
      ]
    }
  };

  const textos = ingles ? content.en : content.es;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simular un delay de autenticación
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (email === 'demo@cbluna.com' && password === 'demo2025') {
      onLogin();
    } else {
      setError(textos.error);
    }
    
    setIsLoading(false);
  };

  return (
    <div className={styles.loginContainer}>
      {/* Columna izquierda - Formulario */}
      <div className={styles.formColumn}>
        <div className={styles.formWrapper}>
          {/* Logo y título */}
          <div className={styles.headerSection}>
            <img src={`${import.meta.env.BASE_URL}/image/isotipodemo/nethive.png`} alt="Logo" className={styles.logoSmall} />
            <div className={styles.titleSection}>
              <h1 className={styles.welcomeTitle}>
                {textos.welcome}
              </h1>
              <h2 className={styles.brandName}>{textos.title}</h2>
              <p className={styles.subtitle}>{textos.subtitle}</p>
              <span className={styles.demoTag}>{textos.demo}</span>
            </div>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className={styles.loginForm}>
            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>
                {textos.email}
              </label>
              <div className={styles.inputWrapper}>
                <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12.713l-11.985-9.713h23.97l-11.985 9.713zm0 2.574l-12-9.725v15.438h24v-15.438l-12 9.725z"/>
                </svg>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.input}
                  required
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.label}>
                {textos.password}
              </label>
              <div className={styles.inputWrapper}>
                <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM15.1 8H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                </svg>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.input}
                  required
                />
                <button
                  type="button"
                  className={styles.showPasswordBtn}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    {showPassword ? (
                      <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
                    ) : (
                      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                    )}
                  </svg>
                </button>
              </div>
            </div>

            {error && (
              <div className={styles.errorMessage}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                {error}
              </div>
            )}

            <button 
              type="submit" 
              className={styles.loginButton}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className={styles.spinner}></div>
                  {textos.loading}
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M10 17l5-5-5-5v10z"/>
                  </svg>
                  {textos.login}
                </>
              )}
            </button>

            <div className={styles.securityNote}>
              {textos.security}
            </div>
          </form>

          {/* Features destacadas */}
          <div className={styles.featuresSection}>
            <h3 className={styles.featuresTitle}>
              {ingles ? 'Key Features' : 'Características Principales'}
            </h3>
            <ul className={styles.featuresList}>
              {textos.features.map((feature, index) => (
                <li key={index} className={styles.featureItem}>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Columna derecha - Background y logo */}
      <div className={styles.visualColumn}>
        <div className={styles.backgroundOverlay}>
          <div className={styles.logoContainer}>
            <img src={`${import.meta.env.BASE_URL}/image/isotipodemo/nethive.png`} alt="Logo" className={styles.logoLarge} />
            <div className={styles.logoText}>
              <h2 className={styles.logoTitle}>{ingles ? 'MDF/IDF Management' : 'Gestión MDF/IDF'}</h2>
              <p className={styles.logoSubtitle}>{ingles ? 'Infrastructure Control' : 'Control de Infraestructura'}</p>
            </div>
          </div>
          
          {/* Elementos decorativos */}
          <div className={styles.decorativeElements}>
            <div className={styles.circle1}></div>
            <div className={styles.circle2}></div>
            <div className={styles.circle3}></div>
          </div>

          {/* Grid pattern */}
          <div className={styles.gridPattern}></div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;