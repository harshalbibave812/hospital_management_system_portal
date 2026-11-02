import React, { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import AppShell from '../../components/Layout/AppShell';
import { getProfile, updateProfile, changePassword, uploadPhoto } from '../../services/patientService';

// ── Validation helpers ────────────────────────────────────────────────────────
const PHONE_RE = /^\+?[1-9]\d{9,14}$/;
const PIN_RE   = /^\d{4,10}$/;

const validateProfile = (f) => {
  const e = {};
  if (!f.name?.trim())                          e.name = 'Full name is required';
  else if (f.name.trim().length < 2)            e.name = 'Name must be at least 2 characters';
  if (!f.phone?.trim())                         e.phone = 'Phone number is required';
  else if (!PHONE_RE.test(f.phone))             e.phone = 'Enter a valid phone number';
  if (f.pincode && !PIN_RE.test(f.pincode))     e.pincode = 'Enter a valid pincode (4–10 digits)';
  if (f.emergency_phone && !PHONE_RE.test(f.emergency_phone))
                                                e.emergency_phone = 'Enter a valid emergency phone';
  return e;
};

const validatePassword = (f) => {
  const e = {};
  if (!f.current_password)                      e.current_password = 'Current password is required';
  if (!f.new_password)                          e.new_password = 'New password is required';
  else if (f.new_password.length < 6)           e.new_password = 'Minimum 6 characters';
  if (f.new_password !== f.confirm_password)    e.confirm_password = 'Passwords do not match';
  return e;
};

// ── Reusable field ────────────────────────────────────────────────────────────
const Field = ({ label, required, error, children }) => (
  <div className="hms-form-group">
    <label>{label}{required && <span className="required"> *</span>}</label>
    {children}
    {error && <span className="hms-inline-error">{error}</span>}
  </div>
);

const Input = ({ error, ...props }) => (
  <input className={`hms-input${error ? ' error' : ''}`} {...props} />
);

const Select = ({ error, children, ...props }) => (
  <select className={`hms-select${error ? ' error' : ''}`} {...props}>{children}</select>
);

// ── Change Password Modal ─────────────────────────────────────────────────────
const ChangePasswordModal = ({ onClose }) => {
  const [form, setForm] = useState({ current_password: '', new_password: '', confirm_password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validatePassword(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await changePassword(form);
      toast.success('Password changed successfully');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally { setLoading(false); }
  };

  return (
    <div className="hms-modal-overlay" onClick={onClose}>
      <div className="hms-modal" onClick={e => e.stopPropagation()}>
        <div className="hms-modal__title">🔒 Change Password</div>
        <button className="hms-modal__close" onClick={onClose}>✕</button>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <Field label="Current Password" required error={errors.current_password}>
              <Input type="password" value={form.current_password} onChange={set('current_password')}
                error={errors.current_password} placeholder="Enter current password" />
            </Field>
            <Field label="New Password" required error={errors.new_password}>
              <Input type="password" value={form.new_password} onChange={set('new_password')}
                error={errors.new_password} placeholder="Min. 6 characters" />
            </Field>
            <Field label="Confirm New Password" required error={errors.confirm_password}>
              <Input type="password" value={form.confirm_password} onChange={set('confirm_password')}
                error={errors.confirm_password} placeholder="Re-enter new password" />
            </Field>
          </div>
          <div className="hms-modal__actions">
            <button type="button" className="hms-btn hms-btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="hms-btn hms-btn-primary" disabled={loading}>
              {loading ? 'Saving…' : 'Change Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── Upload Photo Modal ────────────────────────────────────────────────────────
const UploadPhotoModal = ({ onClose, onSuccess }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim()) { setError('Photo URL is required'); return; }
    try { new URL(url); } catch { setError('Enter a valid URL'); return; }
    setLoading(true);
    try {
      await uploadPhoto(url.trim());
      toast.success('Profile photo updated');
      onSuccess(url.trim());
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update photo');
    } finally { setLoading(false); }
  };

  return (
    <div className="hms-modal-overlay" onClick={onClose}>
      <div className="hms-modal" onClick={e => e.stopPropagation()}>
        <div className="hms-modal__title">📷 Upload Profile Photo</div>
        <button className="hms-modal__close" onClick={onClose}>✕</button>
        <form onSubmit={handleSubmit}>
          <Field label="Photo URL" required error={error}>
            <Input value={url} onChange={e => setUrl(e.target.value)}
              error={error} placeholder="https://example.com/photo.jpg" />
          </Field>
          <div className="hms-modal__actions">
            <button type="button" className="hms-btn hms-btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="hms-btn hms-btn-primary" disabled={loading}>
              {loading ? 'Saving…' : 'Upload'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
const TABS = ['Personal Details', 'Address', 'Emergency Contact', 'Insurance'];

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const EMPTY_FORM = {
  name: '', phone: '', date_of_birth: '', gender: '', blood_group: '',
  address_line1: '', address_line2: '', city: '', state: '', pincode: '', country: 'India',
  emergency_name: '', emergency_relation: '', emergency_phone: '',
  insurance_provider: '', insurance_policy_no: '', insurance_expiry: '',
};

const PatientProfile = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [errors, setErrors]       = useState({});
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [photoUrl, setPhotoUrl]   = useState('');
  const [showPwdModal, setShowPwdModal]     = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);

  const loadProfile = useCallback(() => {
    getProfile()
      .then((data) => {
        setForm({
          name:               data.name || '',
          phone:              data.phone || '',
          date_of_birth:      data.date_of_birth ? data.date_of_birth.split('T')[0] : '',
          gender:             data.gender || '',
          blood_group:        data.blood_group || '',
          address_line1:      data.address_line1 || '',
          address_line2:      data.address_line2 || '',
          city:               data.city || '',
          state:              data.state || '',
          pincode:            data.pincode || '',
          country:            data.country || 'India',
          emergency_name:     data.emergency_name || '',
          emergency_relation: data.emergency_relation || '',
          emergency_phone:    data.emergency_phone || '',
          insurance_provider: data.insurance_provider || '',
          insurance_policy_no: data.insurance_policy_no || '',
          insurance_expiry:   data.insurance_expiry ? data.insurance_expiry.split('T')[0] : '',
        });
        setPhotoUrl(data.profile_photo_url || '');
      })
      .catch(() => toast.error('Failed to load profile'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { loadProfile(); }, [loadProfile]);

  const set = (k) => (e) => {
    setForm(p => ({ ...p, [k]: e.target.value }));
    if (errors[k]) setErrors(p => ({ ...p, [k]: '' }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const errs = validateProfile(form);
    if (Object.keys(errs).length) {
      setErrors(errs);
      // Jump to first tab with error
      if (errs.name || errs.phone || errs.gender || errs.blood_group) setActiveTab(0);
      else if (errs.pincode) setActiveTab(1);
      else if (errs.emergency_phone) setActiveTab(2);
      toast.error('Please fix the highlighted errors before saving');
      return;
    }
    setSaving(true);
    try {
      await updateProfile(form);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally { setSaving(false); }
  };

  const initials = form.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  if (loading) return <AppShell><p style={{ padding: '2rem', color: 'var(--text-muted)' }}>Loading profile…</p></AppShell>;

  return (
    <AppShell>
      <div className="hms-page-header">
        <h1>My Profile</h1>
        <div className="hms-breadcrumb">Home &rsaquo; <span>Profile</span></div>
      </div>

      <div className="hms-card">
        {/* ── Photo + actions ── */}
        <div className="hms-profile-photo-wrap">
          {photoUrl
            ? <img src={photoUrl} alt="Profile" className="hms-profile-photo" />
            : <div className="hms-profile-photo-placeholder">{initials}</div>
          }
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button className="hms-btn hms-btn-secondary" onClick={() => setShowPhotoModal(true)}>
              📷 Upload Photo
            </button>
            <button className="hms-btn hms-btn-secondary" onClick={() => setShowPwdModal(true)}>
              🔒 Change Password
            </button>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="hms-tabs">
          {TABS.map((t, i) => (
            <button key={t} className={`hms-tab${activeTab === i ? ' active' : ''}`}
              onClick={() => setActiveTab(i)}>{t}</button>
          ))}
        </div>

        <form onSubmit={handleSave}>
          {/* Tab 0 — Personal Details */}
          {activeTab === 0 && (
            <div className="hms-form-section">
              <div className="hms-form-section__title">Personal Details</div>
              <div className="hms-form-grid">
                <Field label="Full Name" required error={errors.name}>
                  <Input value={form.name} onChange={set('name')} error={errors.name} placeholder="Enter full name" />
                </Field>
                <Field label="Phone Number" required error={errors.phone}>
                  <Input value={form.phone} onChange={set('phone')} error={errors.phone} placeholder="+91XXXXXXXXXX" />
                </Field>
                <Field label="Date of Birth" error={errors.date_of_birth}>
                  <Input type="date" value={form.date_of_birth} onChange={set('date_of_birth')} error={errors.date_of_birth} />
                </Field>
                <Field label="Gender" error={errors.gender}>
                  <Select value={form.gender} onChange={set('gender')} error={errors.gender}>
                    <option value="">Select gender</option>
                    <option>Male</option><option>Female</option><option>Other</option>
                  </Select>
                </Field>
                <Field label="Blood Group" error={errors.blood_group}>
                  <Select value={form.blood_group} onChange={set('blood_group')} error={errors.blood_group}>
                    <option value="">Select blood group</option>
                    {BLOOD_GROUPS.map(bg => <option key={bg}>{bg}</option>)}
                  </Select>
                </Field>
              </div>
            </div>
          )}

          {/* Tab 1 — Address */}
          {activeTab === 1 && (
            <div className="hms-form-section">
              <div className="hms-form-section__title">Address</div>
              <div className="hms-form-grid">
                <Field label="Address Line 1" error={errors.address_line1}>
                  <Input value={form.address_line1} onChange={set('address_line1')} placeholder="Street / Building" />
                </Field>
                <Field label="Address Line 2" error={errors.address_line2}>
                  <Input value={form.address_line2} onChange={set('address_line2')} placeholder="Area / Landmark" />
                </Field>
                <Field label="City" error={errors.city}>
                  <Input value={form.city} onChange={set('city')} placeholder="City" />
                </Field>
                <Field label="State" error={errors.state}>
                  <Input value={form.state} onChange={set('state')} placeholder="State" />
                </Field>
                <Field label="Pincode" error={errors.pincode}>
                  <Input value={form.pincode} onChange={set('pincode')} error={errors.pincode} placeholder="e.g. 400001" />
                </Field>
                <Field label="Country" error={errors.country}>
                  <Input value={form.country} onChange={set('country')} placeholder="Country" />
                </Field>
              </div>
            </div>
          )}

          {/* Tab 2 — Emergency Contact */}
          {activeTab === 2 && (
            <div className="hms-form-section">
              <div className="hms-form-section__title">Emergency Contact</div>
              <div className="hms-form-grid">
                <Field label="Contact Name" error={errors.emergency_name}>
                  <Input value={form.emergency_name} onChange={set('emergency_name')} placeholder="Full name" />
                </Field>
                <Field label="Relation" error={errors.emergency_relation}>
                  <Input value={form.emergency_relation} onChange={set('emergency_relation')} placeholder="e.g. Spouse, Parent" />
                </Field>
                <Field label="Phone Number" error={errors.emergency_phone}>
                  <Input value={form.emergency_phone} onChange={set('emergency_phone')}
                    error={errors.emergency_phone} placeholder="+91XXXXXXXXXX" />
                </Field>
              </div>
            </div>
          )}

          {/* Tab 3 — Insurance */}
          {activeTab === 3 && (
            <div className="hms-form-section">
              <div className="hms-form-section__title">Insurance Details</div>
              <div className="hms-form-grid">
                <Field label="Insurance Provider" error={errors.insurance_provider}>
                  <Input value={form.insurance_provider} onChange={set('insurance_provider')} placeholder="Provider name" />
                </Field>
                <Field label="Policy Number" error={errors.insurance_policy_no}>
                  <Input value={form.insurance_policy_no} onChange={set('insurance_policy_no')} placeholder="Policy number" />
                </Field>
                <Field label="Expiry Date" error={errors.insurance_expiry}>
                  <Input type="date" value={form.insurance_expiry} onChange={set('insurance_expiry')} />
                </Field>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <button type="button" className="hms-btn hms-btn-secondary" onClick={loadProfile}>Reset</button>
            <button type="submit" className="hms-btn hms-btn-primary" disabled={saving}>
              {saving ? 'Saving…' : '💾 Save Profile'}
            </button>
          </div>
        </form>
      </div>

      {showPwdModal   && <ChangePasswordModal onClose={() => setShowPwdModal(false)} />}
      {showPhotoModal && <UploadPhotoModal onClose={() => setShowPhotoModal(false)} onSuccess={setPhotoUrl} />}
    </AppShell>
  );
};

export default PatientProfile;
