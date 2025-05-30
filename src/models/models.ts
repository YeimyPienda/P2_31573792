import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

import path from 'path';
import { fileURLToPath } from 'url'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Definición de la interfaz para los atributos del Contacto
interface ContactoAttributes {
  id?: number;
  email: string;
  nombre: string;
  comentario: string;
  pais:string;
  ip: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Atributos opcionales para creación (id es autoincremental)
interface ContactoCreationAttributes extends Optional<ContactoAttributes, 'id'> {}

// Clase del modelo Contacto con TypeScript
class ContactoModel extends Model<ContactoAttributes, ContactoCreationAttributes>{
  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Añade estas interfaces al archivo
interface PaymentAttributes {
  id?: number;
  correo: string;
  nombreTitular: string;
  cardNumber: string;
  expMonth: number;
  expYear: number;
  cvv:string;
  currency: string;
  amount:string;
  descripcion:string;
  reference:string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface PaymentCreationAttributes extends Optional<PaymentAttributes, 'id'> {}

class PaymentModel extends Model<PaymentAttributes, PaymentCreationAttributes>{
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Configuración de Sequelize
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../config/base.db'),
});

// Inicialización del modelo
ContactoModel.init(
  {
    id:{
      type:DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    email:{
      type: DataTypes.STRING(30),
      allowNull: false
    },
    nombre:{
      type: DataTypes.STRING(30),
      allowNull: false
    },
    comentario: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    pais:{
      type:DataTypes.STRING,
      allowNull:false
    },
    ip:{
      type:DataTypes.STRING,
      allowNull:false
    }
  },
  {
    sequelize,
    modelName: 'contacto',
    timestamps: true,
    freezeTableName: true
  }
);

// Inicialización del modelo Payment
PaymentModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    correo: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    nombreTitular: {
      type: DataTypes.STRING(60),
      allowNull: false
    },
    cardNumber: {
      type: DataTypes.STRING(19), // Para formato "4242 4242 4242 4242"
      allowNull: false
    },
    expMonth: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 12
      }
    },
    expYear: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: new Date().getFullYear()
      }
    },
    cvv: {
      type: DataTypes.STRING(4),
      allowNull: false
    },
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false
    },
    amount:{
      type:DataTypes.DECIMAL,
      allowNull:false
    },
    descripcion:{
      type:DataTypes.STRING,
      allowNull:false
    },
    reference:{
      type:DataTypes.STRING,
      allowNull:false
    }
  },
  {
    sequelize,
    modelName: 'payment',
    timestamps: true,
    freezeTableName: true
  }
);

class ContactsModel {
  constructor() {
    this.connect();
  }

  /**
   * Conecta y sincroniza el modelo con la base de datos
   * @returns {Promise<void>}
   */
  private async connect():Promise<void>{
    try {
      await sequelize.sync({force:false});
      console.log('Base de datos sincronizada correctamente');
       console.log('Ubicación de la base de datos:', path.join(__dirname, '../config/base.db'))
    } catch (error) {
      console.error('Error al sincronizar la base de datos:', error);
      throw error;
    }
  }

  /**
   * Agrega un nuevo contacto
   * @param {ContactoCreationAttributes} contactData - Datos del contacto
   * @returns {Promise<ContactoModel>} El contacto creado
   */
  public async addContact(contactData: ContactoCreationAttributes): Promise<ContactoModel> {
    try {
      return await ContactoModel.create(contactData);
    } catch (error) {
      console.error('Error al agregar el contacto:', error);
      throw error;
    }
  }

  /**
   * Obtiene todos los contactos
   * @returns {Promise<ContactoModel[]>} Lista de contactos
   */
  public async getAllContacts(): Promise<any[]> {
  try {
    const data = await ContactoModel.findAll({ 
      raw: true, // Devuelve objetos planos
      order: [['createdAt','DESC']] // Ordenar por fecha
    });
    return data;
  } catch (error) {
    console.error('Error al obtener contactos:', error);
    throw error;
  }
}

  // Ejemplo de método adicional con TypeScript
  /**
   * Obtiene un contacto por ID
   * @param {number} id - ID del contacto
   * @returns {Promise<ContactoModel | null>} El contacto encontrado o null
   */
  public async getContactById(id: number): Promise<ContactoModel | null> {
    try {
      return await ContactoModel.findByPk(id);
    } catch (error) {
      console.error('Error al obtener el contacto:', error);
      throw error;
    }
  }

  /**
   * Agrega un nuevo pago
   * @param {PaymentCreationAttributes} paymentData - Datos del pago
   * @returns {Promise<PaymentModel>} El pago creado
   */
  public async paymentAdd(paymentData: PaymentCreationAttributes): Promise<PaymentModel> {
    try {
      // Limpiamos espacios en el número de tarjeta
      const cleanedCardNumber = paymentData.cardNumber.replace(/\s/g, '');
      
      return await PaymentModel.create({
        ...paymentData,
        cardNumber: cleanedCardNumber
      });
    } catch (error) {
      console.error('Error al agregar el pago:', error);
      throw error;
    }
  }

  /**
   * Obtiene todos los pagos
   * @returns {Promise<PaymentModel[]>} Lista de pagos
   */
  public async getAllPayments(): Promise<any[]> {
    try {
      return await PaymentModel.findAll({
        raw: true,
        order: [['createdAt', 'DESC']]
      });
    } catch (error) {
      console.error('Error al obtener los pagos:', error);
      throw error;
    }
  }
}

// Exportamos una instancia única del modelo (Singleton)
const contactosModelInstance = new ContactsModel();
export default contactosModelInstance;