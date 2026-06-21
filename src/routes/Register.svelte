<script>
  import { link, push } from 'svelte-spa-router';
  import { register } from '../services/authService';
  import { getAll } from '../services/firestoreService';
  import Button from '../components/common/Button.svelte';
  import Toast from '../components/common/Toast.svelte';
  import { onMount } from 'svelte';

  let name = '';
  let email = '';
  let phone = '';
  let password = '';
  let confirmPassword = '';
  let roleId = '';
  let roles = [];
  let loading = false;
  let toast = { show: false, message: '', type: 'info' };

  onMount(async () => {
    try {
      roles = await getAll('roles');
    } catch (e) {
      console.error('Error cargando roles:', e);
    }
  });

  async function handleRegister() {
    if (!name || !email || !password) {
      toast = { show: true, message: 'Completa todos los campos obligatorios', type: 'warning' };
      return;
    }

    if (password !== confirmPassword) {
      toast = { show: true, message: 'Las contraseñas no coinciden', type: 'error' };
      return;
    }

    if (password.length < 6) {
      toast = { show: true, message: 'La contraseña debe tener al menos 6 caracteres', type: 'warning' };
      return;
    }

    loading = true;
    const selectedRole = roles.find(r => r.id === roleId);
    const result = await register(email, password, {
      name,
      phone,
      roleId,
      roleName: selectedRole ? selectedRole.name : 'Vendedor'
    });
    loading = false;

    if (result.success) {
      toast = { show: true, message: 'Usuario registrado exitosamente', type: 'success' };
      setTimeout(() => push('/admin/usuarios'), 1000);
    } else {
      toast = { show: true, message: result.error, type: 'error' };
    }
  }
</script>

<div class="register-container">
  <div class="register-card">
    <div class="register-header">
      <h2>Registrar Usuario</h2>
      <p>Crear una nueva cuenta en el sistema</p>
    </div>

    <form on:submit|preventDefault={handleRegister}>
      <div class="form-group">
        <label for="name">Nombre completo *</label>
        <input id="name" type="text" bind:value={name} placeholder="Juan Pérez" required />
      </div>

      <div class="form-group">
        <label for="email">Correo electrónico *</label>
        <input id="email" type="email" bind:value={email} placeholder="correo@email.com" required />
      </div>

      <div class="form-group">
        <label for="phone">Teléfono</label>
        <input id="phone" type="tel" bind:value={phone} placeholder="300 123 4567" />
      </div>

      <div class="form-group">
        <label for="role">Rol</label>
        <select id="role" bind:value={roleId}>
          <option value="">Seleccionar rol...</option>
          {#each roles as role}
            <option value={role.id}>{role.name}</option>
          {/each}
        </select>
      </div>

      <div class="form-group">
        <label for="password">Contraseña *</label>
        <input id="password" type="password" bind:value={password} placeholder="Mínimo 6 caracteres" required />
      </div>

      <div class="form-group">
        <label for="confirmPassword">Confirmar contraseña *</label>
        <input id="confirmPassword" type="password" bind:value={confirmPassword} placeholder="Repetir contraseña" required />
      </div>

      <Button type="submit" {loading} fullWidth={true}>
        Registrar Usuario
      </Button>

      <a href="/admin/usuarios" use:link class="back-link">← Volver a Usuarios</a>
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
  .register-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f3f4f6;
    padding: 1.5rem;
  }

  .register-card {
    background: white;
    border-radius: 16px;
    padding: 2rem;
    width: 100%;
    max-width: 450px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  }

  .register-header {
    text-align: center;
    margin-bottom: 1.5rem;
  }

  .register-header h2 {
    color: #1f2937;
    margin: 0;
    font-size: 1.4rem;
  }

  .register-header p {
    color: #6b7280;
    font-size: 0.875rem;
    margin-top: 0.35rem;
  }

  .form-group {
    margin-bottom: 1rem;
  }

  label {
    display: block;
    margin-bottom: 0.3rem;
    font-size: 0.875rem;
    font-weight: 600;
    color: #374151;
  }

  input, select {
    width: 100%;
    padding: 0.7rem;
    border: 1.5px solid #d1d5db;
    border-radius: 8px;
    font-size: 0.95rem;
    box-sizing: border-box;
    min-height: 42px;
    background: white;
  }

  input:focus, select:focus {
    outline: none;
    border-color: #1e40af;
    box-shadow: 0 0 0 3px rgba(30,64,175,0.1);
  }

  .back-link {
    display: block;
    text-align: center;
    margin-top: 1rem;
    color: #1e40af;
    text-decoration: none;
    font-size: 0.9rem;
  }
</style>
