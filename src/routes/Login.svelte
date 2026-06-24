<script>
  import { link, push } from 'svelte-spa-router';
  import { login, resendVerificationEmail } from '../services/authService';
  import Button from '../components/common/Button.svelte';
  import Toast from '../components/common/Toast.svelte';

  let email = '';
  let password = '';
  let loading = false;
  let toast = { show: false, message: '', type: 'info' };
  let emailNotVerified = false;
  let resendingVerification = false;

  async function handleLogin() {
    if (!email || !password) {
      toast = { show: true, message: 'Completa todos los campos', type: 'warning' };
      return;
    }

    loading = true;
    emailNotVerified = false;
    const result = await login(email, password);
    loading = false;

    if (result.success) {
      if (result.emailNotVerified) {
        emailNotVerified = true;
        toast = { show: true, message: 'Correo no verificado. Se envió un enlace de verificación a tu correo.', type: 'warning' };
      } else {
        toast = { show: true, message: 'Inicio de sesión exitoso', type: 'success' };
        setTimeout(() => push('/admin'), 500);
      }
    } else {
      toast = { show: true, message: result.error, type: 'error' };
    }
  }

  async function handleResendVerification() {
    resendingVerification = true;
    const result = await resendVerificationEmail();
    resendingVerification = false;

    if (result.success) {
      toast = { show: true, message: 'Correo de verificación reenviado a ' + email, type: 'success' };
    } else {
      toast = { show: true, message: result.error || 'Error al reenviar verificación', type: 'error' };
    }
  }

  function handleGoToLogin() {
    emailNotVerified = false;
  }
</script>

<div class="login-container">
  <div class="login-card">
    <div class="login-header">
      <img src="/logo.png" alt="Tienda La Cigarra" class="login-logo" />
      <h1 class="logo">La Cigarra</h1>
      <p class="subtitle">Sistema de Tienda de Barrio</p>
    </div>

    {#if emailNotVerified}
      <div class="verify-container">
        <div class="verify-icon"><i class="fa-solid fa-envelope-circle-check"></i></div>
        <h2>Verifica tu correo</h2>
        <p>Se envió un enlace de verificación a <strong>{email}</strong>. Revisa tu bandeja de entrada y haz clic en el enlace para activar tu cuenta.</p>
        <div class="verify-actions">
          <Button fullWidth={true} on:click={handleResendVerification} loading={resendingVerification}>
            <i class="fa-solid fa-paper-plane"></i> Reenviar Correo de Verificación
          </Button>
          <button class="btn-back" on:click={handleGoToLogin}>
            <i class="fa-solid fa-arrow-left"></i> Volver al inicio de sesión
          </button>
        </div>
      </div>
    {:else}
      <form on:submit|preventDefault={handleLogin}>
        <div class="form-group">
          <label for="email">Correo electrónico</label>
          <input
            id="email"
            type="email"
            bind:value={email}
            placeholder="tucorreo@email.com"
            required
          />
        </div>

        <div class="form-group">
          <label for="password">Contraseña</label>
          <input
            id="password"
            type="password"
            bind:value={password}
            placeholder="••••••••"
            required
          />
        </div>

        <Button type="submit" {loading} fullWidth={true}>
          Iniciar Sesión
        </Button>
      </form>
    {/if}
  </div>
</div>

<Toast
  show={toast.show}
  message={toast.message}
  type={toast.type}
  on:close={() => toast.show = false}
/>

<style>
  .login-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #B31A1A 0%, #110F0F 100%);
    padding: 1.5rem;
  }

  .login-card {
    background: white;
    border-radius: 16px;
    padding: 2.5rem 2rem;
    width: 100%;
    max-width: 400px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.2);
  }

  .login-header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .login-logo {
    max-width: 180px;
    height: auto;
    margin-bottom: 1rem;
    border-radius: 12px;
  }

  .logo {
    font-size: 2rem;
    font-weight: 800;
    color: #B31A1A;
    margin: 0;
    letter-spacing: 2px;
  }

  .subtitle {
    color: #6b7280;
    font-size: 0.9rem;
    margin-top: 0.5rem;
  }

  .form-group {
    margin-bottom: 1.25rem;
  }

  label {
    display: block;
    margin-bottom: 0.35rem;
    font-size: 0.875rem;
    font-weight: 600;
    color: #374151;
  }

  input {
    width: 100%;
    padding: 0.75rem;
    border: 1.5px solid #d1d5db;
    border-radius: 8px;
    font-size: 1rem;
    box-sizing: border-box;
    min-height: 44px;
  }

  input:focus {
    outline: none;
    border-color: #B31A1A;
    box-shadow: 0 0 0 3px rgba(179,26,26,0.1);
  }

  .verify-container {
    text-align: center;
  }

  .verify-icon {
    font-size: 3rem;
    color: #F2C12E;
    margin-bottom: 1rem;
  }

  .verify-container h2 {
    font-size: 1.3rem;
    color: #110F0F;
    margin: 0 0 0.75rem;
  }

  .verify-container p {
    color: #6b7280;
    font-size: 0.9rem;
    line-height: 1.5;
    margin: 0 0 1.5rem;
  }

  .verify-actions {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .btn-back {
    background: none;
    border: none;
    color: #6b7280;
    font-size: 0.9rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.5rem;
  }

  .btn-back:hover {
    color: #B31A1A;
  }
</style>
