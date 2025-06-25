import { Sequelize, DataTypes, Model, Optional, Op, WhereOptions } from 'sequelize';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Contacto
interface ContactoAttributes {
  id: number;
  email: string;
  nombre: string;
  comentario: string;
  pais: string;
  ip: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ContactoCreationAttributes extends Optional<ContactoAttributes, 'id'> {}

class ContactoModel extends Model<ContactoAttributes, ContactoCreationAttributes> implements ContactoAttributes {
  public id!: number;
  public email!: string;
  public nombre!: string;
  public comentario!: string;
  public pais!: string;
  public ip!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Payment
interface PaymentAttributes {
  id: number;
  correo: string;
  nombreTitular: string;
  cardNumber: string;
  expMonth: number;
  expYear: number;
  cvv: string;
  currency: string;
  amount: string;
  descripcion: string;
  reference: string;
  estado: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface PaymentCreationAttributes extends Optional<PaymentAttributes, 'id'> {}

class PaymentModel extends Model<PaymentAttributes, PaymentCreationAttributes> implements PaymentAttributes {
  public id!: number;
  public correo!: string;
  public nombreTitular!: string;
  public cardNumber!: string;
  public expMonth!: number;
  public expYear!: number;
  public cvv!: string;
  public currency!: string;
  public amount!: string;
  public descripcion!: string;
  public reference!: string;
  public estado!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// User
interface UserAttributes {
  id: number;
  username?: string;
  email: string;
  password_hash?: string | null;
  googleId?: string;
  provider?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'createdAt' | 'updatedAt' | 'password_hash' | 'googleId' | 'provider'> {}

export class UserModel extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public email!: string;
  public username?: string;
  public password_hash?: string | null;
  public googleId?: string;
  public provider?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Sequelize setup
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../config/base.db')
});

// Init models
ContactoModel.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  email: { type: DataTypes.STRING(30), allowNull: false },
  nombre: { type: DataTypes.STRING(30), allowNull: false },
  comentario: { type: DataTypes.STRING(30), allowNull: false },
  pais: { type: DataTypes.STRING, allowNull: false },
  ip: { type: DataTypes.STRING, allowNull: false }
}, {
  sequelize,
  modelName: 'contacto',
  timestamps: true,
  freezeTableName: true
});

PaymentModel.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  correo: { type: DataTypes.STRING(50), allowNull: false, validate: { isEmail: true } },
  nombreTitular: { type: DataTypes.STRING(60), allowNull: false },
  cardNumber: { type: DataTypes.STRING(19), allowNull: false },
  expMonth: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 12 } },
  expYear: { type: DataTypes.INTEGER, allowNull: false, validate: { min: new Date().getFullYear() } },
  cvv: { type: DataTypes.STRING(4), allowNull: false },
  currency: { type: DataTypes.STRING(3), allowNull: false },
  amount: { type: DataTypes.DECIMAL, allowNull: false },
  descripcion: { type: DataTypes.STRING, allowNull: false },
  reference: { type: DataTypes.STRING, allowNull: false },
  estado: { type: DataTypes.STRING(20), allowNull: false, defaultValue: 'pendiente' }
}, {
  sequelize,
  modelName: 'payment',
  timestamps: true,
  freezeTableName: true
});

UserModel.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  username: { type: DataTypes.STRING, allowNull: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password_hash: { type: DataTypes.STRING, allowNull: true },
  googleId: { type: DataTypes.STRING, allowNull: true },
  provider: { type: DataTypes.STRING, allowNull: true, defaultValue: 'local' }
}, {
  sequelize,
  modelName: 'user',
  tableName: 'user',
  timestamps: true
});

class ContactsModel {
  constructor() {
    this.connect();
  }

  private async connect(): Promise<void> {
    try {
      await sequelize.sync({ force: false });
      console.log('Base de datos sincronizada correctamente');
    } catch (error) {
      console.error('Error al sincronizar la base de datos:', error);
      throw error;
    }
  }

  public async addContact(contactData: ContactoCreationAttributes): Promise<ContactoModel> {
    return await ContactoModel.create(contactData);
  }

  public async getAllContacts(): Promise<ContactoAttributes[]> {
    const result = await ContactoModel.findAll({ raw: true, order: [['createdAt', 'DESC']] });
    return result as unknown as ContactoAttributes[];
  }

  public async getContactById(id: number): Promise<ContactoModel | null> {
    return await ContactoModel.findByPk(id);
  }

  public async paymentAdd(paymentData: PaymentCreationAttributes): Promise<PaymentModel> {
    const cleanedCardNumber = paymentData.cardNumber.replace(/\s/g, '');
    return await PaymentModel.create({
      ...paymentData,
      estado: paymentData.estado || 'pendiente',
      cardNumber: cleanedCardNumber
    });
  }

  public async getAllPayments(): Promise<PaymentAttributes[]> {
    const result = await PaymentModel.findAll({ raw: true, order: [['createdAt', 'DESC']] });
    return result as unknown as PaymentAttributes[];
  }

  public async filterPayment(where: WhereOptions<PaymentAttributes>): Promise<PaymentAttributes[]> {
    const result = await PaymentModel.findAll({ where, order: [['createdAt', 'DESC']] });
    return result as unknown as PaymentAttributes[];
  }

  public async registerUser(data: UserCreationAttributes): Promise<UserModel> {
    return await UserModel.create(data);
  }

  public async loginPost(data: { email: string; password: string }): Promise<{ success: boolean; message?: string; user?: any }>
  {
    console.log(data, '← datos recibidos en loginPost');

    const user = await UserModel.findOne({ where: { email: data.email }, raw: true});
    console.log(user,'  xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx MODEL');
    if (!user) return { success: false, message: 'Usuario no encontrado' };

  // Validar si es usuario de Google
    if (user.provider === 'google') {
      return { success: false, message: 'Este usuario debe iniciar sesión con Google' };
    }

  // Validar que tenga una contraseña seteada
    if (!user.password_hash) {
      return { success: false, message: 'El usuario no tiene contraseña establecida' };
    }

    const isMatch = await bcrypt.compare(data.password, user.password_hash);
    if (!isMatch) return { success: false, message: 'Contraseña incorrecta' };

    return { success: true, user };
  }



  public getModelUser(): typeof UserModel {
    return UserModel;
  }

  public async getFilteredContact(query: string): Promise<ContactoAttributes[]> {
    let whereCondition = {};
    if (query) {
      whereCondition = {
        [Op.or]: [
          { nombre: { [Op.like]: `%${query}%` } },
          { email: { [Op.like]: `%${query}%` } }
        ]
      };
    }
    const result = await ContactoModel.findAll({ where: whereCondition });
    return result as unknown as ContactoAttributes[];
  }
}

const contactosModelInstance = new ContactsModel();
export default contactosModelInstance;