<script>
  import { link, push } from 'svelte-spa-router';
  import { login } from '../services/authService';
  import Button from '../components/common/Button.svelte';
  import Toast from '../components/common/Toast.svelte';

  let email = '';
  let password = '';
  let loading = false;
  let toast = { show: false, message: '', type: 'info' };

  async function handleLogin() {
    if (!email || !password) {
      toast = { show: true, message: 'Completa todos los campos', type: 'warning' };
      return;
    }

    loading = true;
    const result = await login(email, password);
    loading = false;

    if (result.success) {
      toast = { show: true, message: 'Inicio de sesión exitoso', type: 'success' };
      setTimeout(() => push('/admin'), 500);
    } else {
      toast = { show: true, message: result.error, type: 'error' };
    }
  }
</script>

<div class="login-container">
  <div class="login-card">
    <div class="login-header">
      <img src="/logo.png" alt="Tienda La Cigarra" class="login-logo" />
      <h1 class="logo">La Cigarra</h1>
      <p class="subtitle">Sistema de Tienda de Barrio</p>
    </div>

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
</style>
