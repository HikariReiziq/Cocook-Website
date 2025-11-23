import User from '../models/User.js';
import History from '../models/History.js';
import { generateToken } from '../middleware/auth.js';

// @desc    Register user baru
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validasi input
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Nama, email, dan password harus diisi'
      });
    }

    // Cek apakah email sudah terdaftar
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email sudah terdaftar'
      });
    }

    // Buat user baru
    const user = await User.create({ name, email, password });

    // Generate token
    const token = generateToken(user._id);

    // Log history
    await History.create({
      user: user._id,
      action: 'Create',
      category: 'Profile',
      detail: `Registrasi akun baru: ${email}`,
      relatedId: user._id
    });

    res.status(201).json({
      success: true,
      message: 'Registrasi berhasil',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          job: user.job,
          profilePhoto: user.profilePhoto,
          theme: user.theme
        },
        token
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat registrasi',
      error: error.message
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('Login attempt:', { email, passwordLength: password?.length });

    // Validasi input
    if (!email || !password) {
      console.log('Validation failed: missing email or password');
      return res.status(400).json({
        success: false,
        message: 'Email dan password harus diisi'
      });
    }

    // Cari user dan include password
    const user = await User.findOne({ email }).select('+password');
    console.log('User found:', user ? 'Yes' : 'No');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah'
      });
    }

    // Cek password
    const isPasswordMatch = await user.comparePassword(password);
    console.log('Password match:', isPasswordMatch);
    
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login berhasil',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          profilePhoto: user.profilePhoto,
          job: user.job,
          theme: user.theme
        },
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat login',
      error: error.message
    });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePhoto: user.profilePhoto,
        job: user.job,
        theme: user.theme
      }
    });
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data user',
      error: error.message
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const { name, theme, job, profilePhotoUrl } = req.body;
    const updateData = {};

    if (name !== undefined) updateData.name = name;
    if (theme !== undefined) updateData.theme = theme;
    if (job !== undefined) updateData.job = job || '';

    // Skip history logging for theme changes only
    const isOnlyThemeChange = theme !== undefined && !name && !job && !profilePhotoUrl && !req.file;
    
    // Priority: file upload > URL > existing
    if (req.file) {
      updateData.profilePhoto = `/uploads/${req.file.filename}`;
    } else if (profilePhotoUrl) {
      updateData.profilePhoto = profilePhotoUrl;
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    );

    // Log history only if not theme-only change
    if (!isOnlyThemeChange) {
      let detailParts = [];
      if (name) detailParts.push('nama');
      if (job) detailParts.push('pekerjaan');
      if (req.file || profilePhotoUrl) detailParts.push('foto profil');
      
      await History.create({
        user: user._id,
        action: 'Update',
        category: 'Profile',
        detail: `Mengubah profil pengguna: ${detailParts.join(', ')}`,
        relatedId: user._id
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profil berhasil diupdate',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePhoto: user.profilePhoto,
        job: user.job,
        theme: user.theme
      }
    });
  } catch (error) {
    console.error('UpdateProfile error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat update profil',
      error: error.message
    });
  }
};
