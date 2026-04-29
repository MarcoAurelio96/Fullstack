import User from '../models/User.js';

export const getUser = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: "Email requerido" });
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "No encontrado" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const { email, name, age, gender, height, weight } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "Ya existe" });
    user = new User({ email, name, age, gender, height, weight });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { email, age, gender, height, weight } = req.body;
    const user = await User.findOneAndUpdate(
      { email },
      { age, gender, height, weight },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "No encontrado" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};