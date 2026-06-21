<script>
  import { currentUser } from '../stores/auth';
  import { changeUserPassword } from '../services/authService';
  import { update } from '../services/firestoreService';
  import Button from '../components/common/Button.svelte';
  import Toast from '../components/common/Toast.svelte';

  let name = $currentUser?.name || '';
  let phone = $currentUser?.phone || '';
  let currentPassword = '';
  let newPassword = '';
  let confirmPassword = '';
  let loading = false;
  let toast = { show: false, message: '', type: 'info' };

  async function updateProfile() {
    if (!name) {
      toast = { show: true, message: 'El nombre es obligatorio', type: 'warning' };
      return;
    }

    loading = true;
    try {
      await update('users', $currentUser.uid, { name, phone });
      toast = { show: true, message: 'Perfil actualizado exitosamente', type: 'success' };
    } catch (e) {
      toast = { show: true, message: 'Error al actualizar perfil', type: 'error' };
    }
    loading = false;
  }

  async function changePassword() {
    if (!currentPassword || !newPassword) {
      toast = { show: true, message: 'Completa los campos de contraseña', type: 'warning' };
      return;
    }

    if (newPassword !== confirmPassword) {
      toast = { show: true, message: 'Las contraseñas no coinciden', type: 'error' };
      return;
    }

    if (newPassword.length < 6) {
      toast = { show: true, message: 'La contraseña debe tener al menos 6 caracteres', type: 'warning' };
      return;
    }

    loading = true;
    const result = await changeUserPassword(newPassword);
    loading = false;

    if (result.success) {
      toast = { show: true, message: 'Contraseña actualizada', type: 'success' };
      currentPassword = '';
      newPassword = '';
      confirmPassword = '';
    } else {
      toast = { show: true, message: result.error, type: 'error' };
    }
  }
</script>

<div class="profile-container">
  <div class="profile-card">
    <div class="profile-header">
      <div class="avatar">{$currentUser?.name?.charAt(0) || 'U'}</div>
      <h2>{$currentUser?.name || 'Usuario'}</h2>
      <span class="role-badge">{$currentUser?.roleName || 'Sin rol'}</span>
    </div>

    <div class="section">
      <h3>Información Personal</h3>
      <div class="form-group">
        <label for="name">Nombre</label>
        <input id="name" type="text" bind:value={name} />
      </div>
      <div class="form-group">
        <label for="email">Correo (solo lectura)</label>
        <input id="email" type="email" value={$currentUser?.email || ''} disabled />
      </div>
      <div class="form-group">
        <label for="phone">Teléfono</label>
        <input id="phone" type="tel" bind:value={phone} placeholder="300 123 4567" />
      </div>
      <Button on:click={updateProfile} {loading}>Guardar Cambios</Button>
    </div>

    <div class="section">
      <h3>Cambiar Contraseña</h3>
      <div class="form-group">
        <label for="newPassword">Nueva contraseña</label>
        <input id="newPassword" type="password" bind:value={newPassword} placeholder="Mínimo 6 caracteres" />
      </div>
      <div class="form-group">
        <label for="confirmPassword">Confirmar contraseña</label>
        <input id="confirmPassword" type="password" bind:value={confirmPassword} placeholder="Repetir contraseña" />
      </div>
      <Button variant="secondary" on:click={changePassword} {loading}>Cambiar Contraseña</Button>
    </div>
  </div>
</div>

<Toast
  show={toast.show}
  message={toast.message}
  type={toast.type}
  on:close={() => toast.show = false}
/>

<style>
  .profile-container {
    padding: 1.25rem;
    padding-top: 5rem;
    min-height: 100vh;
    background: #f3f4f6;
  }

  .profile-card {
    background: white;
    border-radius: 16px;
    padding: 1.5rem;
    max-width: 500px;
    margin: 0 auto;
    box-shadow: 0 4px 20px rgba(0,0,0,0.06);
  }

  .profile-header {
    text-align: center;
    margin-bottom: 1.5rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid #e5e7eb;
  }

  .avatar {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background: #1e40af;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.75rem;
    font-weight: 700;
    margin: 0 auto 0.75rem;
  }

  .profile-header h2 {
    margin: 0;
    color: #1f2937;
    font-size: 1.3rem;
  }

  .role-badge {
    display: inline-block;
    margin-top: 0.5rem;
    padding: 0.25rem 0.75rem;
    background: #dbeafe;
    color: #1e40af;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
  }

  .section {
    margin-bottom: 1.5rem;
  }

  .section h3 {
    font-size: 1rem;
    color: #374151;
    margin-bottom: 0.75rem;
  }

  .form-group {
    margin-bottom: 0.85rem;
  }

  label {
    display: block;
    margin-bottom: 0.25rem;
    font-size: 0.85rem;
    font-weight: 600;
    color: #374151;
  }

  input {
    width: 100%;
    padding: 0.7rem;
    border: 1.5px solid #d1d5db;
    border-radius: 8px;
    font-size: 0.95rem;
    box-sizing: border-box;
    min-height: 42px;
  }

  input:focus {
    outline: none;
    border-color: #1e40af;
  }

  input:disabled {
    background: #f3f4f6;
    color: #9ca3af;
  }
</style>
