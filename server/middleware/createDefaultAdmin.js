import bcrypt from "bcryptjs";
import User from "./models/User.js";

// After mongoose.connect
const createDefaultAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: "admin" });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("Admin@123", 10);
      const admin = new User({
        fullName: "System Administrator",
        email: "admin@umuahiasouth.gov.ng",
        phone: "08012345678",
        dateOfBirth: new Date("1990-01-01"),
        community: "Umuahia Urban",
        address: "Umuahia South LGA Secretariat",
        occupation: "Administrator",
        password: hashedPassword,
        role: "admin",
      });

      await admin.save();
      console.log("Default admin created:");
      console.log("Email: admin@umuahiasouth.gov.ng");
      console.log(hashedPassword); //Admin@123 is the password
    }
  } catch (error) {
    console.error("Error creating default admin:", error);
  }
};

export default createDefaultAdmin;
