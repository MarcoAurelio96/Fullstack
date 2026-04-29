const User = require('../models/User');

const getUser = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: "Email es requerido" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el usuario", error: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { email, name, age, gender, height, weight } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "El usuario ya existe en la base de datos" });
    }

    user = new User({ email, name, age, gender, height, weight });
    await user.save();

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error al crear el usuario", error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { email, age, gender, height, weight } = req.body;

    const user = await User.findOneAndUpdate(
      { email },
      { age, gender, height, weight },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el usuario", error: error.message });
  }
};

module.exports = { getUser, createUser, updateUser };