import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { UserRole } from '../constants/roles.js';
import { RegisterInput, LoginInput } from '../validators/authValidator.js';
import { signToken } from '../utils/jwt.js';
import { getIsDbConnected } from '../config/db.js';

// In-memory user store fallback when MongoDB is not connected
const memoryUserStore = new Map<string, any>();

// Helper to sanitize user object (remove password)
export const sanitizeUser = (user: any) => {
  const obj = typeof user.toObject === 'function' ? user.toObject() : { ...user };
  delete obj.password;
  return {
    id: obj._id ? obj._id.toString() : obj.id,
    name: obj.name,
    email: obj.email,
    role: obj.role,
    phone: obj.phone,
    speciality: obj.speciality || '',
    experience: obj.experience || '',
    address: obj.address || '',
    age: obj.age || 0,
    gender: obj.gender || 'Not specified',
    profileImage: obj.profileImage || '',
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
  };
};

export class AuthService {
  /**
   * Register a new patient
   */
  static async registerPatient(data: RegisterInput) {
    const emailLower = data.email.toLowerCase().trim();

    if (getIsDbConnected()) {
      const existingUser = await (User as any).findOne({ email: emailLower });
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(data.password, salt);

      const newUser = await (User as any).create({
        name: data.name,
        email: emailLower,
        password: hashedPassword,
        role: UserRole.PATIENT, // Only patient registration allowed!
        phone: data.phone,
      });

      const userObj = sanitizeUser(newUser);
      const token = signToken({
        userId: userObj.id,
        email: userObj.email,
        role: userObj.role,
      });

      return { user: userObj, token };
    } else {
      // In-memory fallback
      if (memoryUserStore.has(emailLower)) {
        throw new Error('User with this email already exists');
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(data.password, salt);
      const userId = 'mem_user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);

      const newUser = {
        _id: userId,
        id: userId,
        name: data.name,
        email: emailLower,
        password: hashedPassword,
        role: UserRole.PATIENT,
        phone: data.phone,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      memoryUserStore.set(emailLower, newUser);

      const userObj = sanitizeUser(newUser);
      const token = signToken({
        userId: userObj.id,
        email: userObj.email,
        role: userObj.role,
      });

      return { user: userObj, token };
    }
  }

  /**
   * Login user of any role (patient, doctor, receptionist)
   */
  static async loginUser(data: LoginInput) {
    const emailLower = data.email.toLowerCase().trim();

    if (getIsDbConnected()) {
      const user = await (User as any).findOne({ email: emailLower }).select('+password');
      if (!user) {
        throw new Error('Invalid email or password');
      }

      const isMatch = await bcrypt.compare(data.password, user.password!);
      if (!isMatch) {
        throw new Error('Invalid email or password');
      }

      const userObj = sanitizeUser(user);
      const token = signToken({
        userId: userObj.id,
        email: userObj.email,
        role: userObj.role,
      });

      return { user: userObj, token };
    } else {
      // Memory store fallback
      const user = memoryUserStore.get(emailLower);
      if (!user) {
        throw new Error('Invalid email or password');
      }

      const isMatch = await bcrypt.compare(data.password, user.password);
      if (!isMatch) {
        throw new Error('Invalid email or password');
      }

      const userObj = sanitizeUser(user);
      const token = signToken({
        userId: userObj.id,
        email: userObj.email,
        role: userObj.role,
      });

      return { user: userObj, token };
    }
  }

  /**
   * Get user profile by ID
   */
  static async getUserById(userId: string) {
    if (getIsDbConnected()) {
      const user = await (User as any).findById(userId);
      if (!user) {
        throw new Error('User not found');
      }
      return sanitizeUser(user);
    } else {
      for (const [, user] of memoryUserStore.entries()) {
        if (user._id === userId || user.id === userId) {
          return sanitizeUser(user);
        }
      }
      throw new Error('User not found');
    }
  }

  /**
   * Update patient profile
   */
  static async updateProfile(userId: string, data: { name?: string; phone?: string; address?: string; age?: number; gender?: string; profileImage?: string }) {
    if (getIsDbConnected()) {
      const user = await (User as any).findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      if (data.name !== undefined) user.name = data.name;
      if (data.phone !== undefined) user.phone = data.phone;
      if (data.address !== undefined) user.address = data.address;
      if (data.age !== undefined) user.age = Number(data.age);
      if (data.gender !== undefined) user.gender = data.gender;
      if (data.profileImage !== undefined) user.profileImage = data.profileImage;

      await user.save();
      return sanitizeUser(user);
    } else {
      let foundUserKey: string | null = null;
      let foundUserObj: any = null;

      for (const [key, user] of memoryUserStore.entries()) {
        if (user._id === userId || user.id === userId) {
          foundUserKey = key;
          foundUserObj = user;
          break;
        }
      }

      if (!foundUserObj || !foundUserKey) {
        throw new Error('User not found');
      }

      if (data.name !== undefined) foundUserObj.name = data.name;
      if (data.phone !== undefined) foundUserObj.phone = data.phone;
      if (data.address !== undefined) foundUserObj.address = data.address;
      if (data.age !== undefined) foundUserObj.age = Number(data.age);
      if (data.gender !== undefined) foundUserObj.gender = data.gender;
      if (data.profileImage !== undefined) foundUserObj.profileImage = data.profileImage;
      foundUserObj.updatedAt = new Date();

      memoryUserStore.set(foundUserKey, foundUserObj);
      return sanitizeUser(foundUserObj);
    }
  }

  /**
   * Seed 3 Doctors and 1 Receptionist
   */
  static async seedUsers() {
    const defaultPassword = 'password123';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(defaultPassword, salt);

    const initialUsers = [
      {
        name: 'Dr. Richard James',
        email: 'dr.richard@mediqo.com',
        role: UserRole.DOCTOR,
        phone: '+1 555-0101',
        speciality: 'General Physician',
        experience: '4 Years',
      },
      {
        name: 'Dr. Emily Larson',
        email: 'dr.emily@mediqo.com',
        role: UserRole.DOCTOR,
        phone: '+1 555-0102',
        speciality: 'Gynecologist',
        experience: '3 Years',
      },
      {
        name: 'Dr. Sarah Patel',
        email: 'dr.sarah@mediqo.com',
        role: UserRole.DOCTOR,
        phone: '+1 555-0103',
        speciality: 'Dermatologist',
        experience: '1 Year',
      },
      {
        name: 'Sarah Jenkins',
        email: 'receptionist@mediqo.com',
        role: UserRole.RECEPTIONIST,
        phone: '+1 555-0100',
        speciality: '',
        experience: '',
      },
    ];

    let createdCount = 0;

    for (const u of initialUsers) {
      const emailLower = u.email.toLowerCase().trim();

      if (getIsDbConnected()) {
        const exists = await (User as any).findOne({ email: emailLower });
        if (!exists) {
          await (User as any).create({
            ...u,
            email: emailLower,
            password: hashedPassword,
          });
          createdCount++;
        }
      } else {
        if (!memoryUserStore.has(emailLower)) {
          const userId = 'seed_' + emailLower.replace(/[^a-z0-9]/g, '_');
          memoryUserStore.set(emailLower, {
            _id: userId,
            id: userId,
            ...u,
            email: emailLower,
            password: hashedPassword,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
          createdCount++;
        }
      }
    }

    console.log(`Seed script execution completed. Seeded ${createdCount} accounts.`);
    return { createdCount, totalSeed: initialUsers.length };
  }
}
