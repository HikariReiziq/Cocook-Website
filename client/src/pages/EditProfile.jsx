import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, User, Briefcase, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services';

const EditProfile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    name: '',
    profilePhoto: '',
    photoUrl: '',
    job: ''
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        profilePhoto: user.profilePhoto || '',
        photoUrl: '',
        job: user.job || ''
      });
      // Set preview dengan full URL
      if (user.profilePhoto) {
        const photoUrl = user.profilePhoto.startsWith('http') 
          ? user.profilePhoto 
          : `http://localhost:5000${user.profilePhoto}`;
        setPhotoPreview(photoUrl);
      }
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
      setFormData(prev => ({ ...prev, photoUrl: '' })); // Clear URL if file selected
    }
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setFormData(prev => ({ ...prev, photoUrl: url }));
    if (url) {
      setPhotoFile(null); // Clear file if URL entered
      setPhotoPreview(url);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Validasi
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Nama wajib diisi';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append('name', formData.name.trim());
      data.append('job', formData.job.trim());
      
      if (photoFile) {
        data.append('profilePhoto', photoFile);
      } else if (formData.photoUrl.trim()) {
        data.append('profilePhotoUrl', formData.photoUrl.trim());
      }

      console.log('Sending update:', { 
        name: formData.name, 
        job: formData.job,
        hasFile: !!photoFile,
        photoUrl: formData.photoUrl 
      });

      const response = await authService.updateProfile(data);
      
      console.log('Update response:', response);
      
      if (response.success) {
        // Update user in context
        updateUser(response.data);
        alert('✅ Profile berhasil diperbarui!');
        navigate('/');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrors({ general: error.response?.data?.message || 'Gagal memperbarui profile' });
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2) || 'U';
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          <ArrowLeft size={20} />
          <span>Kembali</span>
        </button>
      </div>

      {/* Form Card */}
      <div className="card max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Edit Profile
        </h1>

        {/* Error Alert */}
        {errors.general && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
            <span className="text-sm">{errors.general}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Photo Section */}
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 dark:border-gray-700"
                  onError={(e) => {
                    console.error('Failed to load image:', photoPreview);
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                    setPhotoPreview('');
                  }}
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-primary-600 text-white flex items-center justify-center text-3xl font-bold border-4 border-gray-200 dark:border-gray-700">
                  {getInitials(formData.name)}
                </div>
              )}
              <div className="absolute bottom-0 right-0 bg-primary-600 p-2 rounded-full text-white">
                <Camera size={20} />
              </div>
            </div>

            <div className="w-full space-y-4">
              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Upload Foto Profile
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="input-field"
                  disabled={!!formData.photoUrl}
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Format: JPG, PNG, maksimal 2MB
                </p>
              </div>

              {/* URL Input */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Atau</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Link URL Foto Online
                </label>
                <input
                  type="url"
                  name="photoUrl"
                  value={formData.photoUrl}
                  onChange={handleUrlChange}
                  className="input-field"
                  placeholder="https://example.com/photo.jpg"
                  disabled={!!photoFile}
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Link gambar dari internet (opsional)
                </p>
              </div>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nama Lengkap *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input-field pl-10"
                placeholder="John Doe"
                required
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
            )}
          </div>

          {/* Job */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Pekerjaan
            </label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="job"
                value={formData.job}
                onChange={handleChange}
                className="input-field pl-10"
                placeholder="Mahasiswa, Chef, Ibu Rumah Tangga, dll"
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex-1 btn-secondary"
              disabled={loading}
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 btn-primary flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                'Menyimpan...'
              ) : (
                <>
                  <Save size={20} />
                  Simpan Perubahan
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
